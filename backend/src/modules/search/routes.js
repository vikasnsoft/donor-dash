import { Router } from 'express';
import * as controller from './controller.js';
import { protect } from '../../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', controller.search);

export default router;
