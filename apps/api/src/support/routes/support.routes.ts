import { Router } from 'express';
import { supportController } from '../controllers/support.controller';
import { supportValidators } from '../validators/support.validator';
import { requireAuth, requireRole } from '../../auth/middleware/rbac.middleware';

const router = Router();

// Public routes (authenticated users)
router.post(
  '/messages',
  requireAuth,
  supportValidators.createMessage,
  supportController.createMessage
);

router.get(
  '/my-messages',
  requireAuth,
  supportController.getUserMessages
);

// Admin routes
router.get(
  '/messages',
  requireAuth,
  requireRole('ADMIN', 'SUPERADMIN'),
  supportController.getAllMessages
);

router.get(
  '/messages/:id',
  requireAuth,
  requireRole('ADMIN', 'SUPERADMIN'),
  supportValidators.messageId,
  supportController.getMessageById
);

router.post(
  '/messages/:id/responses',
  requireAuth,
  requireRole('ADMIN', 'SUPERADMIN'),
  supportValidators.addResponse,
  supportController.addResponse
);

router.patch(
  '/messages/:id/status',
  requireAuth,
  requireRole('ADMIN', 'SUPERADMIN'),
  supportValidators.updateStatus,
  supportController.updateStatus
);

router.patch(
  '/messages/:id/read',
  requireAuth,
  requireRole('ADMIN', 'SUPERADMIN'),
  supportValidators.messageId,
  supportController.markAsRead
);

router.get(
  '/stats',
  requireAuth,
  requireRole('ADMIN', 'SUPERADMIN'),
  supportController.getStats
);

export default router;