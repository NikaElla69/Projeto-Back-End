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
