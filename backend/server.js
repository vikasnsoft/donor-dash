import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import * as Sentry from '@sentry/node';

import config from './src/config/index.js';
import connectDB from './src/config/db.js';
import logger from './src/utils/logger.js';
import { notFound, errorHandler } from './src/middleware/error.js';
import { auditMiddleware } from './src/middleware/audit.js';
import { requestContext } from './src/middleware/context.js';
import authRoutes from './src/modules/auth/routes.js';
import userRoutes from './src/modules/users/routes.js';
import organisationRoutes from './src/modules/organisations/routes.js';
import eventRoutes, { orgEventRouter } from './src/modules/events/routes.js';
import campaignRoutes, { eventCampaignRouter } from './src/modules/campaigns/routes.js';
import donorRoutes, { orgDonorRouter } from './src/modules/donors/routes.js';
import donationRoutes, { eventDonationRouter, donorDonationRouter } from './src/modules/donations/routes.js';
import ledgerRoutes, { orgLedgerRouter, eventLedgerRouter } from './src/modules/ledger/routes.js';
import groupRoutes from './src/modules/groups/routes.js';
import expenseRoutes from './src/modules/expenses/routes.js';
import settlementRoutes from './src/modules/settlements/routes.js';
import reportRoutes, { orgReportRouter, eventReportRouter } from './src/modules/reports/routes.js';
import notificationRoutes from './src/modules/notifications/routes.js';
import { orgImportExportRouter } from './src/modules/import-export/routes.js';
import { registerNotificationHandlers } from './src/modules/notifications/service.js';
import { registerProjectors } from './src/modules/projections/projectors.js';
import projectionRoutes, { eventProjectionRouter, orgProjectionRouter } from './src/modules/projections/routes.js';
import searchRoutes from './src/modules/search/routes.js';
import registerWorkers from './src/modules/shared/jobs/workers.js';
import { getQueueHealth } from './src/modules/shared/jobs/index.js';
import setupSwagger from './src/docs/swagger/swagger.js';

// Connect to database
connectDB();

const app = express();

// Sentry
if (config.sentry.enabled) {
  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.env,
    tracesSampleRate: 1.0,
  });
  app.use(Sentry.requestHandler());
  app.use(Sentry.tracingHandler());
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// CORS
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range', 'X-Request-Id'],
}));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      ms: Date.now() - start,
      requestId: req.context?.requestId,
    });
  });
  next();
});

// Static folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Swagger documentation
setupSwagger(app);

// Health checks (no auth required)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/health/queues', async (req, res) => {
  if (!config.redis.enabled) {
    return res.json({ status: 'disabled', message: 'Redis not configured' });
  }
  const health = await getQueueHealth();
  res.json({ status: 'ok', queues: health });
});

app.get('/ready', async (req, res) => {
  try {
    const mongoose = await import('mongoose');
    const isDbConnected = mongoose.default.connection.readyState === 1;
    if (!isDbConnected) throw new Error('Database not connected');
    res.json({ status: 'ready', database: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'not ready', error: err.message });
  }
});

app.get('/live', (req, res) => {
  res.json({ status: 'alive', uptime: process.uptime() });
});

// API v1 routes
const v1Router = express.Router();

// Request context (must be before auth so even unauthenticated requests get context)
v1Router.use(requestContext);

// Audit middleware
v1Router.use(auditMiddleware);

// Mount module routes
v1Router.use('/auth', authRoutes);
v1Router.use('/users', userRoutes);
v1Router.use('/organisations', organisationRoutes);
v1Router.use('/organisations/:orgId/events', orgEventRouter);
v1Router.use('/organisations/:orgId/donors', orgDonorRouter);
v1Router.use('/events', eventRoutes);
v1Router.use('/events/:eventId/campaigns', eventCampaignRouter);
v1Router.use('/events/:eventId/donations', eventDonationRouter);
v1Router.use('/campaigns', campaignRoutes);
v1Router.use('/donors', donorRoutes);
v1Router.use('/donors/:donorId/donations', donorDonationRouter);
v1Router.use('/donations', donationRoutes);
v1Router.use('/organisations/:orgId/ledger', orgLedgerRouter);
v1Router.use('/events/:eventId/ledger', eventLedgerRouter);
v1Router.use('/ledger', ledgerRoutes);
v1Router.use('/groups', groupRoutes);
v1Router.use('/expenses', expenseRoutes);
v1Router.use('/settlements', settlementRoutes);
v1Router.use('/organisations/:orgId/reports', orgReportRouter);
v1Router.use('/events/:eventId/reports', eventReportRouter);
v1Router.use('/notifications', notificationRoutes);
v1Router.use('/organisations/:orgId/data', orgImportExportRouter);
v1Router.use('/events/:eventId/projections', eventProjectionRouter);
v1Router.use('/organisations/:orgId/projections', orgProjectionRouter);
v1Router.use('/projections', projectionRoutes);
v1Router.use('/search', searchRoutes);

// Mount v1 router
app.use('/api/v1', v1Router);

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'Donor Dash API',
    version: '2.0.0',
    docs: '/api-docs',
    health: '/health',
  });
});

// Sentry error handler
if (config.sentry.enabled) {
  app.use(Sentry.errorHandler());
}

// Error handling
app.use(notFound);
app.use(errorHandler);

// Register domain event handlers
registerNotificationHandlers();
registerProjectors();

// Register background job workers
if (config.redis.enabled) {
  registerWorkers();
  logger.info('Background job workers registered');
} else {
  logger.info('Redis not configured — background jobs disabled');
}

const port = config.server.port;

const server = app.listen(port, () => {
  logger.info(`Server running in ${config.env} mode on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  logger.fatal({ err }, 'Unhandled promise rejection');
});
