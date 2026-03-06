import { Router } from 'express';
import * as invoiceController from '../controllers/invoiceController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth());

router.get('/', invoiceController.list);
router.get('/:id', invoiceController.getById);

router.post('/', requireRole(['Admin', 'Accountant']), invoiceController.create);
router.patch('/:id', requireRole(['Admin', 'Accountant']), invoiceController.update);
router.delete(
  '/:id',
  requireRole(['Admin'], { message: 'Forbidden: only Admin can delete invoices' }),
  invoiceController.remove
);

export default router;
