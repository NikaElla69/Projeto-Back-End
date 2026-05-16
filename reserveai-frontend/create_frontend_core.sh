#!/usr/bin/env bash
set -euo pipefail
cd /home/ubuntu/reserveai-frontend
mkdir -p client/src/{contexts,routes,services,styles,types}
cat > client/src/types/api.ts <<'EOF'
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
EOF
cat > client/src/services/api.ts <<'EOF'
/**
 * Design philosophy for service transport: preserve the premium calm of the interface by making networking explicit,
 * consistent and graceful, with a single gateway for authentication, headers and human-readable failures.
 */
import axios from 'axios';

export const AUTH_STORAGE_KEY = 'reserveai.auth';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);

  if (raw) {
    try {
      const session = JSON.parse(raw) as { token?: string };
      if (session.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Não foi possível concluir a requisição.';

    return Promise.reject(new Error(message));
  }
);
EOF
cat > client/src/services/auth.service.ts <<'EOF'
/**
 * Design philosophy for authentication services: make access feel frictionless for diners while respecting the ReserveAí security boundary.
 */
import { api } from '@/services/api';
import type { ApiEnvelope, AuthPayload, LoginInput, RegisterInput, User } from '@/types/api';

export const authService = {
  async login(payload: LoginInput) {
    const response = await api.post<ApiEnvelope<AuthPayload>>('/auth/login', payload);
    return response.data.data;
  },

  async register(payload: RegisterInput) {
    const response = await api.post<ApiEnvelope<AuthPayload>>('/auth/register', payload);
    return response.data.data;
  },

  async me() {
    const response = await api.get<ApiEnvelope<User>>('/auth/me');
    return response.data.data;
  }
};
EOF
cat > client/src/services/restaurant.service.ts <<'EOF'
/**
 * Design philosophy for restaurant services: support discovery with concise, reliable calls that let the UI focus on atmosphere and clarity.
 */
import { api } from '@/services/api';
import type { ApiEnvelope, Restaurant, RestaurantAvailabilityResponse, RestaurantInput } from '@/types/api';

export const restaurantService = {
  async list() {
    const response = await api.get<ApiEnvelope<Restaurant[]>>('/restaurants');
    return response.data.data;
  },

  async getById(id: number) {
    const response = await api.get<ApiEnvelope<Restaurant>>(`/restaurants/${id}`);
    return response.data.data;
  },

  async getAvailability(id: number, params: { date: string; time: string; guestCount: number }) {
    const response = await api.get<ApiEnvelope<RestaurantAvailabilityResponse>>(`/restaurants/${id}/availability`, {
      params
    });
    return response.data.data;
  },

  async create(payload: RestaurantInput) {
    const response = await api.post<ApiEnvelope<Restaurant>>('/restaurants', payload);
    return response.data.data;
  },

  async update(id: number, payload: Partial<RestaurantInput>) {
    const response = await api.put<ApiEnvelope<Restaurant>>(`/restaurants/${id}`, payload);
    return response.data.data;
  },

  async remove(id: number) {
    const response = await api.delete<ApiEnvelope<{ success: boolean }>>(`/restaurants/${id}`);
    return response.data;
  }
};
EOF
cat > client/src/services/table.service.ts <<'EOF'
/**
 * Design philosophy for table services: expose seating details with enough precision for booking decisions, never with noisy transport concerns.
 */
import { api } from '@/services/api';
import type { ApiEnvelope, TableEntity, TableInput } from '@/types/api';

export const tableService = {
  async listByRestaurant(restaurantId: number) {
    const response = await api.get<ApiEnvelope<TableEntity[]>>(`/tables/restaurant/${restaurantId}`);
    return response.data.data;
  },

  async getById(id: number) {
    const response = await api.get<ApiEnvelope<TableEntity>>(`/tables/${id}`);
    return response.data.data;
  },

  async create(payload: TableInput) {
    const response = await api.post<ApiEnvelope<TableEntity>>('/tables', payload);
    return response.data.data;
  },

  async update(id: number, payload: Partial<TableInput>) {
    const response = await api.put<ApiEnvelope<TableEntity>>(`/tables/${id}`, payload);
    return response.data.data;
  },

  async remove(id: number) {
    const response = await api.delete<ApiEnvelope<{ success: boolean }>>(`/tables/${id}`);
    return response.data;
  }
};
EOF
cat > client/src/services/reservation.service.ts <<'EOF'
/**
 * Design philosophy for reservation services: keep the booking flow transparent and dependable, from creation to cancellation.
 */
import { api } from '@/services/api';
import type {
  ApiEnvelope,
  Reservation,
  ReservationInput,
  UpdateReservationInput,
  UpdateReservationStatusInput
} from '@/types/api';

export const reservationService = {
  async list() {
    const response = await api.get<ApiEnvelope<Reservation[]>>('/reservations');
    return response.data.data;
  },

  async getById(id: number) {
    const response = await api.get<ApiEnvelope<Reservation>>(`/reservations/${id}`);
    return response.data.data;
  },

  async create(payload: ReservationInput) {
    const response = await api.post<ApiEnvelope<Reservation>>('/reservations', payload);
    return response.data.data;
  },

  async update(id: number, payload: UpdateReservationInput) {
    const response = await api.put<ApiEnvelope<Reservation>>(`/reservations/${id}`, payload);
    return response.data.data;
  },

  async updateStatus(id: number, payload: UpdateReservationStatusInput) {
    const response = await api.patch<ApiEnvelope<Reservation>>(`/reservations/${id}/status`, payload);
    return response.data.data;
  },

  async remove(id: number) {
    const response = await api.delete<ApiEnvelope<{ success: boolean }>>(`/reservations/${id}`);
    return response.data;
  }
};
EOF
cat > client/src/services/user.service.ts <<'EOF'
/**
 * Design philosophy for user services: keep account-related operations explicit so the interface can remain composed and understandable for beginners.
 */
import { api } from '@/services/api';
import type { ApiEnvelope, Reservation, User } from '@/types/api';

export const userService = {
  async list() {
    const response = await api.get<ApiEnvelope<User[]>>('/users');
    return response.data.data;
  },

  async getById(id: number) {
    const response = await api.get<ApiEnvelope<User>>(`/users/${id}`);
    return response.data.data;
  },

  async update(id: number, payload: Partial<Pick<User, 'name' | 'email' | 'role'>>) {
    const response = await api.put<ApiEnvelope<User>>(`/users/${id}`, payload);
    return response.data.data;
  },

  async remove(id: number) {
    const response = await api.delete<ApiEnvelope<{ success: boolean }>>(`/users/${id}`);
    return response.data;
  },

  async reservationHistory(id: number) {
    const response = await api.get<ApiEnvelope<Reservation[]>>(`/users/${id}/reservations/history`);
    return response.data.data;
  }
};
EOF
cat > client/src/contexts/AuthContext.tsx <<'EOF'
/**
 * Design philosophy for auth state: the booking journey should feel calm and guided, while session handling stays deliberate and resilient.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '@/services/auth.service';
import { AUTH_STORAGE_KEY } from '@/services/api';
import type { AuthSession, LoginInput, RegisterInput, User } from '@/types/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (payload: LoginInput) => Promise<User>;
  register: (payload: RegisterInput) => Promise<User>;
  logout: () => void;
  refreshProfile: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function saveSession(session: AuthSession | null) {
  if (!session) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const applySession = useCallback((session: AuthSession | null) => {
    setUser(session?.user ?? null);
    setToken(session?.token ?? null);
    saveSession(session);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);

      if (!raw) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const stored = JSON.parse(raw) as AuthSession;

        if (!stored?.token) {
          applySession(null);
          setIsBootstrapping(false);
          return;
        }

        setToken(stored.token);
        setUser(stored.user);

        const profile = await authService.me();
        applySession({ token: stored.token, user: profile });
      } catch {
        applySession(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    void bootstrap();
  }, [applySession]);

  const login = useCallback(async (payload: LoginInput) => {
    const session = await authService.login(payload);
    applySession(session);
    return session.user;
  }, [applySession]);

  const register = useCallback(async (payload: RegisterInput) => {
    const session = await authService.register(payload);
    applySession(session);
    return session.user;
  }, [applySession]);

  const logout = useCallback(() => {
    applySession(null);
  }, [applySession]);

  const refreshProfile = useCallback(async () => {
    if (!token) {
      return null;
    }

    try {
      const profile = await authService.me();
      applySession({ token, user: profile });
      return profile;
    } catch {
      applySession(null);
      return null;
    }
  }, [applySession, token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isBootstrapping,
      login,
      register,
      logout,
      refreshProfile
    }),
    [isBootstrapping, login, logout, refreshProfile, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
EOF
cat > client/src/routes/ProtectedRoute.tsx <<'EOF'
/**
 * Design philosophy for private routing: keep protected moments discreet and reassuring, never abrupt or confusing.
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FullScreenLoader } from '@/components/feedback/FullScreenLoader';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return <FullScreenLoader title="Preparando sua experiência" description="Verificando a sessão e conectando seu espaço de reservas." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
EOF
cat > client/src/routes/AppRouter.tsx <<'EOF'
/**
 * Design philosophy for navigation: structure the editorial dining journey with clear entry points, protected paths and generous breathing room.
 */
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { RestaurantDetailsPage } from '@/pages/RestaurantDetailsPage';
import { ReservationCreatePage } from '@/pages/ReservationCreatePage';
import { ReservationsPage } from '@/pages/ReservationsPage';

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return null;
  }

  if (isAuthenticated) {
    const target = (location.state as { from?: string } | null)?.from || '/reservations';
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailsPage />} />
          <Route
            path="/restaurants/:id/reserve"
            element={
              <ProtectedRoute>
                <ReservationCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <ReservationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
EOF
cat > client/src/styles/brand.ts <<'EOF'
/**
 * Design philosophy for style tokens: preserve the contemporary editorial dining mood through warm mineral surfaces, brass accents and restrained drama.
 */
export const brandSurfaces = {
  shell: 'bg-[radial-gradient(circle_at_top_left,_rgba(196,154,108,0.18),_transparent_24%),linear-gradient(180deg,_#fffdf7_0%,_#f6efe3_54%,_#f3eadc_100%)]',
  panel: 'bg-white/78 backdrop-blur-xl',
  darkPanel: 'bg-[#201814]/82 backdrop-blur-xl text-white',
  spotlight: 'bg-[radial-gradient(circle_at_top,_rgba(185,141,92,0.32),_transparent_36%),linear-gradient(135deg,_rgba(255,255,255,0.9),_rgba(255,248,236,0.82))]'
} as const;

export const brandCopy = {
  title: 'ReserveAí',
  subtitle: 'Reservas para experiências gastronômicas com uma linguagem visual mais calorosa, clara e confiável.'
} as const;
EOF
chmod +x /home/ubuntu/reserveai-frontend/create_frontend_core.sh
