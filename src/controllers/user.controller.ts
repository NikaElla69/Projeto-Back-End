import { Response } from 'express';
import { AppError } from '../middlewares/error.middleware';
import { ReservationModel } from '../models/reservation.model';
import { UserModel } from '../models/user.model';
import { AuthenticatedRequest } from '../types/auth';

export class UserController {
  static async listUsers(_req: AuthenticatedRequest, res: Response): Promise<Response> {
    const users = await UserModel.list();
    return res.status(200).json({ data: users });
  }

  static async getUserById(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = Number(req.params.id);

    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (req.user.role !== 'admin' && req.user.id !== userId) {
      throw new AppError('You do not have permission to view this user', 403);
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return res.status(200).json({ data: user });
  }

  static async updateUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = Number(req.params.id);

    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (req.user.role !== 'admin' && req.user.id !== userId) {
      throw new AppError('You do not have permission to update this user', 403);
    }

    const currentUser = await UserModel.findById(userId);

    if (!currentUser) {
      throw new AppError('User not found', 404);
    }

    const updatedUser = await UserModel.update(userId, {
      name: req.body.name,
      email: req.body.email,
      role: req.user.role === 'admin' ? req.body.role : undefined
    });

    return res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser
    });
  }

  static async deleteUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = Number(req.params.id);

    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (req.user.role !== 'admin' && req.user.id !== userId) {
      throw new AppError('You do not have permission to delete this user', 403);
    }

    const deleted = await UserModel.delete(userId);

    if (!deleted) {
      throw new AppError('User not found', 404);
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  }

  static async getReservationHistory(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = Number(req.params.id);

    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (req.user.role !== 'admin' && req.user.id !== userId) {
      throw new AppError('You do not have permission to view this history', 403);
    }

    const reservations = await ReservationModel.listByUser(userId);
    return res.status(200).json({ data: reservations });
  }
}
