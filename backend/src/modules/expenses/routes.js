import { Router } from 'express';
import * as controller from './controller.js';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createExpenseSchema } from './validator.js';

const router = Router();
router.use(protect);

router.route('/')
  .post(validate(createExpenseSchema), controller.create);

router.route('/:id')
  .get(controller.getById);

router.get('/group/:groupId', controller.getByGroup);
router.get('/group/:groupId/balances', controller.getGroupBalances);
router.get('/group/:groupId/simplify', controller.getSimplifiedDebts);
router.get('/me/balances', controller.getUserBalanceSummary);

export default router;
