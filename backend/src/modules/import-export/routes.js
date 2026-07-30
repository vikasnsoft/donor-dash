import { Router } from 'express';
import multer from 'multer';
import * as controller from './controller.js';
import { protect } from '../../middleware/auth.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

const router = Router();
router.use(protect);

// Organisation-scoped (mounted at /organisations/:orgId/import-export)
const orgImportExportRouter = Router({ mergeParams: true });
orgImportExportRouter.use(protect);

orgImportExportRouter.post('/import/donors', upload.single('file'), controller.importDonors);
orgImportExportRouter.get('/export/donors', controller.exportDonors);
orgImportExportRouter.get('/export/donations', controller.exportDonations);
orgImportExportRouter.get('/export/ledger', controller.exportLedger);

export { orgImportExportRouter };
export default router;
