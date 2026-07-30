import { Router } from 'express';
import * as controller from './controller.js';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { recordDonationSchema, cancelDonationSchema } from './validator.js';

const router = Router();
router.use(protect);

// Event-scoped routes (mounted at /events/:eventId/donations)
const eventDonationRouter = Router({ mergeParams: true });
eventDonationRouter.use(protect);

eventDonationRouter.route('/')
  .post(validate(recordDonationSchema), controller.record)
  .get(controller.getByEvent);

eventDonationRouter.get('/stats', controller.getEventStats);

// Standalone routes (mounted at /donations)
router.route('/:id')
  .get(controller.getById);

router.post('/:id/cancel', validate(cancelDonationSchema), controller.cancel);

// Donor-scoped (mounted at /donors/:donorId/donations)
const donorDonationRouter = Router({ mergeParams: true });
donorDonationRouter.use(protect);
donorDonationRouter.get('/', controller.getByDonor);

export { eventDonationRouter, donorDonationRouter };
export default router;
