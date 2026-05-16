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
import { RestaurantsPage } from '@/pages/RestaurantsPage';
import { ProfilePage } from '@/pages/ProfilePage';

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
          <Route path="/restaurants" element={<RestaurantsPage />} />
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
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
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
