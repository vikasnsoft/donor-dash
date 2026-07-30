import { Router } from 'express';
import * as controller from './controller.js';
import { protect } from '../../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', controller.getAll);
router.get('/unread', controller.getUnreadCount);
router.put('/:id/read', controller.markRead);
router.put('/read-all', controller.markAllRead);

export default router;
