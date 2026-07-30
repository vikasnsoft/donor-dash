import { Router } from 'express';
import * as controller from './controller.js';
import { protect } from '../../middleware/auth.js';

const router = Router();
router.use(protect);

// Organisation-scoped (mounted at /organisations/:orgId/reports)
const orgReportRouter = Router({ mergeParams: true });
orgReportRouter.use(protect);

orgReportRouter.get('/income-statement', controller.getIncomeStatement);
orgReportRouter.get('/donations', controller.getDonationReport);

// Event-scoped (mounted at /events/:eventId/reports)
const eventReportRouter = Router({ mergeParams: true });
eventReportRouter.use(protect);

eventReportRouter.get('/summary', controller.getEventReport);
eventReportRouter.get('/volunteers', controller.getVolunteerReport);

export { orgReportRouter, eventReportRouter };
export default router;
