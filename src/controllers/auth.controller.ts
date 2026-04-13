import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../middlewares/error.middleware';
import { AuthenticatedRequest } from '../types/auth';
import { CreateUserInput, UserModel } from '../models/user.model';

function generateToken(id: number, email: string, role: string): string {
  return jwt.sign(
    { id, email, role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] }
  );
}

export class AuthController {
  static async register(req: Request, res: Response): Promise<Response> {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      throw new AppError('Name, email and password are required', 400);
    }

    const existingUser = await UserModel.findByEmail(email);

    if (existingUser) {
      throw new AppError('Email is already in use', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const payload: CreateUserInput = {
      name,
      email,
      passwordHash,
      role: role || 'customer'
    };

    const user = await UserModel.create(payload);

    if (!user) {
      throw new AppError('User could not be created', 500);
    }

    const token = generateToken(user.id, user.email, user.role);

    return res.status(201).json({
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  }

  static async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const user = await UserModel.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken(user.id, user.email, user.role);

    return res.status(200).json({
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at
        }
      }
    });
  }

  static async me(req: AuthenticatedRequest, res: Response): Promise<Response> {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const user = await UserModel.findById(req.user.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return res.status(200).json({ data: user });
  }
}
