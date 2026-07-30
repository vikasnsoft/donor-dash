import AuditLog from './model.js';
import logger from '../../utils/logger.js';

/**
 * Record an audit log entry.
 * This is an append-only operation — audit logs are never modified.
 */
export const logAudit = async ({ userId, action, resourceType, resourceId, changes, metadata }) => {
  try {
    await AuditLog.create({
      userId,
      action,
      resourceType,
      resourceId,
      changes,
      metadata,
    });
  } catch (err) {
    // Audit logging should never break the main operation
    logger.error({ err, action, resourceType }, 'Failed to write audit log');
  }
};

/**
 * Query audit logs with pagination and filters.
 */
export const queryAuditLogs = async ({ userId, action, resourceType, resourceId, page = 1, limit = 50 }) => {
  const filter = {};
  if (userId) filter.userId = userId;
  if (action) filter.action = action;
  if (resourceType) filter.resourceType = resourceType;
  if (resourceId) filter.resourceId = resourceId;

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'name email'),
    AuditLog.countDocuments(filter),
  ]);

  return { logs, total, page, limit };
};
