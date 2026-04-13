import { Response } from 'express';
import { AppError } from '../middlewares/error.middleware';
import { ReservationModel, ReservationStatus } from '../models/reservation.model';
import { RestaurantModel } from '../models/restaurant.model';
import { TableModel } from '../models/table.model';
import { AuthenticatedRequest } from '../types/auth';

function ensureValidTimeLimit(limitTime: string | null, reservationTime: string): void {
  if (limitTime && reservationTime > limitTime) {
    throw new AppError(`Reservations must be created up to ${limitTime}`, 400);
  }
}

async function validateReservationData(
  restaurantId: number,
  tableId: number,
  guestCount: number,
  reservationDate: string,
  reservationTime: string,
  excludeReservationId?: number
): Promise<void> {
  const restaurant = await RestaurantModel.findById(restaurantId);

  if (!restaurant) {
    throw new AppError('Restaurant not found', 404);
  }

  const table = await TableModel.findById(tableId);

  if (!table || table.restaurant_id !== restaurantId) {
    throw new AppError('Table not found for the selected restaurant', 404);
  }

  if (!table.is_active) {
    throw new AppError('Selected table is inactive', 400);
  }

  if (guestCount > table.capacity) {
    throw new AppError('Guest count exceeds the table capacity', 400);
  }

  ensureValidTimeLimit(restaurant.reservation_limit_time, reservationTime);

  const existingReservation = await ReservationModel.findActiveByTableAndSlot(
    tableId,
    reservationDate,
    reservationTime,
    excludeReservationId
  );

  if (existingReservation) {
    throw new AppError('This table is already reserved for the selected date and time', 409);
  }
}

function canAccessReservation(req: AuthenticatedRequest, reservationOwnerId: number, restaurantOwnerId: number): boolean {
  if (!req.user) {
    return false;
  }

  return req.user.role === 'admin' || req.user.id === reservationOwnerId || req.user.id === restaurantOwnerId;
}

export class ReservationController {
  static async createReservation(req: AuthenticatedRequest, res: Response): Promise<Response> {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const { restaurantId, tableId, reservationDate, reservationTime, guestCount, customerNotes } = req.body;

    if (!restaurantId || !tableId || !reservationDate || !reservationTime || !guestCount) {
      throw new AppError('restaurantId, tableId, reservationDate, reservationTime and guestCount are required', 400);
    }

    await validateReservationData(
      Number(restaurantId),
      Number(tableId),
      Number(guestCount),
      String(reservationDate),
      String(reservationTime)
    );

    const reservation = await ReservationModel.create({
      userId: req.user.id,
      restaurantId: Number(restaurantId),
      tableId: Number(tableId),
      reservationDate: String(reservationDate),
      reservationTime: String(reservationTime),
      guestCount: Number(guestCount),
      customerNotes
    });

    return res.status(201).json({
      message: 'Reservation created successfully',
      data: reservation
    });
  }

  static async listReservations(req: AuthenticatedRequest, res: Response): Promise<Response> {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const reservations = req.user.role === 'admin'
      ? await ReservationModel.list()
      : req.user.role === 'owner'
        ? await ReservationModel.listByOwner(req.user.id)
        : await ReservationModel.listByUser(req.user.id);

    return res.status(200).json({ data: reservations });
  }

  static async getReservationById(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const reservationId = Number(req.params.id);
    const reservation = await ReservationModel.findById(reservationId);

    if (!reservation) {
      throw new AppError('Reservation not found', 404);
    }

    if (!canAccessReservation(req, reservation.user_id, reservation.restaurant_owner_id)) {
      throw new AppError('You do not have permission to view this reservation', 403);
    }

    return res.status(200).json({ data: reservation });
  }

  static async updateReservation(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const reservationId = Number(req.params.id);
    const existingReservation = await ReservationModel.findById(reservationId);

    if (!existingReservation) {
      throw new AppError('Reservation not found', 404);
    }

    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (req.user.role !== 'admin' && req.user.id !== existingReservation.user_id) {
      throw new AppError('Only the reservation owner or an admin can update this reservation', 403);
    }

    const nextTableId = req.body.tableId !== undefined ? Number(req.body.tableId) : existingReservation.table_id;
    const nextDate = req.body.reservationDate || existingReservation.reservation_date;
    const nextTime = req.body.reservationTime || existingReservation.reservation_time;
    const nextGuestCount = req.body.guestCount !== undefined ? Number(req.body.guestCount) : existingReservation.guest_count;

    await validateReservationData(
      existingReservation.restaurant_id,
      nextTableId,
      nextGuestCount,
      nextDate,
      nextTime,
      reservationId
    );

    const updatedReservation = await ReservationModel.update(reservationId, {
      tableId: req.body.tableId !== undefined ? Number(req.body.tableId) : undefined,
      reservationDate: req.body.reservationDate,
      reservationTime: req.body.reservationTime,
      guestCount: req.body.guestCount !== undefined ? Number(req.body.guestCount) : undefined,
      customerNotes: req.body.customerNotes
    });

    return res.status(200).json({
      message: 'Reservation updated successfully',
      data: updatedReservation
    });
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const reservationId = Number(req.params.id);
    const { status, rejectionReason } = req.body as { status: ReservationStatus; rejectionReason?: string };
    const reservation = await ReservationModel.findById(reservationId);

    if (!reservation) {
      throw new AppError('Reservation not found', 404);
    }

    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (req.user.role !== 'admin' && req.user.id !== reservation.restaurant_owner_id) {
      throw new AppError('Only the restaurant owner or an admin can change reservation status', 403);
    }

    const allowedStatus: ReservationStatus[] = ['confirmed', 'rejected', 'cancelled', 'completed'];

    if (!status || !allowedStatus.includes(status)) {
      throw new AppError('Invalid reservation status', 400);
    }

    if (status === 'rejected' && !rejectionReason) {
      throw new AppError('Rejection reason is required when rejecting a reservation', 400);
    }

    const updatedReservation = await ReservationModel.update(reservationId, {
      status,
      rejectionReason: status === 'rejected' ? rejectionReason || null : null
    });

    return res.status(200).json({
      message: 'Reservation status updated successfully',
      data: updatedReservation
    });
  }

  static async deleteReservation(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const reservationId = Number(req.params.id);
    const reservation = await ReservationModel.findById(reservationId);

    if (!reservation) {
      throw new AppError('Reservation not found', 404);
    }

    if (!canAccessReservation(req, reservation.user_id, reservation.restaurant_owner_id)) {
      throw new AppError('You do not have permission to delete this reservation', 403);
    }

    const deleted = await ReservationModel.delete(reservationId);

    if (!deleted) {
      throw new AppError('Reservation not found', 404);
    }

    return res.status(200).json({ message: 'Reservation deleted successfully' });
  }
}
