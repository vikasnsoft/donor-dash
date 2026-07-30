import groupRepo from './repository.js';
import { emit } from '../shared/eventBus.js';
import { NotFoundError, ConflictError, AuthorizationError } from '../../utils/errors.js';

export const create = async (data, userId) => {
  const group = await groupRepo.create({
    ...data,
    createdBy: userId,
    members: [{ user: userId, role: 'admin' }],
  });

  await emit('group.created', { groupId: group._id, name: group.name, createdBy: userId });
  return await groupRepo.findByIdWithMembers(group._id);
};

export const getAll = async (userId, query) => {
  return await groupRepo.findByUser(userId, {
    page: query.page,
    limit: query.limit,
  });
};

export const getById = async (groupId, userId) => {
  const group = await groupRepo.findByIdWithMembers(groupId);
  if (!group || group.isArchived) throw new NotFoundError('Group', groupId);

  const isMember = group.members.some(m => m.user._id.toString() === userId.toString());
  if (!isMember) throw new AuthorizationError('Not a member of this group');

  return group;
};

export const update = async (groupId, data, userId) => {
  const group = await groupRepo.findById(groupId);
  if (!group) throw new NotFoundError('Group', groupId);

  const member = group.members.find(m => m.user.toString() === userId.toString());
  if (!member || member.role !== 'admin') throw new AuthorizationError('Only admins can update the group');

  delete data.members;
  delete data.createdBy;

  return await groupRepo.updateById(groupId, data);
};

export const addMember = async (groupId, targetUserId, role, userId) => {
  const group = await groupRepo.findById(groupId);
  if (!group) throw new NotFoundError('Group', groupId);

  const existing = group.members.find(m => m.user.toString() === targetUserId);
  if (existing) throw new ConflictError('User is already a member');

  const updated = await groupRepo.addMember(groupId, targetUserId, role);

  await emit('group.member.added', { groupId, userId: targetUserId, role, addedBy: userId });
  return updated;
};

export const removeMember = async (groupId, targetUserId, userId) => {
  const group = await groupRepo.findById(groupId);
  if (!group) throw new NotFoundError('Group', groupId);

  const updated = await groupRepo.removeMember(groupId, targetUserId);

  await emit('group.member.removed', { groupId, userId: targetUserId, removedBy: userId });
  return updated;
};

export const joinByInvite = async (inviteCode, userId) => {
  const group = await groupRepo.findByInviteCode(inviteCode);
  if (!group) throw new NotFoundError('Group (invalid invite code)');

  const existing = group.members.find(m => m.user.toString() === userId);
  if (existing) throw new ConflictError('Already a member of this group');

  return await groupRepo.addMember(group._id, userId, 'member');
};

export const generateInvite = async (groupId, userId) => {
  const group = await groupRepo.findById(groupId);
  if (!group) throw new NotFoundError('Group', groupId);

  return await groupRepo.generateInviteCode(groupId);
};

export const archive = async (groupId, userId) => {
  return await groupRepo.updateById(groupId, {
    isArchived: true,
    archivedAt: new Date(),
  });
};
