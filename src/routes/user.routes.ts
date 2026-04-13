import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', authorizeRoles('admin'), asyncHandler(UserController.listUsers));
router.get('/:id', asyncHandler(UserController.getUserById));
router.put('/:id', asyncHandler(UserController.updateUser));
router.delete('/:id', asyncHandler(UserController.deleteUser));
router.get('/:id/reservations/history', asyncHandler(UserController.getReservationHistory));

export default router;
