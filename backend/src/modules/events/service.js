import eventRepo from './repository.js';
import orgRepo from '../organisations/repository.js';
import { emit } from '../shared/eventBus.js';
import { assertPermission } from '../shared/permissions.js';
import { NotFoundError, BusinessRuleError, ConflictError, AuthorizationError } from '../../utils/errors.js';
import { STATUS_TRANSITIONS } from './model.js';

/**
 * Validate and perform state transition.
 */
function validateTransition(currentStatus, newStatus) {
  const allowed = STATUS_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.includes(newStatus)) {
    throw new BusinessRuleError(
      `Cannot transition from '${currentStatus}' to '${newStatus}'`,
      'event.status_transition'
    );
  }
}

export const create = async (data, orgId, userId) => {
  const org = await orgRepo.findById(orgId);
  if (!org) throw new NotFoundError('Organisation', orgId);
  if (org.status === 'archived') throw new BusinessRuleError('Cannot create events in archived organisation', 'org.archived');

  // Permission: org owner/admin can create events
  assertPermission(userId, 'create', 'event', { org });

  const event = await eventRepo.create({
    ...data,
    organisation: orgId,
    createdBy: userId,
    committee: [{ user: userId, role: 'president' }],
  });

  await emit('event.created', {
    eventId: event._id,
    orgId,
    name: event.name,
    type: event.type,
    createdBy: userId,
  });

  return await eventRepo.findByIdWithCommittee(event._id);
};

export const getAll = async (orgId, userId, query) => {
  const org = await orgRepo.findById(orgId);
  if (!org) throw new NotFoundError('Organisation', orgId);

  // Verify membership
  const isMember = org.members.some(m => m.user.toString() === userId.toString());
  if (!isMember) throw new AuthorizationError('Not a member of this organisation');

  const filters = {};
  if (query.status) filters.status = query.status;
  if (query.type) filters.type = query.type;

  return await eventRepo.findByOrganisation(orgId, filters, {
    page: query.page,
    limit: query.limit,
    sort: query.sort || '-startDate',
  });
};

export const getById = async (eventId, userId) => {
  const event = await eventRepo.findByIdWithCommittee(eventId);
  if (!event) throw new NotFoundError('Event', eventId);
  if (event.archivedAt) throw new NotFoundError('Event', eventId);

  // Verify org membership
  const isMember = await orgRepo.findById(event.organisation._id, { select: 'members' });
  if (!isMember) throw new AuthorizationError('Not a member of this organisation');

  return event;
};

export const getBySlug = async (orgId, slug, userId) => {
  const event = await eventRepo.findBySlug(orgId, slug);
  if (!event) throw new NotFoundError('Event', slug);

  return event;
};

export const update = async (eventId, data, userId) => {
  const event = await eventRepo.findById(eventId);
  if (!event) throw new NotFoundError('Event', eventId);
  if (event.archivedAt) throw new BusinessRuleError('Cannot update archived event', 'event.archived');

  const org = await orgRepo.findById(event.organisation);
  assertPermission(userId, 'edit', 'event', { org });

  // Prevent updating protected fields
  delete data.committee;
  delete data.createdBy;
  delete data.organisation;
  delete data.totalDonations;
  delete data.totalExpenses;
  delete data.totalCollections;
  delete data.archivedAt;
  delete data.archivedBy;

  const updated = await eventRepo.updateById(eventId, data);

  await emit('event.updated', {
    eventId,
    orgId: event.organisation,
    updatedBy: userId,
    changes: Object.keys(data),
  });

  return updated;
};

export const changeStatus = async (eventId, newStatus, userId) => {
  const event = await eventRepo.findById(eventId);
  if (!event) throw new NotFoundError('Event', eventId);

  validateTransition(event.status, newStatus);

  const org = await orgRepo.findById(event.organisation);
  assertPermission(userId, 'edit', 'event', { org });

  const oldStatus = event.status;
  const updated = await eventRepo.updateById(eventId, { status: newStatus });

  await emit('event.status.changed', {
    eventId,
    orgId: event.organisation,
    from: oldStatus,
    to: newStatus,
    changedBy: userId,
  });

  return updated;
};

export const archive = async (eventId, userId) => {
  const event = await eventRepo.findById(eventId);
  if (!event) throw new NotFoundError('Event', eventId);

  const org = await orgRepo.findById(event.organisation);
  assertPermission(userId, 'delete', 'event', { org });

  const updated = await eventRepo.updateById(eventId, {
    status: 'archived',
    archivedAt: new Date(),
    archivedBy: userId,
  });

  await emit('event.archived', { eventId, orgId: event.organisation, archivedBy: userId });

  return updated;
};

// Committee management

export const addCommitteeMember = async (eventId, targetUserId, role, userId) => {
  const event = await eventRepo.findById(eventId);
  if (!event) throw new NotFoundError('Event', eventId);

  const org = await orgRepo.findById(event.organisation);
  assertPermission(userId, 'edit', 'event', { org });

  // Check if already in committee
  const existing = event.committee.find(m => m.user.toString() === targetUserId && m.isActive);
  if (existing) throw new ConflictError('User is already in the committee');

  const updated = await eventRepo.addCommitteeMember(eventId, targetUserId, role);

  await emit('event.committee.member_added', {
    eventId,
    orgId: event.organisation,
    userId: targetUserId,
    role,
    addedBy: userId,
  });

  return updated;
};

export const removeCommitteeMember = async (eventId, targetUserId, userId) => {
  const event = await eventRepo.findById(eventId);
  if (!event) throw new NotFoundError('Event', eventId);

  const org = await orgRepo.findById(event.organisation);
  assertPermission(userId, 'edit', 'event', { org });

  // Cannot remove the president (event creator)
  const target = event.committee.find(m => m.user.toString() === targetUserId);
  if (target && target.role === 'president' && event.createdBy.toString() === targetUserId) {
    throw new BusinessRuleError('Cannot remove the event creator from committee', 'event.committee.president');
  }

  const updated = await eventRepo.removeCommitteeMember(eventId, targetUserId);

  await emit('event.committee.member_removed', {
    eventId,
    orgId: event.organisation,
    userId: targetUserId,
    removedBy: userId,
  });

  return updated;
};

export const updateCommitteeRole = async (eventId, targetUserId, newRole, userId) => {
  const event = await eventRepo.findById(eventId);
  if (!event) throw new NotFoundError('Event', eventId);

  const org = await orgRepo.findById(event.organisation);
  assertPermission(userId, 'edit', 'event', { org });

  return await eventRepo.updateCommitteeRole(eventId, targetUserId, newRole);
};

// Budget

export const updateBudget = async (eventId, budgetData, userId) => {
  const event = await eventRepo.findById(eventId);
  if (!event) throw new NotFoundError('Event', eventId);

  const org = await orgRepo.findById(event.organisation);
  assertPermission(userId, 'edit', 'event', { org });

  return await eventRepo.updateById(eventId, { budget: budgetData });
};

export const getSummary = async (eventId, userId) => {
  const event = await eventRepo.findByIdWithCommittee(eventId);
  if (!event) throw new NotFoundError('Event', eventId);

  const balance = parseFloat(event.totalDonations?.toString() || '0') -
                  parseFloat(event.totalExpenses?.toString() || '0');

  return {
    event: {
      _id: event._id,
      name: event.name,
      type: event.type,
      status: event.status,
      startDate: event.startDate,
      endDate: event.endDate,
    },
    financial: {
      totalDonations: event.totalDonations,
      totalExpenses: event.totalExpenses,
      totalCollections: event.totalCollections,
      balance,
      budgetAllocated: event.budget?.totalAllocated || 0,
    },
    committee: event.committee?.length || 0,
    campaigns: 0, // Will be populated when Campaigns module is built
  };
};
