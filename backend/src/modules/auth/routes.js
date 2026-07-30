import { Router } from 'express';
import { login, register, logout, getMe, updateProfile } from './controller.js';
import { protect } from '../../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

router
  .route('/me')
  .get(protect, getMe);

router
  .route('/profile')
  .put(protect, updateProfile);

export default router;
