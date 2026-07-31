/**
 * Background Job Handlers
 * 
 * Registers workers for all job queues.
 * Each worker processes jobs of its queue type.
 */

import { createWorker } from './index.js';
import { registry } from '../../projections/engine.js';
import logger from '../../../utils/logger.js';

/**
 * Register all job workers.
 * Call this once at server startup.
 */
export const registerWorkers = () => {
  // Projection jobs
  createWorker('projections', async (job) => {
    const { type, orgId } = job.data;

    switch (type) {
      case 'rebuild-all':
        logger.info({ orgId }, 'Rebuilding all projections');
        return await registry.rebuildAll(orgId);

      case 'rebuild':
        const projector = registry.projectors.get(job.data.projector);
        if (projector) {
          return await projector.rebuild(orgId);
        }
        break;

      default:
        logger.warn({ type }, 'Unknown projection job type');
    }
  });

  // Notification jobs
  createWorker('notifications', async (job) => {
    const { type, recipientId, title, message, channel } = job.data;

    switch (type) {
      case 'email':
        // Email delivery (future: integrate with SendGrid/Nodemailer)
        logger.info({ recipientId, title }, 'Email notification (delivery pending)');
        return { status: 'pending_email_integration' };

      case 'push':
        // Push notification (future: Web Push API)
        logger.info({ recipientId, title }, 'Push notification (delivery pending)');
        return { status: 'pending_push_integration' };

      case 'sms':
        // SMS (future: Twilio)
        logger.info({ recipientId, title }, 'SMS notification (delivery pending)');
        return { status: 'pending_sms_integration' };

      default:
        logger.warn({ type }, 'Unknown notification job type');
    }
  });

  // Report generation jobs
  createWorker('reports', async (job) => {
    const { type, orgId, eventId, reportType } = job.data;

    logger.info({ type, orgId, eventId, reportType }, 'Report generation (implementation pending)');

    return { status: 'pending_report_generation' };
  });

  // Import processing jobs
  createWorker('imports', async (job) => {
    const { type, orgId, filePath } = job.data;

    logger.info({ type, orgId, filePath }, 'Import processing (implementation pending)');

    return { status: 'pending_import_processing' };
  });

  // Cleanup jobs
  createWorker('cleanup', async (job) => {
    const { type, orgId } = job.data;

    switch (type) {
      case 'expired-invites':
        logger.info({ orgId }, 'Cleaning expired invites');
        // Implementation: delete invites past expiresAt
        return { status: 'done' };

      case 'old-notifications':
        logger.info({ orgId }, 'Cleaning old notifications');
        // TTL index handles this, but explicit cleanup for bulk
        return { status: 'done' };

      default:
        logger.warn({ type }, 'Unknown cleanup job type');
    }
  });

  // OCR jobs
  createWorker('ocr', async (job) => {
    const { type, imageUrl, expenseId } = job.data;

    logger.info({ type, imageUrl, expenseId }, 'OCR processing (implementation pending)');

    return { status: 'pending_ocr_integration' };
  });

  logger.info('All job workers registered');
};

export default registerWorkers;
