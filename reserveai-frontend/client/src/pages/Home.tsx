/**
 * Design philosophy for the home page: present restaurant discovery as an editorial spread with strong hierarchy, warm contrast and clear action.
 */
import { ArrowRight, CalendarCheck2, ShieldCheck, Sparkles, UtensilsCrossed } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FullScreenLoader } from '@/components/feedback/FullScreenLoader';
import { StatusMessage } from '@/components/feedback/StatusMessage';
import { RestaurantCard } from '@/components/restaurants/RestaurantCard';
import { imagery } from '@/lib/assets';
import { restaurantService } from '@/services/restaurant.service';
import type { Restaurant } from '@/types/api';

const highlights = [
  {
    title: 'Exploração clara',
    description: 'A listagem consome a rota pública de restaurantes e organiza as opções com foco em leitura rápida.',
    icon: UtensilsCrossed
  },
  {
    title: 'Reserva guiada',
    description: 'Cada detalhe do restaurante prepara o usuário para consultar disponibilidade e concluir a reserva.',
    icon: CalendarCheck2
  },
  {
    title: 'Sessão protegida',
    description: 'O fluxo autenticado guarda token JWT e protege as páginas privadas do sistema.',
    icon: ShieldCheck
  }
];

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const data = await restaurantService.list();
        setRestaurants(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível carregar os restaurantes.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRestaurants();
  }, []);

  const totalRestaurantsLabel = useMemo(() => `${restaurants.length.toString().padStart(2, '0')} experiências`, [restaurants.length]);

  if (isLoading) {
    return <FullScreenLoader title="Montando a curadoria gastronômica" description="Buscando os restaurantes publicados pela sua API ReserveAí." />;
  }

  return (
    <div className="space-y-16 pb-8 pt-8 sm:space-y-20">
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="hero-shell mx-auto grid max-w-7xl gap-10 overflow-hidden rounded-[2.4rem] border border-white/55 px-6 py-6 shadow-[0_28px_100px_rgba(60,35,18,0.18)] sm:px-8 sm:py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-10">
          <div className="relative z-10 flex flex-col justify-between gap-10 py-3">
            <div className="space-y-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#f0dfc3] bg-white/78 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#8b5e34]">
                <Sparkles className="h-4 w-4" />
                Plataforma de reservas ReserveAí
              </div>
              <div className="space-y-4">
                <h1 className="max-w-2xl font-display text-5xl leading-[0.95] text-[#fff8ef] sm:text-6xl lg:text-7xl" style={{color: '#6d512c'}}>
                  Descubra restaurantes e reserve mesas com uma jornada elegante e funcional.
                </h1>
                <p className="max-w-xl text-base leading-8 text-[#f4ede2] sm:text-lg" style={{color: '#7d6236'}}>
                  Este front-end foi estruturado em React + TypeScript para consumir a API do ReserveAí, exibindo restaurantes, consultando mesas disponíveis e permitindo reservas autenticadas com JWT.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link className="btn-primary bg-[#f7dfb8] text-[#24150e] hover:bg-[#f1d09c]" to="/register">
                Criar conta e reservar
              </Link>
              <Link className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/18" to="/reservations">
                Ver minhas reservas
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm" style={{backgroundColor: '#a35252'}}>
                <p className="text-xs uppercase tracking-[0.25em] text-white/60">Curadoria</p>
                <p className="mt-3 font-display text-3xl">{totalRestaurantsLabel}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm" style={{backgroundColor: '#d69494'}}>
                <p className="text-xs uppercase tracking-[0.25em] text-white/60">Autenticação</p>
                <p className="mt-3 font-display text-3xl">JWT</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm" style={{backgroundColor: '#ffadad'}}>
                <p className="text-xs uppercase tracking-[0.25em] text-white/60">Camadas</p>
                <p className="mt-3 font-display text-3xl">API + UI</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[28rem] overflow-hidden rounded-[2rem] border border-white/15">
            <img alt="Ambiente premium de restaurante" className="h-full w-full object-cover" src={imagery.hero} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,11,8,0.04),rgba(18,11,8,0.56))]" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
              <div className="glass-dark inline-flex max-w-md flex-col gap-3 rounded-[1.6rem] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-[#f0d1a2]">Fluxo de usuário</p>
                <p className="font-display text-2xl">Escolha o restaurante, consulte a disponibilidade e confirme em poucos passos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {highlights.map(({ title, description, icon: Icon }) => (
            <article className="glass-panel rounded-[1.8rem] p-6 shadow-[0_20px_65px_rgba(75,46,25,0.10)]" key={title}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7ecd8] text-[#8b5e34]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 font-display text-2xl text-[#26170f]">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#6b5647]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-[#8b5e34]">Restaurantes</p>
              <h2 className="font-display text-4xl text-[#26170f] sm:text-5xl">Listagem conectada ao back-end</h2>
              <p className="max-w-2xl text-sm leading-7 text-[#6b5647]">
                A página inicial consome a rota pública de restaurantes e transforma os dados em uma vitrine navegável. Cada card abre uma página com detalhes, mesas e consulta de disponibilidade.
              </p>
            </div>
            <Link className="btn-secondary w-fit" to="/register">
              Testar fluxo completo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {error ? (
            <StatusMessage
              description="Verifique se o back-end está rodando e se a variável VITE_API_BASE_URL aponta para a API correta."
              title={error}
              tone="error"
            />
          ) : null}

          <div className="grid gap-6 xl:grid-cols-2">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>

          {!error && restaurants.length === 0 ? (
            <StatusMessage
              description="Cadastre restaurantes no back-end ou insira registros pelo banco para que eles apareçam aqui automaticamente."
              title="Nenhum restaurante disponível no momento"
            />
          ) : null}
        </div>
      </section>
    </div>
  );
}
