import { Router } from 'express';
import { RestaurantController } from '../controllers/restaurant.controller';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

router.get('/', asyncHandler(RestaurantController.listRestaurants));
router.get('/:id', asyncHandler(RestaurantController.getRestaurantById));
router.get('/:id/availability', asyncHandler(RestaurantController.getAvailability));
router.post('/', authMiddleware, authorizeRoles('owner', 'admin'), asyncHandler(RestaurantController.createRestaurant));
router.put('/:id', authMiddleware, authorizeRoles('owner', 'admin'), asyncHandler(RestaurantController.updateRestaurant));
router.delete('/:id', authMiddleware, authorizeRoles('owner', 'admin'), asyncHandler(RestaurantController.deleteRestaurant));

export default router;
