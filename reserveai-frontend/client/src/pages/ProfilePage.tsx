/**
 * User profile page for managing account settings and viewing history.
 * Provides a centralized hub for user account management.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { FullScreenLoader } from '@/components/feedback/FullScreenLoader';
import { StatusMessage } from '@/components/feedback/StatusMessage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { userService } from '@/services/user.service';
import { formatDate, formatUserRole } from '@/lib/format';
import { Mail, User, Calendar, Shield, LogOut } from 'lucide-react';
import type { Reservation } from '@/types/api';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [reservationHistory, setReservationHistory] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReservationHistory = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const history = await userService.reservationHistory(user.id);
        setReservationHistory(history);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Não foi possível carregar o histórico.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadReservationHistory();
  }, [user]);

  if (!user) {
    return (
      <FullScreenLoader
        title="Carregando perfil"
        description="Aguarde enquanto carregamos seus dados..."
      />
    );
  }

  if (isLoading) {
    return (
      <FullScreenLoader
        title="Carregando histórico"
        description="Buscando suas reservas anteriores..."
      />
    );
  }

  const handleLogout = () => {
    logout();
    toast.success('Você foi desconectado com sucesso.');
    navigate('/login');
  };

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="mt-2 text-gray-600">Gerencie suas informações de conta e histórico de reservas</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <StatusMessage
              tone="error"
              title="Erro ao carregar histórico"
              description={error}
            />
          </div>
        )}

        {/* Profile Information */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Nome</p>
                <p className="mt-1 text-lg text-gray-900">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </p>
                <p className="mt-1 text-lg text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Tipo de Conta
                </p>
                <p className="mt-1 text-lg text-gray-900">{formatUserRole(user.role)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Membro desde
                </p>
                <p className="mt-1 text-lg text-gray-900">{formatDate(user.created_at)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações da Conta</CardTitle>
              <CardDescription>Gerencie as configurações da sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Editar Perfil
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Alterar Senha
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair da Conta
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Reservation History */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Reservas</CardTitle>
              <CardDescription>
                Todas as suas reservas ({reservationHistory.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reservationHistory.length === 0 ? (
                <p className="text-center text-gray-600 py-8">
                  Você ainda não tem reservas. <a href="/restaurants" className="text-blue-600 hover:underline">Explore restaurantes</a>
                </p>
              ) : (
                <div className="space-y-4">
                  {reservationHistory.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {reservation.restaurant_name || 'Restaurante'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(reservation.reservation_date)} às {reservation.reservation_time}
                        </p>
                      </div>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        reservation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        reservation.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {reservation.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
