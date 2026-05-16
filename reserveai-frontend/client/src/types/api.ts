/**
 * Design philosophy for domain types: keep the editorial dining experience grounded in clear, reliable contracts.
 * This file centralizes the ReserveAí API shapes so pages and components stay elegant while data integration remains predictable.
 */
export type UserRole = 'customer' | 'owner' | 'admin';
export type ReservationStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';

export interface ApiEnvelope<T> {
  message: string;
  data: T;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Restaurant {
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
  created_at: string;
}

export interface RestaurantInput {
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

export interface TableEntity {
  id: number;
  restaurant_id: number;
  table_number: string;
  capacity: number;
  location: string | null;
  is_active: boolean;
  created_at: string;
}

export interface TableInput {
  restaurantId: number;
  tableNumber: string;
  capacity: number;
  location?: string;
  isActive?: boolean;
}

export interface Reservation {
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
  created_at?: string;
  updated_at?: string;
  customer_name?: string;
  customer_email?: string;
  restaurant_name?: string;
  restaurant_owner_id?: number;
  table_number?: string;
  table_capacity?: number;
}

export interface ReservationInput {
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
}

export interface UpdateReservationStatusInput {
  status: ReservationStatus;
  rejectionReason?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface RestaurantAvailabilityResponse {
  restaurant: Restaurant;
  availableTables: TableEntity[];
  date: string;
  time: string;
  guestCount: number;
}

export interface AuthSession {
  token: string;
  user: User;
}
