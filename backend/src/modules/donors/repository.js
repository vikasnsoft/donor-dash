import { BaseRepository } from '../shared/repository.js';
import Donor from './model.js';

class DonorRepository extends BaseRepository {
  constructor() {
    super(Donor);
  }

  async findByOrganisation(orgId, filters = {}, options = {}) {
    const filter = { organisation: orgId, ...filters };
    return await this.paginate(filter, {
      select: 'name type phone email address.city tags stats.totalDonated stats.lastDonationDate stats.donationCount preferredLanguage createdAt',
      sort: '-createdAt',
      ...options,
    });
  }

  async findDuplicates(orgId, { phone, email }) {
    const conditions = [];
    if (phone) conditions.push({ phone });
    if (email) conditions.push({ email });
    if (conditions.length === 0) return [];

    return await this.model.find({
      organisation: orgId,
      $or: conditions,
    }).select('name phone email type');
  }

  async search(orgId, query, options = {}) {
    const filter = {
      organisation: orgId,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    };
    return await this.paginate(filter, {
      select: 'name type phone email address.city stats.totalDonated',
      ...options,
    });
  }

  async updateStats(donorId, donationAmount, session) {
    return await this.model.findByIdAndUpdate(
      donorId,
      {
        $inc: {
          'stats.totalDonated': donationAmount,
          'stats.donationCount': 1,
        },
        $set: {
          'stats.lastDonationDate': new Date(),
          'stats.lastDonationAmount': donationAmount,
        },
        $setOnInsert: {
          'stats.firstDonationDate': new Date(),
        },
      },
      { new: true, upsert: false, session }
    );
  }
}

export default new DonorRepository();
