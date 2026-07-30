/**
 * Projection Engine
 * 
 * Read models updated from domain events.
 * Projections are the data source for dashboards, analytics, KPIs, and AI.
 * 
 * Architecture:
 *   Domain Event → Projector → Projection (MongoDB collection)
 *   Dashboard → reads Projection (fast, pre-aggregated)
 * 
 * Key properties:
 *   - Projections are eventually consistent (not real-time)
 *   - Projections are rebuildable from source data
 *   - Projections are append-only (updated, not recreated)
 *   - Each projector handles one projection type
 */

import { on } from '../shared/eventBus.js';
import logger from '../../utils/logger.js';

/**
 * Projection metadata schema — embedded in every projection document.
 * Provides health monitoring, versioning, and recovery information.
 */
export const projectionMeta = {
  _projection: {
    version: { type: Number, default: 1 },
    lastProcessedEvent: { type: String },
    lastProcessedAt: { type: Date },
    processedCount: { type: Number, default: 0 },
    errorCount: { type: Number, default: 0 },
    rebuiltAt: { type: Date },
    recordCount: { type: Number, default: 0 },
  },
};

/**
 * Base class for all projectors.
 * Subclasses implement `handle()` and `rebuild()`.
 */
export class Projector {
  constructor(name, version = 1) {
    this.name = name;
    this.version = version;
    this.lastProcessedAt = null;
    this.processedCount = 0;
    this.errorCount = 0;
    this.lastEvent = null;
  }

  /**
   * Subscribe this projector to domain events.
   */
  subscribe() {
    // Override in subclass
  }

  /**
   * Handle a domain event. Update the projection.
   * Override in subclass.
   */
  async handle(event, payload) {
    throw new Error(`${this.name}: handle() not implemented`);
  }

  /**
   * Rebuild the entire projection from source data.
   * Used for recovery or initial population.
   * Override in subclass.
   */
  async rebuild(orgId) {
    throw new Error(`${this.name}: rebuild() not implemented`);
  }

  /**
   * Wrap handle with logging and error tracking.
   */
  createHandler(event) {
    return async (payload) => {
      const startTime = Date.now();
      try {
        await this.handle(event, payload);
        this.processedCount++;
        this.lastProcessedAt = new Date();
        this.lastEvent = event;
        logger.debug({
          projector: this.name,
          event,
          ms: Date.now() - startTime,
        }, 'Projection updated');
      } catch (err) {
        this.errorCount++;
        logger.error({
          err,
          projector: this.name,
          event,
          ms: Date.now() - startTime,
        }, 'Projection update failed');
      }
    };
  }

  /**
   * Get projector health status with detailed metrics.
   */
  getStatus() {
    const errorRate = this.processedCount > 0
      ? Math.round((this.errorCount / this.processedCount) * 100) / 100
      : 0;

    return {
      name: this.name,
      version: this.version,
      lastProcessedAt: this.lastProcessedAt,
      lastEvent: this.lastEvent,
      processedCount: this.processedCount,
      errorCount: this.errorCount,
      errorRate,
      healthy: errorRate < 0.1,
      lag: this.lastProcessedAt ? Date.now() - this.lastProcessedAt.getTime() : null,
    };
  }
}

/**
 * Registry of all projectors.
 * Used to manage lifecycle and provide status.
 */
class ProjectorRegistry {
  constructor() {
    this.projectors = new Map();
  }

  register(projector) {
    this.projectors.set(projector.name, projector);
    projector.subscribe();
    logger.info({ projector: projector.name, version: projector.version }, 'Projector registered');
  }

  getStatus() {
    return Array.from(this.projectors.values()).map(p => p.getStatus());
  }

  getHealth() {
    const statuses = this.getStatus();
    const healthy = statuses.filter(s => s.healthy).length;
    const total = statuses.length;
    return {
      status: healthy === total ? 'healthy' : 'degraded',
      projectors: total,
      healthy,
      unhealthy: total - healthy,
      details: statuses,
    };
  }

  async rebuildAll(orgId) {
    const results = [];
    for (const projector of this.projectors.values()) {
      const start = Date.now();
      try {
        await projector.rebuild(orgId);
        results.push({ name: projector.name, success: true, ms: Date.now() - start });
      } catch (err) {
        results.push({ name: projector.name, success: false, error: err.message, ms: Date.now() - start });
      }
    }
    return results;
  }
}

export const registry = new ProjectorRegistry();
export default registry;
