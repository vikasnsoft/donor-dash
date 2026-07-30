import { BaseRepository } from '../shared/repository.js';
import Organisation from './model.js';

class OrganisationRepository extends BaseRepository {
  constructor() {
    super(Organisation);
  }

  async findBySlug(slug) {
    return await this.model.findOne({ slug, isActive: true })
      .populate('members.user', 'name email avatar')
      .populate('createdBy', 'name email');
  }

  async findByMember(userId, options = {}) {
    return await this.paginate(
      { 'members.user': userId, isActive: true },
      {
        select: 'name slug type description status address.city branding.logoUrl members createdAt',
        ...options,
      }
    );
  }

  async findByIdWithMembers(id) {
    return await this.model.findById(id)
      .populate('members.user', 'name email avatar phone')
      .populate('createdBy', 'name email');
  }

  async findPendingInvites(email) {
    return await this.model.find({
      'invites.email': email,
      'invites.status': 'pending',
    }).select('name slug type invites.$');
  }

  async addMember(orgId, userId, role, session) {
    return await this.model.findByIdAndUpdate(
      orgId,
      { $addToSet: { members: { user: userId, role, joinedAt: new Date() } } },
      { new: true, session }
    );
  }

  async removeMember(orgId, userId, session) {
    return await this.model.findByIdAndUpdate(
      orgId,
      { $pull: { members: { user: userId } } },
      { new: true, session }
    );
  }

  async updateMemberRole(orgId, userId, newRole) {
    return await this.model.findOneAndUpdate(
      { _id: orgId, 'members.user': userId },
      { $set: { 'members.$.role': newRole } },
      { new: true }
    );
  }
}

export default new OrganisationRepository();
