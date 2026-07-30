import Activity from './model.js';
import logger from '../../utils/logger.js';

/**
 * Record an activity feed entry.
 */
export const logActivity = async ({ userId, groupId, eventId, type, description, entityId, entityType, metadata }) => {
  try {
    await Activity.create({
      userId,
      groupId,
      eventId,
      type,
      description,
      entityId,
      entityType,
      metadata,
    });
  } catch (err) {
    logger.error({ err, type }, 'Failed to write activity');
  }
};

/**
 * Get activity feed for a group.
 */
export const getGroupActivity = async (groupId, { page = 1, limit = 20 } = {}) => {
  const [activities, total] = await Promise.all([
    Activity.find({ groupId, isArchived: false })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'name avatar'),
    Activity.countDocuments({ groupId, isArchived: false }),
  ]);

  return { activities, total, page, limit };
};

/**
 * Get activity feed for an event.
 */
export const getEventActivity = async (eventId, { page = 1, limit = 20 } = {}) => {
  const [activities, total] = await Promise.all([
    Activity.find({ eventId, isArchived: false })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'name avatar'),
    Activity.countDocuments({ eventId, isArchived: false }),
  ]);

  return { activities, total, page, limit };
};

/**
 * Get recent activity across all groups/events for a user.
 */
export const getUserActivity = async (userId, { page = 1, limit = 20 } = {}) => {
  const [activities, total] = await Promise.all([
    Activity.find({ userId, isArchived: false })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Activity.countDocuments({ userId, isArchived: false }),
  ]);

  return { activities, total, page, limit };
};
