import { Router } from 'express';
import authRoutes from './auth.routes';
import reservationRoutes from './reservation.routes';
import restaurantRoutes from './restaurant.routes';
import tableRoutes from './table.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/tables', tableRoutes);
router.use('/reservations', reservationRoutes);

export default router;
