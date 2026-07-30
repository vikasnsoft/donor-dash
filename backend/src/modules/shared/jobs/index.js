/**
 * Background Job Infrastructure
 * 
 * Uses BullMQ with Redis for reliable job processing.
 * 
 * Queue definitions:
 *   - projections: projection rebuilds and updates
 *   - notifications: email delivery, push notifications
 *   - reports: report generation, PDF creation
 *   - imports: CSV import processing
 *   - cleanup: data retention, archive operations
 * 
 * Usage:
 *   import { queues, addJob } from './jobs/index.js';
 *   await addJob('projections', 'rebuild', { orgId });
 */

import { Queue, Worker } from 'bullmq';
import config from '../../config/index.js';
import logger from '../../utils/logger.js';

// Redis connection
const connection = config.redis.enabled
  ? { url: config.redis.url }
  : { host: 'localhost', port: 6379 };

/**
 * Queue definitions
 */
const queueDefinitions = [
  { name: 'projections', description: 'Projection rebuilds and updates' },
  { name: 'notifications', description: 'Email, push, and in-app notifications' },
  { name: 'reports', description: 'Report generation and PDF creation' },
  { name: 'imports', description: 'CSV import processing' },
  { name: 'cleanup', description: 'Data retention and archive operations' },
  { name: 'ocr', description: 'OCR processing for receipts' },
];

// Create queues
const queues = {};
const workers = {};

for (const def of queueDefinitions) {
  queues[def.name] = new Queue(def.name, {
    connection,
    defaultJobOptions: {
      removeOnComplete: { count: 1000 }, // Keep last 1000 completed
      removeOnFail: { count: 5000 },      // Keep last 5000 failed
      attempts: 3,                         // Retry 3 times
      backoff: { type: 'exponential', delay: 1000 }, // Exponential backoff
    },
  });
}

/**
 * Add a job to a queue.
 */
export const addJob = async (queueName, jobType, data, options = {}) => {
  const queue = queues[queueName];
  if (!queue) {
    logger.error({ queueName }, 'Unknown queue');
    return null;
  }

  try {
    const job = await queue.add(jobType, data, {
      priority: options.priority,
      delay: options.delay,
      ...options,
    });

    logger.debug({ queueName, jobType, jobId: job.id }, 'Job added');
    return job;
  } catch (err) {
    logger.error({ err, queueName, jobType }, 'Failed to add job');
    return null;
  }
};

/**
 * Create a worker for a queue.
 */
export const createWorker = (queueName, handler) => {
  const worker = new Worker(queueName, handler, {
    connection,
    concurrency: 5, // Process 5 jobs concurrently
    limiter: {
      max: 100,      // Max 100 jobs per minute
      duration: 60000,
    },
  });

  worker.on('completed', (job) => {
    logger.debug({ queueName, jobId: job.id, jobType: job.name }, 'Job completed');
  });

  worker.on('failed', (job, err) => {
    logger.error({ queueName, jobId: job?.id, jobType: job?.name, err }, 'Job failed');
  });

  worker.on('error', (err) => {
    logger.error({ queueName, err }, 'Worker error');
  });

  workers[queueName] = worker;
  return worker;
};

/**
 * Get health status of all queues.
 */
export const getQueueHealth = async () => {
  const health = [];

  for (const [name, queue] of Object.entries(queues)) {
    try {
      const [waiting, active, completed, failed] = await Promise.all([
        queue.getWaitingCount(),
        queue.getActiveCount(),
        queue.getCompletedCount(),
        queue.getFailedCount(),
      ]);

      health.push({
        name,
        waiting,
        active,
        completed,
        failed,
        status: failed > 100 ? 'degraded' : 'healthy',
      });
    } catch (err) {
      health.push({ name, status: 'error', error: err.message });
    }
  }

  return health;
};

/**
 * Graceful shutdown.
 */
export const shutdown = async () => {
  logger.info('Shutting down job queues...');

  for (const [name, worker] of Object.entries(workers)) {
    await worker.close();
    logger.info({ queue: name }, 'Worker closed');
  }

  for (const [name, queue] of Object.entries(queues)) {
    await queue.close();
    logger.info({ queue: name }, 'Queue closed');
  }
};

export { queues, workers };
export default { addJob, createWorker, getQueueHealth, shutdown, queues };
