import { RowDataPacket } from 'mysql2/promise';
import { executeQuery, selectQuery } from '../config/database/connection';
import { UserRole } from '../types/auth';

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserRole;
}

export class UserModel {
  private static toPublicUser(user: UserRow | null): PublicUser | null {
    if (!user) {
      return null;
    }

    const { password_hash: _passwordHash, ...publicUser } = user;
    return publicUser;
  }

  static async create(data: CreateUserInput): Promise<PublicUser | null> {
    const result = await executeQuery(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [data.name, data.email, data.passwordHash, data.role || 'customer']
    );

    return this.findById(result.insertId);
  }

  static async findByEmail(email: string): Promise<UserRow | null> {
    const rows = await selectQuery<UserRow>('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    return rows[0] || null;
  }

  static async findById(id: number): Promise<PublicUser | null> {
    const rows = await selectQuery<UserRow>('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    return this.toPublicUser(rows[0] || null);
  }

  static async list(): Promise<PublicUser[]> {
    const rows = await selectQuery<UserRow>('SELECT * FROM users ORDER BY created_at DESC');
    return rows.map((row) => this.toPublicUser(row) as PublicUser);
  }

  static async update(id: number, data: UpdateUserInput): Promise<PublicUser | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }

    if (data.email !== undefined) {
      fields.push('email = ?');
      values.push(data.email);
    }

    if (data.role !== undefined) {
      fields.push('role = ?');
      values.push(data.role);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await executeQuery(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const result = await executeQuery('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
