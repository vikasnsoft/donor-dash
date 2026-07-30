import { BaseRepository } from '../shared/repository.js';
import LedgerEntry from './model.entry.js';
import Account from './model.account.js';
import mongoose from 'mongoose';

class LedgerEntryRepository extends BaseRepository {
  constructor() {
    super(LedgerEntry);
  }

  async findByOrganisation(orgId, filters = {}, options = {}) {
    const filter = { organisation: orgId, ...filters };
    return await this.paginate(filter, {
      populate: [
        { path: 'lines.account', select: 'name code type' },
        { path: 'createdBy', select: 'name' },
      ],
      sort: '-date',
      ...options,
    });
  }

  async findByEvent(eventId, filters = {}, options = {}) {
    const filter = { event: eventId, status: 'posted', ...filters };
    return await this.paginate(filter, {
      populate: { path: 'lines.account', select: 'name code type' },
      sort: '-date',
      ...options,
    });
  }

  async getNextEntryNumber(orgId) {
    const last = await this.model.findOne({ organisation: orgId })
      .sort({ entryNumber: -1 })
      .select('entryNumber');

    if (!last) return 'JE-000001';

    const lastNum = parseInt(last.entryNumber.replace('JE-', ''), 10) || 0;
    return `JE-${String(lastNum + 1).padStart(6, '0')}`;
  }

  async getAccountBalance(accountId, orgId, upToDate = null) {
    const matchStage = {
      status: 'posted',
      organisation: orgId,
      'lines.account': accountId,
    };
    if (upToDate) matchStage.date = { $lte: upToDate };

    const result = await this.model.aggregate([
      { $match: matchStage },
      { $unwind: '$lines' },
      { $match: { 'lines.account': accountId } },
      {
        $group: {
          _id: '$lines.type',
          total: { $sum: { $toDouble: '$lines.amount' } },
        },
      },
    ]);

    let debits = 0;
    let credits = 0;
    for (const r of result) {
      if (r._id === 'debit') debits = r.total;
      else credits = r.total;
    }

    return { debits, credits, balance: debits - credits };
  }

  async getTrialBalance(orgId, upToDate = null) {
    const matchStage = { organisation: orgId, status: 'posted' };
    if (upToDate) matchStage.date = { $lte: upToDate };

    return await this.model.aggregate([
      { $match: matchStage },
      { $unwind: '$lines' },
      {
        $group: {
          _id: {
            account: '$lines.account',
            type: '$lines.type',
          },
          total: { $sum: { $toDouble: '$lines.amount' } },
        },
      },
      {
        $group: {
          _id: '$_id.account',
          debits: {
            $sum: { $cond: [{ $eq: ['$_id.type', 'debit'] }, '$total', 0] },
          },
          credits: {
            $sum: { $cond: [{ $eq: ['$_id.type', 'credit'] }, '$total', 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'accounts',
          localField: '_id',
          foreignField: '_id',
          as: 'account',
        },
      },
      { $unwind: '$account' },
      {
        $project: {
          accountId: '$_id',
          accountName: '$account.name',
          accountCode: '$account.code',
          accountType: '$account.type',
          debits: 1,
          credits: 1,
          balance: { $subtract: ['$debits', '$credits'] },
        },
      },
      { $sort: { accountCode: 1 } },
    ]);
  }

  async getCashBook(orgId, startDate, endDate) {
    const cashAccount = await Account.findOne({ code: '1000', organisation: { $in: [orgId, null] } });
    if (!cashAccount) return { entries: [], totalIn: 0, totalOut: 0 };

    const entries = await this.model.find({
      organisation: orgId,
      status: 'posted',
      date: { $gte: startDate, $lte: endDate },
      'lines.account': cashAccount._id,
    })
      .sort({ date: 1 })
      .populate('lines.account', 'name code');

    let totalIn = 0;
    let totalOut = 0;

    const formatted = entries.map(entry => {
      const cashLine = entry.lines.find(l => l.account._id.toString() === cashAccount._id.toString());
      const amount = parseFloat(cashLine.amount.toString());
      const isDebit = cashLine.type === 'debit';

      if (isDebit) totalIn += amount;
      else totalOut += amount;

      return {
        date: entry.date,
        entryNumber: entry.entryNumber,
        description: entry.description,
        in: isDebit ? amount : 0,
        out: !isDebit ? amount : 0,
        sourceType: entry.sourceType,
      };
    });

    return {
      entries: formatted,
      totalIn: Math.round(totalIn * 100) / 100,
      totalOut: Math.round(totalOut * 100) / 100,
      balance: Math.round((totalIn - totalOut) * 100) / 100,
    };
  }

  async getEventSummary(eventId) {
    return await this.model.aggregate([
      { $match: { event: eventId, status: 'posted' } },
      { $unwind: '$lines' },
      {
        $lookup: {
          from: 'accounts',
          localField: 'lines.account',
          foreignField: '_id',
          as: 'account',
        },
      },
      { $unwind: '$account' },
      {
        $group: {
          _id: {
            accountType: '$account.type',
            accountName: '$account.name',
            lineType: '$lines.type',
          },
          total: { $sum: { $toDouble: '$lines.amount' } },
        },
      },
      {
        $group: {
          _id: {
            accountType: '$_id.accountType',
            accountName: '$_id.accountName',
          },
          debits: {
            $sum: { $cond: [{ $eq: ['$_id.lineType', 'debit'] }, '$total', 0] },
          },
          credits: {
            $sum: { $cond: [{ $eq: ['$_id.lineType', 'credit'] }, '$total', 0] },
          },
        },
      },
      { $sort: { '_id.accountType': 1, '_id.accountName': 1 } },
    ]);
  }
}

class AccountRepository extends BaseRepository {
  constructor() {
    super(Account);
  }

  async findByCode(code, orgId = null) {
    return await this.model.findOne({
      code,
      organisation: { $in: [orgId, null] },
      isActive: true,
    });
  }

  async findByType(type, orgId = null) {
    return await this.model.find({
      type,
      organisation: { $in: [orgId, null] },
      isActive: true,
    }).sort('code');
  }

  async getChartOfAccounts(orgId = null) {
    return await this.model.find({
      organisation: { $in: [orgId, null] },
      isActive: true,
    }).sort('code');
  }

  async updateBalance(accountId, amount, type, session) {
    // For debit-normal accounts (asset, expense): debit increases, credit decreases
    // For credit-normal accounts (liability, income, equity): credit increases, debit decreases
    const account = await this.model.findById(accountId);
    if (!account) return null;

    const delta = account.normalBalance === 'debit'
      ? (type === 'debit' ? amount : -amount)
      : (type === 'credit' ? amount : -amount);

    return await this.model.findByIdAndUpdate(
      accountId,
      { $inc: { balance: mongoose.Types.Decimal128.fromString(String(delta)) } },
      { new: true, session }
    );
  }
}

export const ledgerRepo = new LedgerEntryRepository();
export const accountRepo = new AccountRepository();
