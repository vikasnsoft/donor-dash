import campaignRepo from './repository.js';
import eventRepo from '../events/repository.js';
import orgRepo from '../organisations/repository.js';
import { emit } from '../shared/eventBus.js';
import { assertPermission } from '../shared/permissions.js';
import { NotFoundError, BusinessRuleError, AuthorizationError } from '../../utils/errors.js';
import { STATUS_TRANSITIONS } from './model.js';

function validateTransition(current, next) {
  const allowed = STATUS_TRANSITIONS[current];
  if (!allowed || !allowed.includes(next)) {
    throw new BusinessRuleError(
      `Cannot transition campaign from '${current}' to '${next}'`,
      'campaign.status_transition'
    );
  }
}

export const create = async (data, eventId, userId) => {
  const event = await eventRepo.findById(eventId);
  if (!event) throw new NotFoundError('Event', eventId);
  if (event.archivedAt) throw new BusinessRuleError('Cannot create campaigns in archived event', 'event.archived');

  const org = await orgRepo.findById(event.organisation);
  assertPermission(userId, 'create', 'campaign', { org });

  const campaign = await campaignRepo.create({
    ...data,
    event: eventId,
    organisation: event.organisation,
    createdBy: userId,
  });

  await emit('campaign.created', {
    campaignId: campaign._id,
    eventId,
    orgId: event.organisation,
    name: campaign.name,
    type: campaign.type,
    createdBy: userId,
  });

  return campaign;
};

export const getAll = async (eventId, userId, query) => {
  const event = await eventRepo.findById(eventId);
  if (!event) throw new NotFoundError('Event', eventId);

  const filters = {};
  if (query.status) filters.status = query.status;
  if (query.type) filters.type = query.type;

  return await campaignRepo.findByEvent(eventId, filters, {
    page: query.page,
    limit: query.limit,
  });
};

export const getById = async (campaignId, userId) => {
  const campaign = await campaignRepo.findByIdWithRoutes(campaignId);
  if (!campaign) throw new NotFoundError('Campaign', campaignId);
  if (campaign.archivedAt) throw new NotFoundError('Campaign', campaignId);
  return campaign;
};

export const update = async (campaignId, data, userId) => {
  const campaign = await campaignRepo.findById(campaignId);
  if (!campaign) throw new NotFoundError('Campaign', campaignId);

  const org = await orgRepo.findById(campaign.organisation);
  assertPermission(userId, 'edit', 'campaign', { org });

  delete data.collected;
  delete data.donationCount;
  delete data.createdBy;
  delete data.event;
  delete data.organisation;

  return await campaignRepo.updateById(campaignId, data);
};

export const changeStatus = async (campaignId, newStatus, userId) => {
  const campaign = await campaignRepo.findById(campaignId);
  if (!campaign) throw new NotFoundError('Campaign', campaignId);

  validateTransition(campaign.status, newStatus);

  const org = await orgRepo.findById(campaign.organisation);
  assertPermission(userId, 'edit', 'campaign', { org });

  const oldStatus = campaign.status;
  const updated = await campaignRepo.updateById(campaignId, { status: newStatus });

  await emit('campaign.status.changed', {
    campaignId,
    eventId: campaign.event,
    from: oldStatus,
    to: newStatus,
    changedBy: userId,
  });

  if (newStatus === 'completed') {
    await emit('campaign.completed', {
      campaignId,
      eventId: campaign.event,
      totalCollected: campaign.collected,
    });
  }

  return updated;
};

export const addRoute = async (campaignId, routeData, userId) => {
  const campaign = await campaignRepo.findById(campaignId);
  if (!campaign) throw new NotFoundError('Campaign', campaignId);

  return await campaignRepo.addRoute(campaignId, routeData);
};

export const assignVolunteer = async (campaignId, routeId, volunteerId, userId) => {
  const campaign = await campaignRepo.findById(campaignId);
  if (!campaign) throw new NotFoundError('Campaign', campaignId);

  const updated = await campaignRepo.assignVolunteer(campaignId, routeId, volunteerId);

  await emit('campaign.volunteer.assigned', {
    campaignId,
    routeId,
    volunteerId,
    assignedBy: userId,
  });

  return updated;
};

export const archive = async (campaignId, userId) => {
  const campaign = await campaignRepo.findById(campaignId);
  if (!campaign) throw new NotFoundError('Campaign', campaignId);

  return await campaignRepo.updateById(campaignId, {
    archivedAt: new Date(),
    archivedBy: userId,
    status: campaign.status === 'active' ? 'completed' : campaign.status,
  });
};
