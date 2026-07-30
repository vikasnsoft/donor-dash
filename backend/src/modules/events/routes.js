import { Router } from 'express';
import * as controller from './controller.js';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
  createEventSchema,
  updateEventSchema,
  changeStatusSchema,
  committeeMemberSchema,
  updateCommitteeRoleSchema,
  updateBudgetSchema,
} from './validator.js';

const router = Router();
router.use(protect);

// Organisation-scoped event routes
// These will be mounted at /organisations/:orgId/events
const orgEventRouter = Router({ mergeParams: true });
orgEventRouter.use(protect);

orgEventRouter.route('/')
  .post(validate(createEventSchema), controller.create)
  .get(controller.getAll);

orgEventRouter.get('/slug/:slug', controller.getBySlug);

// Standalone event routes (mounted at /events)
router.route('/:id')
  .get(controller.getById)
  .put(validate(updateEventSchema), controller.update);

router.post('/:id/status', validate(changeStatusSchema), controller.changeStatus);
router.post('/:id/archive', controller.archive);
router.get('/:id/summary', controller.getSummary);

// Committee
router.route('/:id/committee')
  .post(validate(committeeMemberSchema), controller.addCommitteeMember);

router.route('/:id/committee/:userId')
  .put(validate(updateCommitteeRoleSchema), controller.updateCommitteeRole)
  .delete(controller.removeCommitteeMember);

// Budget
router.put('/:id/budget', validate(updateBudgetSchema), controller.updateBudget);

export { orgEventRouter };
export default router;
