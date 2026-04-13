import { RowDataPacket } from 'mysql2/promise';
import { executeQuery, selectQuery } from '../config/database/connection';
import { RestaurantTable } from './table.model';

export type ReservationStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';

interface ReservationRow extends RowDataPacket {
  id: number;
  user_id: number;
  restaurant_id: number;
  table_id: number;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  status: ReservationStatus;
  customer_notes: string | null;
  rejection_reason: string | null;
  created_at: Date;
  updated_at: Date;
  customer_name: string;
  customer_email: string;
  restaurant_name: string;
  restaurant_owner_id: number;
  table_number: string;
  table_capacity: number;
}

export type ReservationDetails = ReservationRow;

export interface CreateReservationInput {
  userId: number;
  restaurantId: number;
  tableId: number;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  customerNotes?: string;
}

export interface UpdateReservationInput {
  tableId?: number;
  reservationDate?: string;
  reservationTime?: string;
  guestCount?: number;
  customerNotes?: string;
  status?: ReservationStatus;
  rejectionReason?: string | null;
}

export class ReservationModel {
  private static baseSelect = `
    SELECT
      r.*,
      u.name AS customer_name,
      u.email AS customer_email,
      re.name AS restaurant_name,
      re.owner_id AS restaurant_owner_id,
      t.table_number,
      t.capacity AS table_capacity
    FROM reservations r
    INNER JOIN users u ON u.id = r.user_id
    INNER JOIN restaurants re ON re.id = r.restaurant_id
    INNER JOIN tables t ON t.id = r.table_id
  `;

  static async create(data: CreateReservationInput): Promise<ReservationDetails | null> {
    const result = await executeQuery(
      `INSERT INTO reservations (
        user_id, restaurant_id, table_id, reservation_date, reservation_time, guest_count, customer_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.userId,
        data.restaurantId,
        data.tableId,
        data.reservationDate,
        data.reservationTime,
        data.guestCount,
        data.customerNotes || null
      ]
    );

    return this.findById(result.insertId);
  }

  static async findById(id: number): Promise<ReservationDetails | null> {
    const rows = await selectQuery<ReservationRow>(`${this.baseSelect} WHERE r.id = ? LIMIT 1`, [id]);
    return rows[0] || null;
  }

  static async list(): Promise<ReservationDetails[]> {
    return selectQuery<ReservationRow>(`${this.baseSelect} ORDER BY r.reservation_date DESC, r.reservation_time DESC`);
  }

  static async listByUser(userId: number): Promise<ReservationDetails[]> {
    return selectQuery<ReservationRow>(
      `${this.baseSelect} WHERE r.user_id = ? ORDER BY r.reservation_date DESC, r.reservation_time DESC`,
      [userId]
    );
  }

  static async listByOwner(ownerId: number): Promise<ReservationDetails[]> {
    return selectQuery<ReservationRow>(
      `${this.baseSelect} WHERE re.owner_id = ? ORDER BY r.reservation_date DESC, r.reservation_time DESC`,
      [ownerId]
    );
  }

  static async update(id: number, data: UpdateReservationInput): Promise<ReservationDetails | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.tableId !== undefined) {
      fields.push('table_id = ?');
      values.push(data.tableId);
    }

    if (data.reservationDate !== undefined) {
      fields.push('reservation_date = ?');
      values.push(data.reservationDate);
    }

    if (data.reservationTime !== undefined) {
      fields.push('reservation_time = ?');
      values.push(data.reservationTime);
    }

    if (data.guestCount !== undefined) {
      fields.push('guest_count = ?');
      values.push(data.guestCount);
    }

    if (data.customerNotes !== undefined) {
      fields.push('customer_notes = ?');
      values.push(data.customerNotes);
    }

    if (data.status !== undefined) {
      fields.push('status = ?');
      values.push(data.status);
    }

    if (data.rejectionReason !== undefined) {
      fields.push('rejection_reason = ?');
      values.push(data.rejectionReason);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await executeQuery(`UPDATE reservations SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const result = await executeQuery('DELETE FROM reservations WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async findActiveByTableAndSlot(
    tableId: number,
    reservationDate: string,
    reservationTime: string,
    excludeReservationId?: number
  ): Promise<ReservationDetails | null> {
    const params: unknown[] = [tableId, reservationDate, reservationTime];
    let sql = `${this.baseSelect}
      WHERE r.table_id = ?
        AND r.reservation_date = ?
        AND r.reservation_time = ?
        AND r.status IN ('pending', 'confirmed')`;

    if (excludeReservationId !== undefined) {
      sql += ' AND r.id <> ?';
      params.push(excludeReservationId);
    }

    sql += ' LIMIT 1';

    const rows = await selectQuery<ReservationRow>(sql, params);
    return rows[0] || null;
  }

  static async findAvailableTables(
    restaurantId: number,
    reservationDate: string,
    reservationTime: string,
    guestCount: number
  ): Promise<RestaurantTable[]> {
    return selectQuery<RestaurantTable>(
      `SELECT *
       FROM tables
       WHERE restaurant_id = ?
         AND is_active = 1
         AND capacity >= ?
         AND id NOT IN (
           SELECT table_id
           FROM reservations
           WHERE restaurant_id = ?
             AND reservation_date = ?
             AND reservation_time = ?
             AND status IN ('pending', 'confirmed')
         )
       ORDER BY capacity ASC, table_number ASC`,
      [restaurantId, guestCount, restaurantId, reservationDate, reservationTime]
    );
  }
}
