import { BaseRepository } from '../shared/repository.js';
import Expense from './model.js';
import Balance from './model.balance.js';
import mongoose from 'mongoose';

class ExpenseRepository extends BaseRepository {
  constructor() {
    super(Expense);
  }

  async findByGroup(groupId, filters = {}, options = {}) {
    const filter = { group: groupId, isDeleted: false, ...filters };
    return await this.paginate(filter, {
      populate: [
        { path: 'paidBy', select: 'name avatar' },
        { path: 'splits.user', select: 'name avatar' },
      ],
      sort: '-date',
      ...options,
    });
  }

  async findByUser(userId, options = {}) {
    return await this.paginate(
      { 'splits.user': userId, isDeleted: false },
      {
        populate: [
          { path: 'paidBy', select: 'name avatar' },
          { path: 'group', select: 'name' },
        ],
        sort: '-date',
        ...options,
      }
    );
  }
}

class BalanceRepository {
  // Get balance between two users in a group
  async getBetween(groupId, fromId, toId) {
    return await Balance.findOne({ group: groupId, from: fromId, to: toId });
  }

  // Update balance between two users with normalization.
  // Ensures no bidirectional balances: always stores the net as a single directional record.
  async updateBetween(groupId, fromId, toId, deltaAmount, session) {
    // Check for existing balance in the SAME direction
    const existing = await Balance.findOne({ group: groupId, from: fromId, to: toId });
    // Check for existing balance in the OPPOSITE direction
    const reverse = await Balance.findOne({ group: groupId, from: toId, to: fromId });

    if (reverse) {
      // Normalize: net the amounts and keep one direction
      const reverseAmount = parseFloat(reverse.amount.toString());
      const netAmount = reverseAmount - deltaAmount;

      if (netAmount > 0.01) {
        // Reverse direction still dominates: update reverse record
        await Balance.findByIdAndUpdate(
          reverse._id,
          { amount: mongoose.Types.Decimal128.fromString(String(netAmount)) },
          { session }
        );
        if (existing) await Balance.deleteOne({ _id: existing._id }, { session });
      } else if (netAmount < -0.01) {
        // New direction dominates: switch direction
        await Balance.findByIdAndUpdate(
          reverse._id,
          {
            from: fromId,
            to: toId,
            amount: mongoose.Types.Decimal128.fromString(String(Math.abs(netAmount))),
          },
          { session }
        );
        if (existing) await Balance.deleteOne({ _id: existing._id }, { session });
      } else {
        // Net is zero: delete both
        await Balance.deleteOne({ _id: reverse._id }, { session });
        if (existing) await Balance.deleteOne({ _id: existing._id }, { session });
      }
      return null;
    }

    // No reverse exists — normal case
    if (existing) {
      const current = parseFloat(existing.amount.toString());
      const newAmount = current + deltaAmount;

      if (Math.abs(newAmount) < 0.01) {
        await Balance.deleteOne({ _id: existing._id }, { session });
        return null;
      }

      return await Balance.findByIdAndUpdate(
        existing._id,
        { amount: mongoose.Types.Decimal128.fromString(String(Math.max(0, newAmount))) },
        { new: true, session }
      );
    } else if (deltaAmount > 0.01) {
      return await Balance.create([{
        group: groupId,
        from: fromId,
        to: toId,
        amount: mongoose.Types.Decimal128.fromString(String(deltaAmount)),
      }], { session });
    }
  }

  // Get all balances for a group
  async getGroupBalances(groupId) {
    return await Balance.find({ group: groupId, amount: { $gt: 0 } })
      .populate('from', 'name avatar')
      .populate('to', 'name avatar');
  }

  // Get net balance for a user across all groups
  async getUserSummary(userId) {
    const [owed, owing] = await Promise.all([
      Balance.aggregate([
        { $match: { from: userId, amount: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: { $toDouble: '$amount' } } } },
      ]),
      Balance.aggregate([
        { $match: { to: userId, amount: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: { $toDouble: '$amount' } } } },
      ]),
    ]);

    return {
      totalOwed: owed[0]?.total || 0,
      totalOwing: owing[0]?.total || 0,
      net: (owed[0]?.total || 0) - (owing[0]?.total || 0),
    };
  }

  // Simplify debts using greedy netting
  async simplifyDebts(groupId) {
    const balances = await this.getGroupBalances(groupId);

    // Compute net balance per person
    const net = {};
    for (const b of balances) {
      const fromId = b.from._id.toString();
      const toId = b.to._id.toString();
      const amount = parseFloat(b.amount.toString());

      if (!net[fromId]) net[fromId] = { user: b.from, amount: 0 };
      if (!net[toId]) net[toId] = { user: b.to, amount: 0 };

      net[fromId].amount -= amount;
      net[toId].amount += amount;
    }

    // Separate into debtors and creditors
    const debtors = Object.values(net).filter(n => n.amount < -0.01).sort((a, b) => a.amount - b.amount);
    const creditors = Object.values(net).filter(n => n.amount > 0.01).sort((a, b) => b.amount - a.amount);

    // Greedy matching
    const simplified = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const settleAmount = Math.min(Math.abs(debtor.amount), creditor.amount);

      if (settleAmount > 0.01) {
        simplified.push({
          from: debtor.user,
          to: creditor.user,
          amount: Math.round(settleAmount * 100) / 100,
        });
      }

      debtor.amount += settleAmount;
      creditor.amount -= settleAmount;

      if (Math.abs(debtor.amount) < 0.01) i++;
      if (Math.abs(creditor.amount) < 0.01) j++;
    }

    return simplified;
  }
}

export const expenseRepo = new ExpenseRepository();
export const balanceRepo = new BalanceRepository();
