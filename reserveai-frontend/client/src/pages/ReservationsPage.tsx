/**
 * Design philosophy for reservation history: show personal bookings as a confident, readable control panel rather than a technical list.
 */
import { RefreshCcw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { StatusMessage } from '@/components/feedback/StatusMessage';
import { ReservationCard } from '@/components/reservations/ReservationCard';
import { useAuth } from '@/contexts/AuthContext';
import { formatRole } from '@/lib/formatters';
import { reservationService } from '@/services/reservation.service';
import { userService } from '@/services/user.service';
import type { Reservation } from '@/types/api';

export function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [historyCount, setHistoryCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadReservations = useCallback(async () => {
    try {
      setError(null);
      const active = await reservationService.list();
      setReservations(active);

      if (user?.id) {
        const history = await userService.reservationHistory(user.id);
        setHistoryCount(history.length);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar suas reservas.');
    }
  }, [user?.id]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setIsLoading(true);
        await loadReservations();
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, [loadReservations]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await loadReservations();
      toast.success('Reservas atualizadas.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCancel = async (reservationId: number) => {
    try {
      setCancelId(reservationId);
      await reservationService.updateStatus(reservationId, { status: 'cancelled' });
      toast.success('Reserva cancelada com sucesso.');
      await loadReservations();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível cancelar a reserva.');
    } finally {
      setCancelId(null);
    }
  };

  const summary = useMemo(
    () => ({
      active: reservations.length,
      confirmed: reservations.filter((reservation) => reservation.status === 'confirmed').length,
      pending: reservations.filter((reservation) => reservation.status === 'pending').length
    }),
    [reservations]
  );

  if (isLoading) {
    return null;
  }

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-dark rounded-[2rem] p-6 shadow-[0_24px_80px_rgba(30,18,10,0.22)] sm:p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#f0d1a2]">Painel do usuário</p>
            <h1 className="mt-4 font-display text-5xl">Olá, {user?.name?.split(' ')[0] || 'usuário'}.</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/74">
              Esta área consome rotas autenticadas para listar reservas atuais, consultar histórico pelo endpoint de usuários e permitir o cancelamento via atualização de status.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/56">Ativas</p>
                <p className="mt-3 font-display text-3xl">{summary.active}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/56">Confirmadas</p>
                <p className="mt-3 font-display text-3xl">{summary.confirmed}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/56">Pendentes</p>
                <p className="mt-3 font-display text-3xl">{summary.pending}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6 shadow-[0_20px_65px_rgba(75,46,25,0.10)] sm:p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e34]">Sessão atual</p>
            <h2 className="mt-4 font-display text-4xl text-[#26170f]">Resumo do perfil autenticado</h2>
            <dl className="mt-6 grid gap-4 text-sm text-[#4b382a]">
              <div className="rounded-[1.4rem] bg-[#f8f0e2] p-4">
                <dt className="text-xs uppercase tracking-[0.22em] text-[#8b5e34]">E-mail</dt>
                <dd className="mt-2 font-medium">{user?.email}</dd>
              </div>
              <div className="rounded-[1.4rem] bg-[#f8f0e2] p-4">
                <dt className="text-xs uppercase tracking-[0.22em] text-[#8b5e34]">Perfil</dt>
                <dd className="mt-2 font-medium">{formatRole(user?.role || 'customer')}</dd>
              </div>
              <div className="rounded-[1.4rem] bg-[#f8f0e2] p-4">
                <dt className="text-xs uppercase tracking-[0.22em] text-[#8b5e34]">Histórico total</dt>
                <dd className="mt-2 font-medium">{historyCount ?? 'Não carregado'}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button className="btn-secondary" disabled={isRefreshing} onClick={handleRefresh} type="button">
                <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
              <Link className="btn-primary" to="/">Explorar restaurantes</Link>
            </div>
          </div>
        </div>

        {error ? <StatusMessage description="Confirme o token JWT, a rota da API e o funcionamento do back-end." title={error} tone="error" /> : null}

        {!error && reservations.length === 0 ? (
          <StatusMessage
            description="Depois de criar uma reserva, ela aparecerá aqui com status e dados do restaurante."
            title="Você ainda não possui reservas ativas"
          />
        ) : null}

        <div className="grid gap-5">
          {reservations.map((reservation) => (
            <ReservationCard
              isCancelling={cancelId === reservation.id}
              key={reservation.id}
              onCancel={handleCancel}
              reservation={reservation}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
