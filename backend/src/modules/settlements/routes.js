import { Router } from 'express';
import * as controller from './controller.js';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createSettlementSchema } from './validator.js';

const router = Router();
router.use(protect);

router.route('/')
  .post(validate(createSettlementSchema), controller.create);

router.route('/:id')
  .get(controller.getById);

router.get('/group/:groupId', controller.getByGroup);

export default router;
