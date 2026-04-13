import { Request } from 'express';

export type UserRole = 'customer' | 'owner' | 'admin';

export interface AuthenticatedUserPayload {
  id: number;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUserPayload;
}
