import { Router } from 'express';
import * as controller from './controller.js';
import { protect } from '../../middleware/auth.js';

const router = Router();
router.use(protect);

// Event-scoped projections (mounted at /events/:eventId/projections)
const eventProjectionRouter = Router({ mergeParams: true });
eventProjectionRouter.use(protect);

eventProjectionRouter.get('/daily-donations', controller.getDailyDonations);
eventProjectionRouter.get('/campaigns', controller.getCampaignSummaries);
eventProjectionRouter.get('/volunteers', controller.getVolunteerPerformance);

// Organisation-scoped projections (mounted at /organisations/:orgId/projections)
const orgProjectionRouter = Router({ mergeParams: true });
orgProjectionRouter.use(protect);

orgProjectionRouter.get('/dashboard', controller.getOrganisationDashboard);
orgProjectionRouter.get('/donor-retention', controller.getDonorRetention);
orgProjectionRouter.get('/financial', controller.getFinancialSummary);
orgProjectionRouter.get('/events', controller.getEventOverviews);
orgProjectionRouter.get('/events/:eventId', controller.getEventOverview);

// Admin routes
router.get('/status', controller.getProjectionStatus);

export { eventProjectionRouter, orgProjectionRouter };
export default router;
