import { BaseRepository } from '../shared/repository.js';
import Donation from './model.js';

class DonationRepository extends BaseRepository {
  constructor() {
    super(Donation);
  }

  async findByEvent(eventId, filters = {}, options = {}) {
    const filter = { event: eventId, ...filters };
    return await this.paginate(filter, {
      populate: [
        { path: 'donor', select: 'name phone type' },
        { path: 'collectedBy', select: 'name' },
      ],
      sort: '-date',
      ...options,
    });
  }

  async findByDonor(donorId, options = {}) {
    return await this.paginate(
      { donor: donorId },
      {
        populate: { path: 'event', select: 'name slug' },
        sort: '-date',
        ...options,
      }
    );
  }

  async findByCampaign(campaignId, filters = {}, options = {}) {
    const filter = { campaign: campaignId, ...filters };
    return await this.paginate(filter, {
      populate: { path: 'donor', select: 'name phone type' },
      sort: '-date',
      ...options,
    });
  }

  async findByOrganisation(orgId, filters = {}, options = {}) {
    const filter = { organisation: orgId, ...filters };
    return await this.paginate(filter, {
      populate: [
        { path: 'donor', select: 'name phone type' },
        { path: 'event', select: name slug },
        { path: 'collectedBy', select: 'name' },
      ],
      sort: '-date',
      ...options,
    });
  }

  async getNextReceiptNumber(orgId) {
    const org = await mongoose.model('Organisation').findById(orgId).select('receipt');
    const prefix = org?.receipt?.prefix || 'REC';
    const nextNumber = org?.receipt?.nextNumber || 1;
    const receiptNumber = `${prefix}-${String(nextNumber).padStart(6, '0')}`;

    // Increment the counter
    await mongoose.model('Organisation').findByIdAndUpdate(orgId, {
      $inc: { 'receipt.nextNumber': 1 },
    });

    return receiptNumber;
  }

  async getDonationStats(orgId, eventId = null) {
    const matchStage = { organisation: orgId };
    if (eventId) matchStage.event = eventId;

    return await this.model.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          total: { $sum: { $toDouble: '$amount' } },
          count: { $sum: 1 },
        },
      },
    ]);
  }

  async getDailyDonations(eventId, startDate, endDate) {
    return await this.model.aggregate([
      {
        $match: {
          event: eventId,
          status: 'received',
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: { $toDouble: '$amount' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async getMethodBreakdown(eventId) {
    return await this.model.aggregate([
      { $match: { event: eventId, status: 'received' } },
      {
        $group: {
          _id: '$method',
          total: { $sum: { $toDouble: '$amount' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);
  }
}

export default new DonationRepository();
