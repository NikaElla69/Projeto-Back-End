import { Router } from 'express';
import { TableController } from '../controllers/table.controller';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

router.get('/restaurant/:restaurantId', asyncHandler(TableController.listTablesByRestaurant));
router.get('/:id', asyncHandler(TableController.getTableById));
router.post('/', authMiddleware, authorizeRoles('owner', 'admin'), asyncHandler(TableController.createTable));
router.put('/:id', authMiddleware, authorizeRoles('owner', 'admin'), asyncHandler(TableController.updateTable));
router.delete('/:id', authMiddleware, authorizeRoles('owner', 'admin'), asyncHandler(TableController.deleteTable));

export default router;
