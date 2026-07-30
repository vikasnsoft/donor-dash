import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from './controller.js';
import { protect, admin } from '../../middleware/auth.js';

const router = Router();

router.use(protect, admin);

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

export default router;
