import orgRepo from './repository.js';
import { emit } from '../shared/eventBus.js';
import crypto from 'crypto';

export const create = async (data, userId) => {
  const org = await orgRepo.create({
    ...data,
    createdBy: userId,
    members: [{ user: userId, role: 'owner' }],
  });

  await emit('organisation.created', {
    orgId: org._id,
    name: org.name,
    createdBy: userId,
  });

  return org;
};

export const getAll = async (userId, query) => {
  return await orgRepo.findByMember(userId, {
    page: query.page,
    limit: query.limit,
    sort: query.sort || '-createdAt',
  });
};

export const getById = async (orgId, userId) => {
  const org = await orgRepo.findByIdWithMembers(orgId);

  if (!org) {
    const error = new Error('Organisation not found');
    error.statusCode = 404;
    throw error;
  }

  // Check membership
  const isMember = org.members.some(
    (m) => m.user._id.toString() === userId.toString()
  );
  if (!isMember) {
    const error = new Error('Not a member of this organisation');
    error.statusCode = 403;
    throw error;
  }

  return org;
};

export const getBySlug = async (slug, userId) => {
  const org = await orgRepo.findBySlug(slug);

  if (!org) {
    const error = new Error('Organisation not found');
    error.statusCode = 404;
    throw error;
  }

  const isMember = org.members.some(
    (m) => m.user._id.toString() === userId.toString()
  );
  if (!isMember) {
    const error = new Error('Not a member of this organisation');
    error.statusCode = 403;
    throw error;
  }

  return org;
};

export const update = async (orgId, data, userId) => {
  const org = await orgRepo.findById(orgId);

  if (!org) {
    const error = new Error('Organisation not found');
    error.statusCode = 404;
    throw error;
  }

  if (org.status === 'archived') {
    const error = new Error('Cannot update an archived organisation');
    error.statusCode = 400;
    throw error;
  }

  const member = org.members.find(
    (m) => m.user.toString() === userId.toString()
  );
  if (!member || !['owner', 'admin'].includes(member.role)) {
    const error = new Error('Only owners and admins can update the organisation');
    error.statusCode = 403;
    throw error;
  }

  // Prevent updating certain fields directly
  delete data.members;
  delete data.invites;
  delete data.createdBy;
  delete data.archivedAt;
  delete data.archivedBy;

  const updated = await orgRepo.updateById(orgId, data);

  await emit('organisation.updated', {
    orgId,
    updatedBy: userId,
    changes: Object.keys(data),
  });

  return updated;
};

export const archive = async (orgId, userId) => {
  const org = await orgRepo.findById(orgId);

  if (!org) {
    const error = new Error('Organisation not found');
    error.statusCode = 404;
    throw error;
  }

  const member = org.members.find(
    (m) => m.user.toString() === userId.toString()
  );
  if (!member || member.role !== 'owner') {
    const error = new Error('Only the owner can archive the organisation');
    error.statusCode = 403;
    throw error;
  }

  const updated = await orgRepo.updateById(orgId, {
    status: 'archived',
    archivedAt: new Date(),
    archivedBy: userId,
  });

  await emit('organisation.archived', { orgId, archivedBy: userId });

  return updated;
};

export const addMember = async (orgId, targetUserId, role, requesterId) => {
  const org = await orgRepo.findById(orgId);

  if (!org) {
    const error = new Error('Organisation not found');
    error.statusCode = 404;
    throw error;
  }

  if (org.status === 'archived') {
    const error = new Error('Cannot add members to an archived organisation');
    error.statusCode = 400;
    throw error;
  }

  const requester = org.members.find(
    (m) => m.user.toString() === requesterId.toString()
  );
  if (!requester || !['owner', 'admin'].includes(requester.role)) {
    const error = new Error('Only owners and admins can add members');
    error.statusCode = 403;
    throw error;
  }

  const existing = org.members.find(
    (m) => m.user.toString() === targetUserId.toString()
  );
  if (existing) {
    const error = new Error('User is already a member');
    error.statusCode = 400;
    throw error;
  }

  const updated = await orgRepo.addMember(orgId, targetUserId, role);

  await emit('organisation.member.added', {
    orgId,
    userId: targetUserId,
    role,
    addedBy: requesterId,
  });

  return updated;
};

export const removeMember = async (orgId, targetUserId, requesterId) => {
  const org = await orgRepo.findById(orgId);

  if (!org) {
    const error = new Error('Organisation not found');
    error.statusCode = 404;
    throw error;
  }

  const target = org.members.find(
    (m) => m.user.toString() === targetUserId.toString()
  );
  if (target && target.role === 'owner') {
    const error = new Error('Cannot remove the organisation owner');
    error.statusCode = 400;
    throw error;
  }

  const requester = org.members.find(
    (m) => m.user.toString() === requesterId.toString()
  );
  if (!requester || !['owner', 'admin'].includes(requester.role)) {
    const error = new Error('Only owners and admins can remove members');
    error.statusCode = 403;
    throw error;
  }

  const updated = await orgRepo.removeMember(orgId, targetUserId);

  await emit('organisation.member.removed', {
    orgId,
    userId: targetUserId,
    removedBy: requesterId,
  });

  return updated;
};

export const updateMemberRole = async (orgId, targetUserId, newRole, requesterId) => {
  const org = await orgRepo.findById(orgId);

  if (!org) {
    const error = new Error('Organisation not found');
    error.statusCode = 404;
    throw error;
  }

  const requester = org.members.find(
    (m) => m.user.toString() === requesterId.toString()
  );
  if (!requester || requester.role !== 'owner') {
    const error = new Error('Only the owner can change member roles');
    error.statusCode = 403;
    throw error;
  }

  const target = org.members.find(
    (m) => m.user.toString() === targetUserId.toString()
  );
  if (target && target.role === 'owner') {
    const error = new Error("Cannot change the owner's role");
    error.statusCode = 400;
    throw error;
  }

  const updated = await orgRepo.updateMemberRole(orgId, targetUserId, newRole);

  await emit('organisation.member.role_changed', {
    orgId,
    userId: targetUserId,
    newRole,
    changedBy: requesterId,
  });

  return updated;
};

export const inviteMember = async (orgId, email, role, requesterId) => {
  const org = await orgRepo.findById(orgId);

  if (!org) {
    const error = new Error('Organisation not found');
    error.statusCode = 404;
    throw error;
  }

  if (org.status === 'archived') {
    const error = new Error('Cannot invite to an archived organisation');
    error.statusCode = 400;
    throw error;
  }

  const requester = org.members.find(
    (m) => m.user.toString() === requesterId.toString()
  );
  if (!requester || !['owner', 'admin'].includes(requester.role)) {
    const error = new Error('Only owners and admins can send invites');
    error.statusCode = 403;
    throw error;
  }

  // Check if already a member
  const existingMember = org.members.find(
    (m) => m.user.email === email
  );
  if (existingMember) {
    const error = new Error('User is already a member');
    error.statusCode = 400;
    throw error;
  }

  // Check for existing pending invite
  const existingInvite = org.invites.find(
    (i) => i.email === email && i.status === 'pending'
  );
  if (existingInvite) {
    const error = new Error('Invite already pending for this email');
    error.statusCode = 400;
    throw error;
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  org.invites.push({
    email,
    role,
    token,
    invitedBy: requesterId,
    status: 'pending',
    expiresAt,
  });

  await org.save();

  await emit('organisation.invite.sent', {
    orgId,
    email,
    role,
    invitedBy: requesterId,
    token,
  });

  return org;
};

export const acceptInvite = async (orgId, token, userId) => {
  const org = await orgRepo.findById(orgId);

  if (!org) {
    const error = new Error('Organisation not found');
    error.statusCode = 404;
    throw error;
  }

  const invite = org.invites.find(
    (i) => i.token === token && i.status === 'pending'
  );

  if (!invite) {
    const error = new Error('Invalid or expired invite');
    error.statusCode = 400;
    throw error;
  }

  if (invite.expiresAt && invite.expiresAt < new Date()) {
    invite.status = 'expired';
    await org.save();
    const error = new Error('Invite has expired');
    error.statusCode = 400;
    throw error;
  }

  invite.status = 'accepted';
  await org.save();

  const updated = await orgRepo.addMember(orgId, userId, invite.role);

  await emit('organisation.member.joined', {
    orgId,
    userId,
    role: invite.role,
    via: 'invite',
  });

  return updated;
};

export const isMember = async (orgId, userId) => {
  const org = await orgRepo.findById(orgId, { select: 'members' });
  if (!org) return false;
  return org.members.some((m) => m.user.toString() === userId.toString());
};

export const isOwnerOrAdmin = async (orgId, userId) => {
  const org = await orgRepo.findById(orgId, { select: 'members' });
  if (!org) return false;
  const member = org.members.find(
    (m) => m.user.toString() === userId.toString()
  );
  return member && ['owner', 'admin'].includes(member.role);
};
