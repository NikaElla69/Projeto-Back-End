/**
 * Design philosophy for restaurant details: merge storytelling and operational clarity so diners can move naturally from interest to booking.
 */
import { ArrowRight, CalendarClock, Phone, UsersRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { FullScreenLoader } from '@/components/feedback/FullScreenLoader';
import { StatusMessage } from '@/components/feedback/StatusMessage';
import { AvailabilityPanel } from '@/components/restaurants/AvailabilityPanel';
import { imagery } from '@/lib/assets';
import { restaurantService } from '@/services/restaurant.service';
import { tableService } from '@/services/table.service';
import type { Restaurant, RestaurantAvailabilityResponse, TableEntity } from '@/types/api';

export function RestaurantDetailsPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [tables, setTables] = useState<TableEntity[]>([]);
  const [availability, setAvailability] = useState<RestaurantAvailabilityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const restaurantId = Number(params.id);
  const defaults = useMemo(
    () => ({
      date: searchParams.get('date') || new Date().toISOString().slice(0, 10),
      time: searchParams.get('time') || '19:00',
      guestCount: Number(searchParams.get('guestCount') || 2)
    }),
    [searchParams]
  );

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        setIsLoading(true);
        const [restaurantData, tableData] = await Promise.all([
          restaurantService.getById(restaurantId),
          tableService.listByRestaurant(restaurantId)
        ]);
        setRestaurant(restaurantData);
        setTables(tableData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível carregar o restaurante.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!Number.isNaN(restaurantId)) {
      void loadRestaurant();
    }
  }, [restaurantId]);

  const handleAvailability = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setIsCheckingAvailability(true);
      const result = await restaurantService.getAvailability(restaurantId, {
        date: String(formData.get('date')),
        time: `${String(formData.get('time'))}:00`,
        guestCount: Number(formData.get('guestCount'))
      });
      setAvailability(result);
      toast.success('Disponibilidade consultada com sucesso.');
    } catch (err) {
      setAvailability(null);
      toast.error(err instanceof Error ? err.message : 'Não foi possível consultar a disponibilidade.');
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  if (isLoading) {
    return <FullScreenLoader title="Preparando o restaurante" description="Buscando detalhes, mesas cadastradas e dados de disponibilidade." />;
  }

  if (error || !restaurant) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-4xl">
          <StatusMessage
            description="Confira a URL, a execução do back-end e a variável de ambiente da API."
            title={error || 'Restaurante não encontrado'}
            tone="error"
          />
        </div>
      </section>
    );
  }

  const reserveLink = availability?.availableTables[0]
    ? `/restaurants/${restaurant.id}/reserve?tableId=${availability.availableTables[0].id}&date=${availability.date}&time=${availability.time.slice(0, 5)}&guestCount=${availability.guestCount}`
    : `/restaurants/${restaurant.id}/reserve`;

  return (
    <div className="space-y-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative overflow-hidden rounded-[2.3rem] border border-white/55 min-h-[32rem]">
          <img alt={restaurant.name} className="h-full w-full object-cover" src={restaurant.logo_url || imagery.tableDetail} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,10,8,0.08),rgba(15,10,8,0.78))]" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8 lg:p-10">
            <p className="text-xs uppercase tracking-[0.32em] text-[#f0d1a2]">{restaurant.cuisine_type || 'Gastronomia'}</p>
            <h1 className="mt-3 max-w-2xl font-display text-5xl leading-tight sm:text-6xl">{restaurant.name}</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/78">
              {restaurant.description || 'Detalhes do restaurante conectados à API do ReserveAí, com foco em consulta de mesas e criação de reservas.'}
            </p>
          </div>
        </div>

        <div className="glass-panel flex flex-col justify-between rounded-[2.3rem] p-6 shadow-[0_20px_65px_rgba(75,46,25,0.10)] sm:p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.32em] text-[#8b5e34]">Sobre o espaço</p>
              <h2 className="font-display text-3xl text-[#26170f]">Informações operacionais para reservar com segurança</h2>
            </div>
            <div className="grid gap-4 text-sm text-[#4b382a]">
              <div className="rounded-[1.4rem] bg-[#f8f0e2] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#8b5e34]">Endereço</p>
                <p className="mt-2 leading-7">{restaurant.address || 'Endereço não informado'} {restaurant.city ? `· ${restaurant.city}` : ''}</p>
              </div>
              <div className="rounded-[1.4rem] bg-[#f8f0e2] p-4">
                <div className="flex items-center gap-2 text-[#8b5e34]">
                  <Phone className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-[0.22em]">Contato</span>
                </div>
                <p className="mt-2">{restaurant.phone || 'Telefone não informado'}</p>
              </div>
              <div className="rounded-[1.4rem] bg-[#f8f0e2] p-4">
                <div className="flex items-center gap-2 text-[#8b5e34]">
                  <CalendarClock className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-[0.22em]">Limite de reserva</span>
                </div>
                <p className="mt-2">{restaurant.reservation_limit_time ? `Até ${restaurant.reservation_limit_time.slice(0, 5)}` : 'Configuração não informada'}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary" to={reserveLink}>
              Criar reserva agora
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link className="btn-secondary" to="/reservations">Ver minhas reservas</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl">
        <AvailabilityPanel defaultValues={defaults} error={null} isLoading={isCheckingAvailability} onSubmit={handleAvailability} result={availability} />
      </section>

      <section className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.32em] text-[#8b5e34]">Mesas cadastradas</p>
          <h2 className="font-display text-4xl text-[#26170f]">Listagem vinda da rota de mesas</h2>
          <p className="max-w-2xl text-sm leading-7 text-[#6b5647]">
            As mesas abaixo são carregadas a partir do endpoint específico do restaurante. Elas ajudam o usuário a entender capacidade, localização e status antes de finalizar a reserva.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tables.map((table) => (
            <article className="glass-panel rounded-[1.7rem] p-5 shadow-[0_20px_65px_rgba(75,46,25,0.10)]" key={table.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#8b5e34]">Mesa {table.table_number}</p>
                  <h3 className="mt-2 font-display text-3xl text-[#26170f]">{table.capacity} lugares</h3>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${table.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                  {table.is_active ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-[#6b5647]">
                <UsersRound className="h-4 w-4 text-[#8b5e34]" />
                {table.location || 'Localização não informada'}
              </p>
              <Link className="btn-secondary mt-5" to={`/restaurants/${restaurant.id}/reserve?tableId=${table.id}`}>
                Reservar esta mesa
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
