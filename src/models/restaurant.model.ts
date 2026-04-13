import { RowDataPacket } from 'mysql2/promise';
import { executeQuery, selectQuery } from '../config/database/connection';

interface RestaurantRow extends RowDataPacket {
  id: number;
  owner_id: number;
  name: string;
  description: string | null;
  cuisine_type: string | null;
  phone: string | null;
  city: string | null;
  address: string | null;
  logo_url: string | null;
  reservation_limit_time: string | null;
  no_show_policy: string | null;
  created_at: Date;
}

export type Restaurant = RestaurantRow;

export interface CreateRestaurantInput {
  ownerId: number;
  name: string;
  description?: string;
  cuisineType?: string;
  phone?: string;
  city?: string;
  address?: string;
  logoUrl?: string;
  reservationLimitTime?: string;
  noShowPolicy?: string;
}

export interface UpdateRestaurantInput {
  name?: string;
  description?: string;
  cuisineType?: string;
  phone?: string;
  city?: string;
  address?: string;
  logoUrl?: string;
  reservationLimitTime?: string;
  noShowPolicy?: string;
}

export class RestaurantModel {
  static async create(data: CreateRestaurantInput): Promise<Restaurant | null> {
    const result = await executeQuery(
      `INSERT INTO restaurants (
        owner_id, name, description, cuisine_type, phone, city, address, logo_url, reservation_limit_time, no_show_policy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.ownerId,
        data.name,
        data.description || null,
        data.cuisineType || null,
        data.phone || null,
        data.city || null,
        data.address || null,
        data.logoUrl || null,
        data.reservationLimitTime || null,
        data.noShowPolicy || null
      ]
    );

    return this.findById(result.insertId);
  }

  static async findById(id: number): Promise<Restaurant | null> {
    const rows = await selectQuery<RestaurantRow>('SELECT * FROM restaurants WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  }

  static async list(): Promise<Restaurant[]> {
    return selectQuery<RestaurantRow>('SELECT * FROM restaurants ORDER BY created_at DESC');
  }

  static async listByOwner(ownerId: number): Promise<Restaurant[]> {
    return selectQuery<RestaurantRow>('SELECT * FROM restaurants WHERE owner_id = ? ORDER BY created_at DESC', [ownerId]);
  }

  static async update(id: number, data: UpdateRestaurantInput): Promise<Restaurant | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }

    if (data.description !== undefined) {
      fields.push('description = ?');
      values.push(data.description);
    }

    if (data.cuisineType !== undefined) {
      fields.push('cuisine_type = ?');
      values.push(data.cuisineType);
    }

    if (data.phone !== undefined) {
      fields.push('phone = ?');
      values.push(data.phone);
    }

    if (data.city !== undefined) {
      fields.push('city = ?');
      values.push(data.city);
    }

    if (data.address !== undefined) {
      fields.push('address = ?');
      values.push(data.address);
    }

    if (data.logoUrl !== undefined) {
      fields.push('logo_url = ?');
      values.push(data.logoUrl);
    }

    if (data.reservationLimitTime !== undefined) {
      fields.push('reservation_limit_time = ?');
      values.push(data.reservationLimitTime);
    }

    if (data.noShowPolicy !== undefined) {
      fields.push('no_show_policy = ?');
      values.push(data.noShowPolicy);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await executeQuery(`UPDATE restaurants SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const result = await executeQuery('DELETE FROM restaurants WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
