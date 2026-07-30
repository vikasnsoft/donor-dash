import { Router } from 'express';
import * as controller from './controller.js';
import { protect } from '../../middleware/auth.js';

const router = Router();
router.use(protect);

// Organisation-scoped (mounted at /organisations/:orgId/ledger)
const orgLedgerRouter = Router({ mergeParams: true });
orgLedgerRouter.use(protect);

orgLedgerRouter.get('/entries', controller.getEntries);
orgLedgerRouter.get('/trial-balance', controller.getTrialBalance);
orgLedgerRouter.get('/cash-book', controller.getCashBook);

// Standalone (mounted at /ledger)
router.get('/entries/:id', controller.getEntryById);
router.post('/entries/:id/void', controller.voidEntry);

// Event-scoped (mounted at /events/:eventId/ledger)
const eventLedgerRouter = Router({ mergeParams: true });
eventLedgerRouter.use(protect);
eventLedgerRouter.get('/summary', controller.getEventSummary);

export { orgLedgerRouter, eventLedgerRouter };
export default router;
