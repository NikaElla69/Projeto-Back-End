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
