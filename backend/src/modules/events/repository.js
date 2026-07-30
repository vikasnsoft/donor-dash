import { BaseRepository } from '../shared/repository.js';
import Event from './model.js';

class EventRepository extends BaseRepository {
  constructor() {
    super(Event);
  }

  async findByOrganisation(orgId, filters = {}, options = {}) {
    const filter = { organisation: orgId, archivedAt: null, ...filters };
    return await this.paginate(filter, {
      select: 'name slug type status startDate endDate location.city financialYear totalDonations totalExpenses settings.visibility bannerImage createdAt',
      sort: '-startDate',
      ...options,
    });
  }

  async findByIdWithCommittee(id) {
    return await this.model.findById(id)
      .populate('committee.user', 'name email avatar phone')
      .populate('createdBy', 'name email')
      .populate('organisation', 'name slug');
  }

  async findBySlug(orgId, slug) {
    return await this.model.findOne({ organisation: orgId, slug, archivedAt: null })
      .populate('committee.user', 'name email avatar')
      .populate('organisation', 'name slug');
  }

  async addCommitteeMember(eventId, userId, role) {
    return await this.model.findByIdAndUpdate(
      eventId,
      { $push: { committee: { user: userId, role, assignedAt: new Date() } } },
      { new: true }
    );
  }

  async removeCommitteeMember(eventId, userId) {
    return await this.model.findByIdAndUpdate(
      eventId,
      { $pull: { committee: { user: userId } } },
      { new: true }
    );
  }

  async updateCommitteeRole(eventId, userId, newRole) {
    return await this.model.findOneAndUpdate(
      { _id: eventId, 'committee.user': userId },
      { $set: { 'committee.$.role': newRole } },
      { new: true }
    );
  }

  async isCommitteeMember(eventId, userId) {
    const event = await this.model.findById(eventId).select('committee');
    if (!event) return false;
    return event.committee.some(m => m.user.toString() === userId.toString() && m.isActive);
  }

  async getActiveEventsCount(orgId) {
    return await this.count({ organisation: orgId, status: 'active', archivedAt: null });
  }
}

export default new EventRepository();
