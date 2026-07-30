import { Router } from 'express';
import * as controller from './controller.js';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
  createOrganisationSchema,
  updateOrganisationSchema,
  addMemberSchema,
  updateMemberSchema,
  inviteMemberSchema,
} from './validator.js';

const router = Router();

router.use(protect);

router.route('/')
  .post(validate(createOrganisationSchema), controller.create)
  .get(controller.getAll);

router.get('/slug/:slug', controller.getBySlug);

router.route('/:id')
  .get(controller.getById)
  .put(validate(updateOrganisationSchema), controller.update);

router.post('/:id/archive', controller.archive);

router.route('/:id/members')
  .post(validate(addMemberSchema), controller.addMember);

router.route('/:id/members/:userId')
  .put(validate(updateMemberSchema), controller.updateMemberRole)
  .delete(controller.removeMember);

router.route('/:id/invites')
  .post(validate(inviteMemberSchema), controller.sendInvite);

router.post('/:id/invites/:token/accept', controller.acceptInvite);

export default router;
