import mongoose from 'mongoose';
import donationRepo from './repository.js';
import donorRepo from '../donors/repository.js';
import eventRepo from '../events/repository.js';
import campaignRepo from '../campaigns/repository.js';
import orgRepo from '../organisations/repository.js';
import { ledgerRepo } from '../ledger/repository.js';
import { postEntry } from '../ledger/service.js';
import { emit } from '../shared/eventBus.js';
import { assertPermission } from '../shared/permissions.js';
import { NotFoundError, BusinessRuleError, ConflictError } from '../../utils/errors.js';
import { STATUS_TRANSITIONS } from './model.js';

/**
 * Donation Orchestration Service
 * 
 * Every donation goes through this pipeline:
 * 1. Validation (donor exists, event exists, permissions)
 * 2. Receipt number generation
 * 3. Donation record creation (in transaction)
 * 4. Donor stats update (in transaction)
 * 5. Campaign totals update (in transaction)
 * 6. Event totals update (in transaction)
 * 7. Domain event emission
 * 8. Activity logging
 * 9. Audit logging
 */

function validateStatusTransition(current, next) {
  const allowed = STATUS_TRANSITIONS[current];
  if (!allowed || !allowed.includes(next)) {
    throw new BusinessRuleError(
      `Cannot transition donation from '${current}' to '${next}'`,
      'donation.status_transition'
    );
  }
}

/**
 * Record a new donation.
 * This is the main orchestration method — all steps happen in a single transaction.
 */
export const record = async (data, userId) => {
  const { donorId, eventId, campaignId, amount, method, reference, notes, collectedBy, date } = data;

  // 1. Validation
  const [donor, event] = await Promise.all([
    donorRepo.findById(donorId),
    eventRepo.findById(eventId),
  ]);

  if (!donor) throw new NotFoundError('Donor', donorId);
  if (!event) throw new NotFoundError('Event', eventId);
  if (event.archivedAt) throw new BusinessRuleError('Cannot add donations to archived event', 'event.archived');

  // Verify org membership
  const org = await orgRepo.findById(event.organisation);
  if (!org) throw new NotFoundError('Organisation');
  assertPermission(userId, 'create', 'donation', { org });

  // Campaign validation (optional)
  let campaign = null;
  if (campaignId) {
    campaign = await campaignRepo.findById(campaignId);
    if (!campaign) throw new NotFoundError('Campaign', campaignId);
    if (campaign.event.toString() !== eventId) {
      throw new BusinessRuleError('Campaign does not belong to this event', 'campaign.event_mismatch');
    }
  }

  // 2. Generate receipt number
  const receiptNumber = await donationRepo.getNextReceiptNumber(event.organisation);

  // 3-6. Transaction: create donation + update donor + update campaign + update event
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create donation
    const [donation] = await donationRepo.create({
      donor: donorId,
      event: eventId,
      campaign: campaignId || null,
      organisation: event.organisation,
      amount: mongoose.Types.Decimal128.fromString(String(amount)),
      method,
      reference: reference || '',
      status: 'received',
      receiptNumber,
      collection: data.collectionId || null,
      collectedBy: collectedBy || userId,
      notes: notes || '',
      date: date ? new Date(date) : new Date(),
      createdBy: userId,
    }, { session });

    // 4. Update donor stats
    await donorRepo.updateStats(donorId, amount, session);

    // 5. Update campaign totals
    if (campaignId) {
      await campaignRepo.updateCollected(campaignId, amount, session);
    }

    // 6. Update event totals
    await eventRepo.updateById(eventId, {
      $inc: { totalDonations: mongoose.Types.Decimal128.fromString(String(amount)) },
    }, { session });

    // 7. Post ledger journal entry (within same transaction)
    const ledgerEntry = await postEntry('donation', {
      amount,
      method,
      donorName: donor.name,
      eventName: event.name,
      receiptNumber,
      sourceId: donation._id,
    }, {
      session,
      userId,
      orgId: event.organisation,
      eventId,
    });

    // Link ledger entry to donation
    await donationRepo.updateById(donation._id, {
      ledgerEntry: ledgerEntry._id,
    }, { session });

    await session.commitTransaction();

    // 7. Emit domain events (after commit)
    await emit('donation.recorded', {
      donationId: donation._id,
      donorId,
      eventId,
      campaignId,
      orgId: event.organisation,
      amount,
      method,
      receiptNumber,
      collectedBy: collectedBy || userId,
      recordedBy: userId,
    });

    return donation;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

/**
 * Get all donations for an event.
 */
export const getByEvent = async (eventId, userId, query) => {
  const event = await eventRepo.findById(eventId);
  if (!event) throw new NotFoundError('Event', eventId);

  const filters = {};
  if (query.status) filters.status = query.status;
  if (query.method) filters.method = query.method;
  if (query.from || query.to) {
    filters.date = {};
    if (query.from) filters.date.$gte = new Date(query.from);
    if (query.to) filters.date.$lte = new Date(query.to + 'T23:59:59.999Z');
  }

  return await donationRepo.findByEvent(eventId, filters, {
    page: query.page,
    limit: query.limit,
  });
};

/**
 * Get donation by ID.
 */
export const getById = async (donationId, userId) => {
  const donation = await donationRepo.findById(donationId, {
    populate: [
      { path: 'donor', select: 'name phone email type address' },
      { path: 'event', select: 'name slug' },
      { path: 'campaign', select: 'name' },
      { path: 'collectedBy', select: 'name' },
      { path: 'createdBy', select: 'name' },
    ],
  });
  if (!donation) throw new NotFoundError('Donation', donationId);
  return donation;
};

/**
 * Get donations for a donor.
 */
export const getByDonor = async (donorId, userId, query) => {
  return await donationRepo.findByDonor(donorId, {
    page: query.page,
    limit: query.limit,
  });
};

/**
 * Cancel a donation.
 */
export const cancel = async (donationId, reason, userId) => {
  const donation = await donationRepo.findById(donationId);
  if (!donation) throw new NotFoundError('Donation', donationId);

  validateStatusTransition(donation.status, 'cancelled');

  const org = await orgRepo.findById(donation.organisation);
  assertPermission(userId, 'cancel', 'donation', { org });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update donation status
    const updated = await donationRepo.updateById(donationId, {
      status: 'cancelled',
      notes: `${donation.notes}\nCancelled: ${reason || 'No reason provided'}`,
    }, { session });

    // Reverse donor stats
    const amount = parseFloat(donation.amount.toString());
    await donorRepo.updateStats(donation.donor, -amount, session);

    // Reverse campaign totals
    if (donation.campaign) {
      await campaignRepo.updateCollected(donation.campaign, -amount, session);
    }

    // Reverse event totals
    await eventRepo.updateById(donation.event, {
      $inc: { totalDonations: mongoose.Types.Decimal128.fromString(String(-amount)) },
    }, { session });

    await session.commitTransaction();

    await emit('donation.cancelled', {
      donationId,
      eventId: donation.event,
      orgId: donation.organisation,
      amount,
      reason,
      cancelledBy: userId,
    });

    return updated;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

/**
 * Get donation statistics for an event.
 */
export const getEventStats = async (eventId, userId) => {
  const event = await eventRepo.findById(eventId);
  if (!event) throw new NotFoundError('Event', eventId);

  const [statusStats, methodBreakdown, dailyDonations] = await Promise.all([
    donationRepo.getDonationStats(event.organisation, eventId),
    donationRepo.getMethodBreakdown(eventId),
    donationRepo.getDailyDonations(eventId, event.startDate, event.endDate || new Date()),
  ]);

  return {
    event: { _id: event._id, name: event.name },
    byStatus: statusStats,
    byMethod: methodBreakdown,
    daily: dailyDonations,
  };
};
