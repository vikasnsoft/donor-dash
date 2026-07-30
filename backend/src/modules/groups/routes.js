import { Router } from 'express';
import * as controller from './controller.js';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createGroupSchema, updateGroupSchema, addMemberSchema } from './validator.js';

const router = Router();
router.use(protect);

router.route('/')
  .post(validate(createGroupSchema), controller.create)
  .get(controller.getAll);

router.route('/:id')
  .get(controller.getById)
  .put(validate(updateGroupSchema), controller.update);

router.post('/:id/archive', controller.archive);
router.post('/:id/invite', controller.generateInvite);
router.post('/join/:code', controller.joinByInvite);

router.route('/:id/members')
  .post(validate(addMemberSchema), controller.addMember);

router.delete('/:id/members/:userId', controller.removeMember);

export default router;
