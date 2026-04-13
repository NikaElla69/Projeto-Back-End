import { RowDataPacket } from 'mysql2/promise';
import { executeQuery, selectQuery } from '../config/database/connection';

interface TableRow extends RowDataPacket {
  id: number;
  restaurant_id: number;
  table_number: string;
  capacity: number;
  location: string | null;
  is_active: number;
  created_at: Date;
}

export type RestaurantTable = TableRow;

export interface CreateTableInput {
  restaurantId: number;
  tableNumber: string;
  capacity: number;
  location?: string;
  isActive?: boolean;
}

export interface UpdateTableInput {
  tableNumber?: string;
  capacity?: number;
  location?: string;
  isActive?: boolean;
}

export class TableModel {
  static async create(data: CreateTableInput): Promise<RestaurantTable | null> {
    const result = await executeQuery(
      'INSERT INTO tables (restaurant_id, table_number, capacity, location, is_active) VALUES (?, ?, ?, ?, ?)',
      [data.restaurantId, data.tableNumber, data.capacity, data.location || null, data.isActive ?? true]
    );

    return this.findById(result.insertId);
  }

  static async findById(id: number): Promise<RestaurantTable | null> {
    const rows = await selectQuery<TableRow>('SELECT * FROM tables WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  }

  static async listByRestaurant(restaurantId: number): Promise<RestaurantTable[]> {
    return selectQuery<TableRow>('SELECT * FROM tables WHERE restaurant_id = ? ORDER BY table_number ASC', [restaurantId]);
  }

  static async update(id: number, data: UpdateTableInput): Promise<RestaurantTable | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.tableNumber !== undefined) {
      fields.push('table_number = ?');
      values.push(data.tableNumber);
    }

    if (data.capacity !== undefined) {
      fields.push('capacity = ?');
      values.push(data.capacity);
    }

    if (data.location !== undefined) {
      fields.push('location = ?');
      values.push(data.location);
    }

    if (data.isActive !== undefined) {
      fields.push('is_active = ?');
      values.push(data.isActive);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await executeQuery(`UPDATE tables SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const result = await executeQuery('DELETE FROM tables WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
