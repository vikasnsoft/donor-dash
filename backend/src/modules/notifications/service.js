import Notification from './model.js';
import { BaseRepository } from '../shared/repository.js';
import { on } from '../shared/eventBus.js';
import logger from '../../utils/logger.js';

class NotificationRepository extends BaseRepository {
  constructor() { super(Notification); }

  async findByUser(userId, filters = {}, options = {}) {
    const filter = { recipient: userId, ...filters };
    return await this.paginate(filter, {
      sort: '-createdAt',
      ...options,
    });
  }

  async getUnreadCount(userId) {
    return await this.count({ recipient: userId, readAt: null });
  }

  async markRead(notificationId, userId) {
    return await this.model.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { readAt: new Date(), status: 'read' },
      { new: true }
    );
  }

  async markAllRead(userId) {
    return await this.model.updateMany(
      { recipient: userId, readAt: null },
      { readAt: new Date(), status: 'read' }
    );
  }
}

const notifRepo = new NotificationRepository();

/**
 * Create and deliver a notification.
 */
export const notify = async ({ recipient, type, title, message, link, organisation, event, metadata, sender }) => {
  try {
    const notification = await notifRepo.create({
      recipient,
      type,
      channel: 'in_app',
      status: 'sent',
      title,
      message,
      link: link || null,
      organisation: organisation || null,
      event: event || null,
      metadata: metadata || {},
      sender: sender || null,
    });

    logger.debug({ notificationId: notification._id, recipient, type }, 'Notification created');

    return notification;
  } catch (err) {
    logger.error({ err, recipient, type }, 'Failed to create notification');
    return null;
  }
};

/**
 * Bulk notify multiple recipients.
 */
export const notifyMany = async (recipients, data) => {
  const results = await Promise.allSettled(
    recipients.map(recipient => notify({ ...data, recipient }))
  );

  const succeeded = results.filter(r => r.status === 'fulfilled' && r.value).length;
  logger.info({ type: data.type, total: recipients.length, succeeded }, 'Bulk notification sent');

  return { total: recipients.length, succeeded };
};

// Query functions
export const getByUser = async (userId, query) => {
  const filters = {};
  if (query.status) filters.status = query.status;
  if (query.type) filters.type = query.type;
  if (query.unread === 'true') filters.readAt = null;

  return await notifRepo.findByUser(userId, filters, {
    page: query.page,
    limit: query.limit,
  });
};

export const getUnreadCount = async (userId) => {
  return await notifRepo.getUnreadCount(userId);
};

export const markRead = async (notificationId, userId) => {
  return await notifRepo.markRead(notificationId, userId);
};

export const markAllRead = async (userId) => {
  return await notifRepo.markAllRead(userId);
};

// === Domain Event Handlers ===
// These are registered once and fire automatically when events are emitted.

export const registerNotificationHandlers = () => {
  // Donation received → notify event committee
  on('donation.recorded', async ({ donorId, eventId, orgId, amount, receiptNumber, collectedBy }) => {
    // For now, create a simple in-app notification for the collector
    if (collectedBy) {
      await notify({
        recipient: collectedBy,
        type: 'donation.received',
        title: 'Donation Recorded',
        message: `₹${amount} donation recorded (Receipt: ${receiptNumber})`,
        link: `/events/${eventId}`,
        organisation: orgId,
        event: eventId,
      });
    }
  });

  // Settlement confirmed → notify both parties
  on('settlement.confirmed', async ({ groupId, paidBy, paidTo, amount }) => {
    await notify({
      recipient: paidTo,
      type: 'settlement.confirmed',
      title: 'Settlement Received',
      message: `₹${amount} settlement confirmed`,
      link: `/groups/${groupId}`,
      metadata: { groupId, amount },
    });
  });

  // Organisation invite
  on('organisation.invite.sent', async ({ orgId, email, role, invitedBy, token }) => {
    // In production: send email invite
    logger.info({ orgId, email, role }, 'Organisation invite sent (email integration pending)');
  });

  // Group member added
  on('group.member.added', async ({ groupId, userId, addedBy }) => {
    await notify({
      recipient: userId,
      type: 'group.member.added',
      title: 'Added to Group',
      message: 'You have been added to an expense group',
      link: `/groups/${groupId}`,
      metadata: { groupId },
    });
  });
};

export { notifRepo };
