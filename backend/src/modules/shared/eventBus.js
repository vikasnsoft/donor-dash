import logger from '../../utils/logger.js';

/**
 * Simple in-process domain event bus.
 * Modules publish events; other modules subscribe to handle them.
 * 
 * This is synchronous within the same process.
 * For async/distributed processing, replace with BullMQ later.
 */

const listeners = new Map();

/**
 * Subscribe to a domain event.
 * @param {string} event - Event name (e.g., 'organisation.created')
 * @param {Function} handler - Async handler function
 */
export const on = (event, handler) => {
  if (!listeners.has(event)) {
    listeners.set(event, []);
  }
  listeners.get(event).push(handler);
};

/**
 * Publish a domain event.
 * All handlers run in parallel. Errors are logged but don't stop other handlers.
 * @param {string} event - Event name
 * @param {object} payload - Event data
 */
export const emit = async (event, payload) => {
  const handlers = listeners.get(event) || [];
  if (handlers.length === 0) return;

  logger.debug({ event, payload }, 'Domain event emitted');

  await Promise.allSettled(
    handlers.map(async (handler) => {
      try {
        await handler(payload);
      } catch (err) {
        logger.error({ err, event }, 'Domain event handler failed');
      }
    })
  );
};

/**
 * Get all registered events (for debugging).
 */
export const getRegisteredEvents = () => {
  return Array.from(listeners.keys());
};

export default { on, emit, getRegisteredEvents };
