import { Router } from 'express';
import * as controller from './controller.js';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createDonorSchema, updateDonorSchema } from './validator.js';

const router = Router();
router.use(protect);

// Organisation-scoped routes (mounted at /organisations/:orgId/donors)
const orgDonorRouter = Router({ mergeParams: true });
orgDonorRouter.use(protect);

orgDonorRouter.route('/')
  .post(validate(createDonorSchema), controller.create)
  .get(controller.getAll);

orgDonorRouter.get('/search', controller.search);
orgDonorRouter.get('/top', controller.getTopDonors);

// Standalone routes (mounted at /donors)
router.route('/:id')
  .get(controller.getById)
  .put(validate(updateDonorSchema), controller.update)
  .delete(controller.remove);

export { orgDonorRouter };
export default router;
