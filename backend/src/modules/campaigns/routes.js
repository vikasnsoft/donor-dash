import { Router } from 'express';
import * as controller from './controller.js';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
  createCampaignSchema,
  updateCampaignSchema,
  changeStatusSchema,
  addRouteSchema,
  assignVolunteerSchema,
} from './validator.js';

const router = Router();
router.use(protect);

// Event-scoped routes (mounted at /events/:eventId/campaigns)
const eventCampaignRouter = Router({ mergeParams: true });
eventCampaignRouter.use(protect);

eventCampaignRouter.route('/')
  .post(validate(createCampaignSchema), controller.create)
  .get(controller.getAll);

// Standalone routes (mounted at /campaigns)
router.route('/:id')
  .get(controller.getById)
  .put(validate(updateCampaignSchema), controller.update);

router.post('/:id/status', validate(changeStatusSchema), controller.changeStatus);
router.post('/:id/archive', controller.archive);
router.post('/:id/routes', validate(addRouteSchema), controller.addRoute);
router.put('/:id/routes/:routeId/volunteer', validate(assignVolunteerSchema), controller.assignVolunteer);

export { eventCampaignRouter };
export default router;
