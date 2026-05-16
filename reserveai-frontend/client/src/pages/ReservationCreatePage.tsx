/**
 * Design philosophy for reservation creation: guide the user through one decisive form with the minimum friction and clear backend semantics.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { FullScreenLoader } from '@/components/feedback/FullScreenLoader';
import { StatusMessage } from '@/components/feedback/StatusMessage';
import { ReservationForm } from '@/components/forms/ReservationForm';
import { restaurantService } from '@/services/restaurant.service';
import { reservationService } from '@/services/reservation.service';
import { tableService } from '@/services/table.service';
import type { Restaurant, TableEntity } from '@/types/api';
import type { ReservationFormData } from '@/lib/validation';

export function ReservationCreatePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [tables, setTables] = useState<TableEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const restaurantId = Number(id);
  const defaults = useMemo(
    () => ({
      date: searchParams.get('date') || new Date().toISOString().slice(0, 10),
      time: searchParams.get('time') || '19:00',
      guestCount: Number(searchParams.get('guestCount') || 2)
    }),
    [searchParams]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [restaurantData, tableData] = await Promise.all([
          restaurantService.getById(restaurantId),
          tableService.listByRestaurant(restaurantId)
        ]);
        setRestaurant(restaurantData);
        setTables(tableData.filter((table) => table.is_active));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível carregar os dados para a reserva.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!Number.isNaN(restaurantId)) {
      void loadData();
    }
  }, [restaurantId]);

  const handleSubmit = async (data: ReservationFormData) => {
    try {
      setIsSubmitting(true);
      await reservationService.create({
        restaurantId: data.restaurantId,
        tableId: data.tableId,
        reservationDate: data.reservationDate,
        reservationTime: data.reservationTime,
        guestCount: data.guestCount,
        customerNotes: data.customerNotes
      });
      toast.success('Reserva criada com sucesso!');
      navigate('/reservations');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível criar a reserva.';
      toast.error(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <FullScreenLoader
        title="Preparando sua reserva"
        description="Carregando restaurante e mesas disponíveis para preencher o formulário."
      />
    );
  }

  if (error || !restaurant) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-4xl">
          <StatusMessage
            description="Retorne à página anterior e confira a configuração do back-end."
            title={error || 'Restaurante não encontrado'}
            tone="error"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Sidebar */}
        <aside className="glass-dark rounded-[2rem] p-6 shadow-[0_24px_80px_rgba(30,18,10,0.22)] sm:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#f0d1a2]">Criar reserva</p>
          <h1 className="mt-4 font-display text-4xl">Confirme seu lugar em {restaurant.name}</h1>
          <p className="mt-4 text-sm leading-7 text-white/74">
            Este formulário envia um <code className="rounded bg-white/10 px-2 py-1">POST /reservations</code> com restaurante, mesa, data, horário, quantidade de pessoas e observações.
          </p>
          <div className="mt-8 space-y-4 text-sm text-white/74">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/7 p-4">
              <p className="font-semibold text-white">Restaurante</p>
              <p className="mt-2">{restaurant.name}</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/7 p-4">
              <p className="font-semibold text-white">Total de mesas ativas</p>
              <p className="mt-2">{tables.length}</p>
            </div>
            <Link
              className="btn-secondary border-white/15 bg-white/10 text-white hover:bg-white/16"
              to={`/restaurants/${restaurant.id}`}
            >
              Voltar aos detalhes
            </Link>
          </div>
        </aside>

        {/* Form */}
        <div className="glass-panel rounded-[2rem] p-6 shadow-[0_20px_65px_rgba(75,46,25,0.10)] sm:p-8">
          <div className="space-y-3 mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e34]">Formulário conectado</p>
            <h2 className="font-display text-4xl text-[#26170f]">Preencha os dados da reserva</h2>
            <p className="max-w-2xl text-sm leading-7 text-[#6b5647]">
              Depois do envio, a API valida o limite de horário, a capacidade da mesa e a existência de reservas conflitantes para o mesmo slot.
            </p>
          </div>

          <ReservationForm
            restaurantId={restaurantId}
            tables={tables}
            defaultDate={defaults.date}
            defaultTime={defaults.time}
            defaultGuestCount={defaults.guestCount}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </section>
  );
}
