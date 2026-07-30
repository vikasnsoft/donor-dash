import mongoose from 'mongoose';
import { Projector, registry } from './engine.js';
import { on } from '../shared/eventBus.js';
import { DailyDonation, CampaignSummary, VolunteerPerformance, DonorRetention, FinancialSummary, EventOverview } from './models.js';
import Donation from '../donations/model.js';
import Event from '../events/model.js';

/**
 * Daily Donation Projector
 * Updates DailyDonation projection on donation events.
 */
class DailyDonationProjector extends Projector {
  constructor() {
    super('DailyDonation');
  }

  subscribe() {
    on('donation.recorded', this.createHandler('donation.recorded'));
    on('donation.cancelled', this.createHandler('donation.cancelled'));
  }

  async handle(event, payload) {
    const { eventId, orgId, amount, method } = payload;
    if (!eventId || !orgId) return;

    const date = new Date();
    date.setHours(0, 0, 0, 0);

    const amountNum = parseFloat(String(amount));

    if (event === 'donation.recorded') {
      await DailyDonation.findOneAndUpdate(
        { organisation: orgId, event: eventId, date },
        {
          $inc: {
            totalAmount: mongoose.Types.Decimal128.fromString(String(amountNum)),
            donationCount: 1,
            [`byMethod.${method}`]: mongoose.Types.Decimal128.fromString(String(amountNum)),
          },
          $set: { lastUpdated: new Date() },
        },
        { upsert: true, new: true }
      );
    } else if (event === 'donation.cancelled') {
      await DailyDonation.findOneAndUpdate(
        { organisation: orgId, event: eventId, date },
        {
          $inc: {
            totalAmount: mongoose.Types.Decimal128.fromString(String(-amountNum)),
            donationCount: -1,
            [`byMethod.${method}`]: mongoose.Types.Decimal128.fromString(String(-amountNum)),
          },
          $set: { lastUpdated: new Date() },
        }
      );
    }
  }

  async rebuild(orgId) {
    await DailyDonation.deleteMany({ organisation: orgId });

    const donations = await Donation.aggregate([
      { $match: { organisation: mongoose.Types.ObjectId.createFromHexString(orgId), status: 'received' } },
      {
        $group: {
          _id: { event: '$event', date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } } },
          totalAmount: { $sum: { $toDouble: '$amount' } },
          donationCount: { $sum: 1 },
        },
      },
    ]);

    for (const d of donations) {
      await DailyDonation.create({
        organisation: orgId,
        event: d._id.event,
        date: new Date(d._id.date),
        totalAmount: d.totalAmount,
        donationCount: d.donationCount,
      });
    }
  }
}

/**
 * Campaign Summary Projector
 * Updates CampaignSummary on donation and campaign events.
 */
class CampaignSummaryProjector extends Projector {
  constructor() {
    super('CampaignSummary');
  }

  subscribe() {
    on('donation.recorded', this.createHandler('donation.recorded'));
    on('campaign.updated', this.createHandler('campaign.updated'));
  }

  async handle(event, payload) {
    if (event === 'donation.recorded') {
      const { campaignId, eventId, orgId, amount, collectedBy } = payload;
      if (!campaignId) return;

      const amountNum = parseFloat(String(amount));

      const summary = await CampaignSummary.findOneAndUpdate(
        { campaign: campaignId },
        {
          $inc: {
            collected: mongoose.Types.Decimal128.fromString(String(amountNum)),
            donationCount: 1,
          },
          $set: { lastUpdated: new Date() },
        },
        { upsert: true, new: true }
      );

      // Update completion percentage
      const target = parseFloat(summary.target?.toString() || '0');
      const collected = parseFloat(summary.collected?.toString() || '0');
      if (target > 0) {
        await CampaignSummary.updateOne(
          { campaign: campaignId },
          { $set: { completionPercentage: Math.round((collected / target) * 100) } }
        );
      }
    }
  }

  async rebuild(orgId) {
    await CampaignSummary.deleteMany({ organisation: orgId });
    // Will be rebuilt from campaign and donation data
  }
}

/**
 * Volunteer Performance Projector
 * Updates VolunteerPerformance on donation events.
 */
class VolunteerPerformanceProjector extends Projector {
  constructor() {
    super('VolunteerPerformance');
  }

  subscribe() {
    on('donation.recorded', this.createHandler('donation.recorded'));
  }

  async handle(event, payload) {
    const { eventId, orgId, amount, collectedBy } = payload;
    if (!collectedBy || !eventId) return;

    const amountNum = parseFloat(String(amount));

    await VolunteerPerformance.findOneAndUpdate(
      { volunteer: collectedBy, event: eventId },
      {
        $inc: {
          totalCollected: mongoose.Types.Decimal128.fromString(String(amountNum)),
          donationCount: 1,
        },
        $set: {
          lastDonationAt: new Date(),
          lastUpdated: new Date(),
        },
        $setOnInsert: { organisation: orgId },
      },
      { upsert: true, new: true }
    );
  }

  async rebuild(orgId) {
    await VolunteerPerformance.deleteMany({ organisation: orgId });
  }
}

/**
 * Donor Retention Projector
 * Tracks repeat donors across events.
 */
class DonorRetentionProjector extends Projector {
  constructor() {
    super('DonorRetention');
  }

  subscribe() {
    on('donation.recorded', this.createHandler('donation.recorded'));
  }

  async handle(event, payload) {
    const { donorId, eventId, orgId, amount } = payload;
    if (!donorId) return;

    const amountNum = parseFloat(String(amount));

    const existing = await DonorRetention.findOne({ donor: donorId, organisation: orgId });

    if (existing) {
      const eventsAttended = existing.eventsAttended + 1;
      const totalDonated = parseFloat(existing.totalDonated.toString()) + amountNum;

      await DonorRetention.updateOne(
        { donor: donorId, organisation: orgId },
        {
          $set: {
            eventsAttended,
            totalDonated: mongoose.Types.Decimal128.fromString(String(totalDonated)),
            averageDonation: mongoose.Types.Decimal128.fromString(String(totalDonated / eventsAttended)),
            lastDonationDate: new Date(),
            isReturning: eventsAttended > 1,
            lastUpdated: new Date(),
          },
        }
      );
    } else {
      await DonorRetention.create({
        donor: donorId,
        organisation: orgId,
        eventsAttended: 1,
        totalDonated: amountNum,
        averageDonation: amountNum,
        firstDonationDate: new Date(),
        lastDonationDate: new Date(),
        isReturning: false,
      });
    }
  }

  async rebuild(orgId) {
    await DonorRetention.deleteMany({ organisation: orgId });
  }
}

/**
 * Financial Summary Projector
 * Updates FinancialSummary from ledger events.
 * This is the treasurer's dashboard source.
 */
class FinancialSummaryProjector extends Projector {
  constructor() {
    super('FinancialSummary', 1);
  }

  subscribe() {
    on('donation.recorded', this.createHandler('donation.recorded'));
    on('donation.cancelled', this.createHandler('donation.cancelled'));
    on('expense.created', this.createHandler('expense.created'));
  }

  async handle(event, payload) {
    const { orgId } = payload;
    if (!orgId) return;

    // Get current summary or create
    let summary = await FinancialSummary.findOne({ organisation: orgId });
    if (!summary) {
      summary = await FinancialSummary.create({ organisation: orgId });
    }

    const amount = parseFloat(String(payload.amount || 0));

    if (event === 'donation.recorded') {
      await FinancialSummary.updateOne(
        { organisation: orgId },
        {
          $inc: { totalDonations: mongoose.Types.Decimal128.fromString(String(amount)) },
          $set: { lastDonationAt: new Date(), lastUpdated: new Date() },
        }
      );
    } else if (event === 'donation.cancelled') {
      await FinancialSummary.updateOne(
        { organisation: orgId },
        {
          $inc: { totalDonations: mongoose.Types.Decimal128.fromString(String(-amount)) },
          $set: { lastUpdated: new Date() },
        }
      );
    } else if (event === 'expense.created') {
      const category = payload.category || 'misc';
      await FinancialSummary.updateOne(
        { organisation: orgId },
        {
          $inc: {
            totalExpenses: mongoose.Types.Decimal128.fromString(String(amount)),
            [`expensesByCategory.${category}`]: amount,
          },
          $set: { lastExpenseAt: new Date(), lastUpdated: new Date() },
        }
      );
    }
  }

  async rebuild(orgId) {
    // Rebuild from ledger data
    const LedgerEntry = mongoose.model('LedgerEntry');
    const Account = mongoose.model('Account');

    // Get account balances from ledger
    const cashAccount = await Account.findOne({ code: '1000' });
    const bankAccount = await Account.findOne({ code: '1010' });

    if (cashAccount && bankAccount) {
      // Aggregate from ledger entries
      const totals = await LedgerEntry.aggregate([
        { $match: { organisation: mongoose.Types.ObjectId.createFromHexString(orgId), status: 'posted' } },
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
              lineType: '$lines.type',
            },
            total: { $sum: { $toDouble: '$lines.amount' } },
          },
        },
      ]);

      let totalIncome = 0;
      let totalExpenses = 0;

      for (const t of totals) {
        if (t._id.accountType === 'income') {
          totalIncome += t._id.lineType === 'credit' ? t.total : -t.total;
        } else if (t._id.accountType === 'expense') {
          totalExpenses += t._id.lineType === 'debit' ? t.total : -t.total;
        }
      }

      await FinancialSummary.findOneAndUpdate(
        { organisation: orgId },
        {
          totalDonations: totalIncome,
          totalExpenses,
          lastUpdated: new Date(),
          '_projection.rebuiltAt': new Date(),
        },
        { upsert: true }
      );
    }
  }
}

/**
 * Event Overview Projector
 * Updates EventOverview — used for event cards on dashboards.
 */
class EventOverviewProjector extends Projector {
  constructor() {
    super('EventOverview', 1);
  }

  subscribe() {
    on('donation.recorded', this.createHandler('donation.recorded'));
    on('expense.created', this.createHandler('expense.created'));
    on('event.created', this.createHandler('event.created'));
    on('event.updated', this.createHandler('event.updated'));
  }

  async handle(event, payload) {
    if (event === 'event.created') {
      const { eventId, orgId, name, type } = payload;
      const eventData = await Event.findById(eventId);
      if (!eventData) return;

      await EventOverview.findOneAndUpdate(
        { event: eventId },
        {
          event: eventId,
          organisation: orgId,
          name: eventData.name,
          type: eventData.type,
          status: eventData.status,
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          committeeSize: eventData.committee?.length || 0,
          budgetAllocated: eventData.budget?.totalAllocated || 0,
          lastUpdated: new Date(),
        },
        { upsert: true }
      );
    } else if (event === 'event.updated') {
      const { eventId } = payload;
      const eventData = await Event.findById(eventId);
      if (!eventData) return;

      await EventOverview.updateOne(
        { event: eventId },
        {
          $set: {
            name: eventData.name,
            status: eventData.status,
            startDate: eventData.startDate,
            endDate: eventData.endDate,
            committeeSize: eventData.committee?.length || 0,
            lastUpdated: new Date(),
          },
        }
      );
    } else if (event === 'donation.recorded') {
      const { eventId, orgId, amount } = payload;
      if (!eventId) return;

      const amountNum = parseFloat(String(amount));

      await EventOverview.findOneAndUpdate(
        { event: eventId },
        {
          $inc: {
            totalDonations: mongoose.Types.Decimal128.fromString(String(amountNum)),
            donorCount: 1,
          },
          $set: { lastUpdated: new Date() },
          $setOnInsert: { organisation: orgId },
        },
        { upsert: true }
      );
    } else if (event === 'expense.created') {
      const { eventId, orgId, amount } = payload;
      if (!eventId) return;

      const amountNum = parseFloat(String(amount));

      await EventOverview.findOneAndUpdate(
        { event: eventId },
        {
          $inc: { totalExpenses: mongoose.Types.Decimal128.fromString(String(amountNum)) },
          $set: { lastUpdated: new Date() },
          $setOnInsert: { organisation: orgId },
        },
        { upsert: true }
      );
    }
  }

  async rebuild(orgId) {
    await EventOverview.deleteMany({ organisation: orgId });

    const events = await Event.find({ organisation: orgId });
    for (const ev of events) {
      await EventOverview.create({
        event: ev._id,
        organisation: orgId,
        name: ev.name,
        type: ev.type,
        status: ev.status,
        startDate: ev.startDate,
        endDate: ev.endDate,
        totalDonations: ev.totalDonations || 0,
        totalExpenses: ev.totalExpenses || 0,
        committeeSize: ev.committee?.length || 0,
        budgetAllocated: ev.budget?.totalAllocated || 0,
      });
    }
  }
}

// Register all projectors
export const registerProjectors = () => {
  registry.register(new DailyDonationProjector());
  registry.register(new CampaignSummaryProjector());
  registry.register(new VolunteerPerformanceProjector());
  registry.register(new DonorRetentionProjector());
  registry.register(new FinancialSummaryProjector());
  registry.register(new EventOverviewProjector());
};
