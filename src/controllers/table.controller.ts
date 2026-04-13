import { Request, Response } from 'express';
import { AppError } from '../middlewares/error.middleware';
import { RestaurantModel } from '../models/restaurant.model';
import { TableModel } from '../models/table.model';
import { AuthenticatedRequest } from '../types/auth';

async function ensureTableOwnership(userId: number, restaurantId: number): Promise<void> {
  const restaurant = await RestaurantModel.findById(restaurantId);

  if (!restaurant) {
    throw new AppError('Restaurant not found', 404);
  }

  if (restaurant.owner_id !== userId) {
    throw new AppError('You do not have permission to manage tables for this restaurant', 403);
  }
}

export class TableController {
  static async createTable(req: AuthenticatedRequest, res: Response): Promise<Response> {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const { restaurantId, tableNumber, capacity, location, isActive } = req.body;

    if (!restaurantId || !tableNumber || !capacity) {
      throw new AppError('restaurantId, tableNumber and capacity are required', 400);
    }

    if (req.user.role !== 'admin') {
      await ensureTableOwnership(req.user.id, Number(restaurantId));
    }

    const table = await TableModel.create({
      restaurantId: Number(restaurantId),
      tableNumber,
      capacity: Number(capacity),
      location,
      isActive
    });

    return res.status(201).json({
      message: 'Table created successfully',
      data: table
    });
  }

  static async listTablesByRestaurant(req: Request, res: Response): Promise<Response> {
    const restaurantId = Number(req.params.restaurantId);
    const tables = await TableModel.listByRestaurant(restaurantId);
    return res.status(200).json({ data: tables });
  }

  static async getTableById(req: Request, res: Response): Promise<Response> {
    const tableId = Number(req.params.id);
    const table = await TableModel.findById(tableId);

    if (!table) {
      throw new AppError('Table not found', 404);
    }

    return res.status(200).json({ data: table });
  }

  static async updateTable(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const tableId = Number(req.params.id);
    const table = await TableModel.findById(tableId);

    if (!table) {
      throw new AppError('Table not found', 404);
    }

    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (req.user.role !== 'admin') {
      await ensureTableOwnership(req.user.id, table.restaurant_id);
    }

    const updatedTable = await TableModel.update(tableId, {
      tableNumber: req.body.tableNumber,
      capacity: req.body.capacity !== undefined ? Number(req.body.capacity) : undefined,
      location: req.body.location,
      isActive: req.body.isActive
    });

    return res.status(200).json({
      message: 'Table updated successfully',
      data: updatedTable
    });
  }

  static async deleteTable(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const tableId = Number(req.params.id);
    const table = await TableModel.findById(tableId);

    if (!table) {
      throw new AppError('Table not found', 404);
    }

    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (req.user.role !== 'admin') {
      await ensureTableOwnership(req.user.id, table.restaurant_id);
    }

    const deleted = await TableModel.delete(tableId);

    if (!deleted) {
      throw new AppError('Table not found', 404);
    }

    return res.status(200).json({ message: 'Table deleted successfully' });
  }
}
