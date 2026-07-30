import { BaseRepository } from '../shared/repository.js';
import Group from './model.js';
import crypto from 'crypto';

class GroupRepository extends BaseRepository {
  constructor() {
    super(Group);
  }

  async findByUser(userId, options = {}) {
    return await this.paginate(
      { 'members.user': userId, isArchived: false },
      {
        populate: { path: 'members.user', select: 'name avatar' },
        sort: '-updatedAt',
        ...options,
      }
    );
  }

  async findByIdWithMembers(id) {
    return await this.model.findById(id)
      .populate('members.user', 'name email avatar')
      .populate('createdBy', 'name email');
  }

  async isMember(groupId, userId) {
    const group = await this.model.findById(groupId).select('members');
    if (!group) return false;
    return group.members.some(m => m.user.toString() === userId.toString());
  }

  async generateInviteCode(groupId) {
    const code = crypto.randomBytes(6).toString('hex');
    return await this.model.findByIdAndUpdate(
      groupId,
      { inviteCode: code },
      { new: true }
    );
  }

  async findByInviteCode(code) {
    return await this.model.findOne({ inviteCode: code, isArchived: false });
  }

  async addMember(groupId, userId, role = 'member') {
    return await this.model.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: { user: userId, role, joinedAt: new Date() } } },
      { new: true }
    );
  }

  async removeMember(groupId, userId) {
    return await this.model.findByIdAndUpdate(
      groupId,
      { $pull: { members: { user: userId } } },
      { new: true }
    );
  }
}

export default new GroupRepository();
