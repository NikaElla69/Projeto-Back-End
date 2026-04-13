import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', asyncHandler(ReservationController.listReservations));
router.get('/:id', asyncHandler(ReservationController.getReservationById));
router.post('/', asyncHandler(ReservationController.createReservation));
router.put('/:id', asyncHandler(ReservationController.updateReservation));
router.patch('/:id/status', asyncHandler(ReservationController.updateStatus));
router.delete('/:id', asyncHandler(ReservationController.deleteReservation));

export default router;
