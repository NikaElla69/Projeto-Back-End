import { Request, Response } from 'express';
import { AppError } from '../middlewares/error.middleware';
import { ReservationModel } from '../models/reservation.model';
import { RestaurantModel } from '../models/restaurant.model';
import { AuthenticatedRequest } from '../types/auth';

async function ensureRestaurantOwnership(userId: number, restaurantId: number): Promise<void> {
  const restaurant = await RestaurantModel.findById(restaurantId);

  if (!restaurant) {
    throw new AppError('Restaurant not found', 404);
  }

  if (restaurant.owner_id !== userId) {
    throw new AppError('You do not have permission to manage this restaurant', 403);
  }
}

export class RestaurantController {
  static async createRestaurant(req: AuthenticatedRequest, res: Response): Promise<Response> {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const { name, description, cuisineType, phone, city, address, logoUrl, reservationLimitTime, noShowPolicy } = req.body;

    if (!name) {
      throw new AppError('Restaurant name is required', 400);
    }

    const restaurant = await RestaurantModel.create({
      ownerId: req.user.id,
      name,
      description,
      cuisineType,
      phone,
      city,
      address,
      logoUrl,
      reservationLimitTime,
      noShowPolicy
    });

    return res.status(201).json({
      message: 'Restaurant created successfully',
      data: restaurant
    });
  }

  static async listRestaurants(_req: Request, res: Response): Promise<Response> {
    const restaurants = await RestaurantModel.list();
    return res.status(200).json({ data: restaurants });
  }

  static async getRestaurantById(req: Request, res: Response): Promise<Response> {
    const restaurantId = Number(req.params.id);
    const restaurant = await RestaurantModel.findById(restaurantId);

    if (!restaurant) {
      throw new AppError('Restaurant not found', 404);
    }

    return res.status(200).json({ data: restaurant });
  }

  static async updateRestaurant(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const restaurantId = Number(req.params.id);

    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (req.user.role !== 'admin') {
      await ensureRestaurantOwnership(req.user.id, restaurantId);
    }

    const restaurant = await RestaurantModel.update(restaurantId, {
      name: req.body.name,
      description: req.body.description,
      cuisineType: req.body.cuisineType,
      phone: req.body.phone,
      city: req.body.city,
      address: req.body.address,
      logoUrl: req.body.logoUrl,
      reservationLimitTime: req.body.reservationLimitTime,
      noShowPolicy: req.body.noShowPolicy
    });

    if (!restaurant) {
      throw new AppError('Restaurant not found', 404);
    }

    return res.status(200).json({
      message: 'Restaurant updated successfully',
      data: restaurant
    });
  }

  static async deleteRestaurant(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const restaurantId = Number(req.params.id);

    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (req.user.role !== 'admin') {
      await ensureRestaurantOwnership(req.user.id, restaurantId);
    }

    const deleted = await RestaurantModel.delete(restaurantId);

    if (!deleted) {
      throw new AppError('Restaurant not found', 404);
    }

    return res.status(200).json({ message: 'Restaurant deleted successfully' });
  }

  static async getAvailability(req: Request, res: Response): Promise<Response> {
    const restaurantId = Number(req.params.id);
    const { date, time, guestCount } = req.query;

    if (!date || !time) {
      throw new AppError('Date and time are required to check availability', 400);
    }

    const restaurant = await RestaurantModel.findById(restaurantId);

    if (!restaurant) {
      throw new AppError('Restaurant not found', 404);
    }

    const availableTables = await ReservationModel.findAvailableTables(
      restaurantId,
      String(date),
      String(time),
      Number(guestCount || 1)
    );

    return res.status(200).json({
      data: {
        restaurant,
        availableTables
      }
    });
  }
}
