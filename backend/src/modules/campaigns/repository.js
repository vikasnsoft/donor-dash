import { BaseRepository } from '../shared/repository.js';
import Campaign from './model.js';

class CampaignRepository extends BaseRepository {
  constructor() {
    super(Campaign);
  }

  async findByEvent(eventId, filters = {}, options = {}) {
    const filter = { event: eventId, archivedAt: null, ...filters };
    return await this.paginate(filter, {
      select: 'name type status target collected donationCount startDate endDate acceptedMethods routes.length createdAt',
      sort: '-createdAt',
      ...options,
    });
  }

  async findByIdWithRoutes(id) {
    return await this.model.findById(id)
      .populate('routes.volunteer', 'name email avatar')
      .populate('createdBy', 'name email')
      .populate('event', 'name slug status');
  }

  async addRoute(campaignId, routeData) {
    return await this.model.findByIdAndUpdate(
      campaignId,
      { $push: { routes: routeData } },
      { new: true }
    );
  }

  async updateRoute(campaignId, routeId, routeData) {
    return await this.model.findOneAndUpdate(
      { _id: campaignId, 'routes._id': routeId },
      { $set: { 'routes.$': { ...routeData, _id: routeId } } },
      { new: true }
    );
  }

  async assignVolunteer(campaignId, routeId, volunteerId) {
    return await this.model.findOneAndUpdate(
      { _id: campaignId, 'routes._id': routeId },
      { $set: { 'routes.$.volunteer': volunteerId } },
      { new: true }
    );
  }

  async updateCollected(campaignId, amount, session) {
    return await this.model.findByIdAndUpdate(
      campaignId,
      {
        $inc: {
          collected: amount,
          donationCount: 1,
        },
      },
      { new: true, session }
    );
  }
}

export default new CampaignRepository();
