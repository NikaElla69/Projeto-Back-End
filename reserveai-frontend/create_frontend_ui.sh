#!/usr/bin/env bash
set -euo pipefail
cd /home/ubuntu/reserveai-frontend
mkdir -p client/src/{components/{feedback,forms,layout,reservations,restaurants},lib,pages}
cat > client/src/lib/assets.ts <<'EOF'
/**
 * Design philosophy for assets: use a restrained set of visual anchors so the interface feels curated instead of decorative.
 */
export const imagery = {
  hero: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663156585662/Lri9xTEnLGjbrdtJoqdZ4S/reserveai-hero-editorial_805b2e65.png',
  restaurantCard: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663156585662/Lri9xTEnLGjbrdtJoqdZ4S/reserveai-restaurant-card_64d9f0d0.png',
  tableDetail: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663156585662/Lri9xTEnLGjbrdtJoqdZ4S/reserveai-table-detail_749b70fa.png',
  abstractBrand: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663156585662/Lri9xTEnLGjbrdtJoqdZ4S/reserveai-abstract-brand_0d1b4584.png'
} as const;
EOF
cat > client/src/lib/formatters.ts <<'EOF'
/**
 * Design philosophy for formatting helpers: transform backend precision into human-readable language without visual noise.
 */
export function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long'
  }).format(new Date(`${date}T00:00:00`));
}

export function formatTime(time: string) {
  return time.slice(0, 5);
}

export function formatDateTime(date: string, time: string) {
  return `${formatDate(date)} às ${formatTime(time)}`;
}

export function formatRole(role: string) {
  const labels: Record<string, string> = {
    customer: 'Cliente',
    owner: 'Proprietário',
    admin: 'Administrador'
  };

  return labels[role] || role;
}

export function formatReservationStatus(status: string) {
  const labels: Record<string, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmada',
    rejected: 'Rejeitada',
    cancelled: 'Cancelada',
    completed: 'Concluída'
  };

  return labels[status] || status;
}
EOF
cat > client/src/components/feedback/FullScreenLoader.tsx <<'EOF'
/**
 * Design philosophy for loading states: show motion with composure, using quiet editorial cues instead of loud spinners alone.
 */
import { LoaderCircle } from 'lucide-react';

export function FullScreenLoader({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-20">
      <div className="glass-panel max-w-md space-y-4 p-10 text-center shadow-[0_24px_80px_rgba(72,44,22,0.14)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-white/70 text-[#8b5e34]">
          <LoaderCircle className="h-6 w-6 animate-spin" />
        </div>
        <div className="space-y-2">
          <p className="font-display text-2xl text-[#26170f]">{title}</p>
          <p className="text-sm leading-6 text-[#6b5647]">{description}</p>
        </div>
      </div>
    </div>
  );
}
EOF
cat > client/src/components/feedback/StatusMessage.tsx <<'EOF'
/**
 * Design philosophy for feedback blocks: keep empty, error and helper messages legible, warm and actionable.
 */
import { AlertCircle, Inbox, Sparkles } from 'lucide-react';

interface StatusMessageProps {
  title: string;
  description: string;
  tone?: 'default' | 'error' | 'success';
}

export function StatusMessage({ title, description, tone = 'default' }: StatusMessageProps) {
  const iconMap = {
    default: Inbox,
    error: AlertCircle,
    success: Sparkles
  };

  const Icon = iconMap[tone];
  const toneClass =
    tone === 'error'
      ? 'border-rose-200/80 bg-rose-50/90 text-rose-900'
      : tone === 'success'
        ? 'border-emerald-200/80 bg-emerald-50/90 text-emerald-900'
        : 'border-[#eadcc8] bg-white/85 text-[#372416]';

  return (
    <div className={`glass-panel flex items-start gap-4 p-5 ${toneClass}`}>
      <div className="mt-0.5 rounded-full border border-current/10 bg-white/70 p-2">
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-lg">{title}</h3>
        <p className="text-sm leading-6 opacity-80">{description}</p>
      </div>
    </div>
  );
}
EOF
cat > client/src/components/forms/AuthSplitLayout.tsx <<'EOF'
/**
 * Design philosophy for auth framing: use a magazine-like split composition that feels inviting instead of transactional.
 */
import { Link } from 'react-router-dom';
import { brandCopy } from '@/styles/brand';
import { imagery } from '@/lib/assets';

interface AuthSplitLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  alternateLabel: string;
  alternateHref: string;
  alternateAction: string;
  children: React.ReactNode;
}

export function AuthSplitLayout({
  eyebrow,
  title,
  description,
  alternateLabel,
  alternateHref,
  alternateAction,
  children
}: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-[calc(100vh-10rem)] gap-6 lg:grid-cols-[1.15fr_0.95fr]">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-[#2a1b14] px-8 py-10 text-white shadow-[0_28px_90px_rgba(35,18,10,0.34)] sm:px-10 lg:px-14 lg:py-14">
        <img
          src={imagery.abstractBrand}
          alt="Textura artística do ReserveAí"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(17,12,9,0.62),rgba(79,50,29,0.34))]" />
        <div className="relative z-10 flex h-full flex-col justify-between gap-10">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#f0d1a2]">{brandCopy.title}</p>
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">{eyebrow}</p>
              <h1 className="max-w-xl font-display text-4xl leading-tight sm:text-5xl">{title}</h1>
              <p className="max-w-lg text-base leading-7 text-white/78">{description}</p>
            </div>
          </div>
          <div className="grid gap-4 rounded-[1.6rem] border border-white/15 bg-white/8 p-5 backdrop-blur-md sm:grid-cols-3">
            <div>
              <p className="text-sm text-white/60">Fluxo orientado</p>
              <p className="mt-2 font-display text-2xl">API integrada</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Autenticação</p>
              <p className="mt-2 font-display text-2xl">JWT</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Experiência</p>
              <p className="mt-2 font-display text-2xl">Responsiva</p>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel flex items-center rounded-[2rem] px-6 py-10 shadow-[0_28px_80px_rgba(72,44,22,0.12)] sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-lg space-y-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b5e34]">{eyebrow}</p>
            <h2 className="font-display text-3xl text-[#26170f] sm:text-4xl">{title}</h2>
            <p className="text-sm leading-7 text-[#6b5647]">{description}</p>
          </div>

          {children}

          <p className="text-sm text-[#6b5647]">
            {alternateLabel}{' '}
            <Link className="font-semibold text-[#8b5e34] transition hover:text-[#59361a]" to={alternateHref}>
              {alternateAction}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
EOF
cat > client/src/components/layout/SiteHeader.tsx <<'EOF'
/**
 * Design philosophy for the header: pair editorial refinement with clear wayfinding, keeping the main actions always within reach.
 */
import { Menu, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const navLinkBase = 'text-sm font-medium tracking-[0.08em] text-[#5d4738] transition hover:text-[#1f140d]';

export function SiteHeader() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/55 bg-white/72 px-5 py-3 shadow-[0_18px_50px_rgba(66,42,25,0.08)] backdrop-blur-xl">
        <Link className="flex items-center gap-3 text-[#20140d]" to="/">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#23150f] font-display text-lg text-[#f4d4a4]">R</div>
          <div>
            <p className="font-display text-xl leading-none">ReserveAí</p>
            <p className="text-xs uppercase tracking-[0.32em] text-[#8b5e34]">Dining editorial</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <NavLink className={navLinkBase} to="/">Início</NavLink>
          <NavLink className={navLinkBase} to="/reservations">Minhas reservas</NavLink>
          {isAuthenticated ? null : <NavLink className={navLinkBase} to="/register">Cadastro</NavLink>}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 rounded-full border border-[#ead9c0] bg-[#f8f0e1] px-4 py-2 text-sm text-[#3b2517]">
                <UserRound className="h-4 w-4" />
                <span>{user?.name}</span>
              </div>
              <button className="btn-secondary" onClick={logout} type="button">Sair</button>
            </>
          ) : (
            <>
              <Link className="btn-secondary" to="/login">Entrar</Link>
              <Link className="btn-primary" to="/register">Criar conta</Link>
            </>
          )}
        </div>

        <button
          aria-label="Abrir menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#ead9c0] bg-[#f8f0e1] text-[#2b1b13] lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {isOpen ? (
        <div className="mx-auto mt-3 max-w-7xl rounded-[1.5rem] border border-white/55 bg-white/88 p-4 shadow-[0_18px_50px_rgba(66,42,25,0.08)] backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-3">
            <NavLink className={navLinkBase} onClick={() => setIsOpen(false)} to="/">Início</NavLink>
            <NavLink className={navLinkBase} onClick={() => setIsOpen(false)} to="/reservations">Minhas reservas</NavLink>
            {!isAuthenticated && (
              <NavLink className={navLinkBase} onClick={() => setIsOpen(false)} to="/register">Cadastro</NavLink>
            )}
            <div className="mt-2 flex flex-col gap-3">
              {isAuthenticated ? (
                <button className="btn-secondary justify-center" onClick={logout} type="button">Sair</button>
              ) : (
                <>
                  <Link className="btn-secondary justify-center" onClick={() => setIsOpen(false)} to="/login">Entrar</Link>
                  <Link className="btn-primary justify-center" onClick={() => setIsOpen(false)} to="/register">Criar conta</Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
EOF
cat > client/src/components/layout/SiteFooter.tsx <<'EOF'
/**
 * Design philosophy for the footer: close the experience with warmth, guidance and practical reminders for backend integration.
 */
export function SiteFooter() {
  return (
    <footer className="px-4 pb-8 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 rounded-[2rem] border border-[#e9dccb] bg-[#20140e] px-6 py-8 text-white shadow-[0_24px_80px_rgba(30,18,10,0.22)] sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-[#f0d1a2]">ReserveAí Front-end</p>
          <h2 className="font-display text-3xl">Uma camada visual pensada para dialogar com a API do seu projeto.</h2>
          <p className="max-w-2xl text-sm leading-7 text-white/72">
            Configure <code className="rounded bg-white/10 px-2 py-1">VITE_API_BASE_URL</code> para apontar para o back-end em execução.
            Quando a API estiver ativa, o fluxo de autenticação, listagem de restaurantes, consulta de mesas e reservas passa a funcionar integralmente.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-white/72">
          <div className="rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
            <p className="font-semibold text-white">Portas recomendadas</p>
            <p className="mt-2">Front-end: 5173 via Vite</p>
            <p>Back-end: 3000 com prefixo <code>/api</code></p>
          </div>
          <div className="rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
            <p className="font-semibold text-white">Teste sugerido</p>
            <p className="mt-2">Cadastre um usuário, faça login, escolha um restaurante, consulte disponibilidade e conclua uma reserva.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
EOF
cat > client/src/components/layout/AppShell.tsx <<'EOF'
/**
 * Design philosophy for the shell: maintain a consistent editorial frame so every page feels part of the same crafted dining narrative.
 */
import { Outlet } from 'react-router-dom';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { brandSurfaces } from '@/styles/brand';

export function AppShell() {
  return (
    <div className={`min-h-screen ${brandSurfaces.shell} text-[#26170f]`}>
      <div className="grain-overlay pointer-events-none fixed inset-0 opacity-50" />
      <SiteHeader />
      <main className="relative z-10">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
EOF
cat > client/src/components/restaurants/RestaurantCard.tsx <<'EOF'
/**
 * Design philosophy for restaurant cards: combine appetite, data and action in a balanced composition that reads like a premium listing.
 */
import { ArrowRight, Clock3, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { imagery } from '@/lib/assets';
import type { Restaurant } from '@/types/api';

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <article className="group overflow-hidden rounded-[1.85rem] border border-white/55 bg-white/82 shadow-[0_20px_65px_rgba(75,46,25,0.10)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(75,46,25,0.14)]">
      <div className="relative h-60 overflow-hidden">
        <img
          alt={restaurant.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          src={restaurant.logo_url || imagery.restaurantCard}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,14,10,0.08),rgba(21,14,10,0.72))]" />
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 px-6 pb-6 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-white/72">{restaurant.cuisine_type || 'Culinária autoral'}</p>
            <h3 className="mt-2 font-display text-3xl">{restaurant.name}</h3>
          </div>
          <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] backdrop-blur-sm">
            {restaurant.city || 'Local especial'}
          </div>
        </div>
      </div>

      <div className="space-y-5 px-6 py-6">
        <p className="line-clamp-3 min-h-[4.75rem] text-sm leading-7 text-[#675341]">
          {restaurant.description || 'Ambiente elegante, mesas preparadas com cuidado e um fluxo simples para reservar com tranquilidade.'}
        </p>

        <div className="grid gap-3 text-sm text-[#4b382a] sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl bg-[#f8f0e2] px-4 py-3">
            <MapPin className="h-4 w-4 text-[#8b5e34]" />
            <span className="truncate">{restaurant.address || restaurant.city || 'Endereço sob consulta'}</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-[#f8f0e2] px-4 py-3">
            <Phone className="h-4 w-4 text-[#8b5e34]" />
            <span>{restaurant.phone || 'Contato no estabelecimento'}</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-[#f8f0e2] px-4 py-3 sm:col-span-2">
            <Clock3 className="h-4 w-4 text-[#8b5e34]" />
            <span>
              Limite recomendado para reserva: {restaurant.reservation_limit_time ? restaurant.reservation_limit_time.slice(0, 5) : 'consulte o restaurante'}
            </span>
          </div>
        </div>

        <Link className="btn-primary inline-flex w-full items-center justify-center gap-2" to={`/restaurants/${restaurant.id}`}>
          Ver detalhes e reservar
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
EOF
cat > client/src/components/restaurants/AvailabilityPanel.tsx <<'EOF'
/**
 * Design philosophy for availability search: make operational data approachable, so the diner sees options rather than database mechanics.
 */
import { CalendarRange, Clock3, UsersRound } from 'lucide-react';
import type { RestaurantAvailabilityResponse } from '@/types/api';

interface AvailabilityPanelProps {
  isLoading: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  result: RestaurantAvailabilityResponse | null;
  error: string | null;
  defaultValues: {
    date: string;
    time: string;
    guestCount: number;
  };
}

export function AvailabilityPanel({ isLoading, onSubmit, result, error, defaultValues }: AvailabilityPanelProps) {
  return (
    <section className="glass-panel space-y-6 rounded-[1.9rem] p-6 shadow-[0_20px_65px_rgba(75,46,25,0.10)] sm:p-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e34]">Disponibilidade</p>
        <h3 className="font-display text-3xl text-[#26170f]">Descubra as melhores mesas para o horário desejado</h3>
        <p className="max-w-2xl text-sm leading-7 text-[#6b5647]">
          Essa consulta usa a rota de disponibilidade do back-end para listar apenas as mesas compatíveis com a data, hora e quantidade de pessoas informadas.
        </p>
      </div>

      <form className="grid gap-4 md:grid-cols-[1fr_1fr_0.8fr_auto] md:items-end" onSubmit={onSubmit}>
        <label className="space-y-2 text-sm text-[#4b382a]">
          Data
          <div className="input-shell">
            <CalendarRange className="h-4 w-4 text-[#8b5e34]" />
            <input className="field-input" defaultValue={defaultValues.date} name="date" required type="date" />
          </div>
        </label>
        <label className="space-y-2 text-sm text-[#4b382a]">
          Horário
          <div className="input-shell">
            <Clock3 className="h-4 w-4 text-[#8b5e34]" />
            <input className="field-input" defaultValue={defaultValues.time} name="time" required type="time" />
          </div>
        </label>
        <label className="space-y-2 text-sm text-[#4b382a]">
          Pessoas
          <div className="input-shell">
            <UsersRound className="h-4 w-4 text-[#8b5e34]" />
            <input className="field-input" defaultValue={defaultValues.guestCount} max={20} min={1} name="guestCount" required type="number" />
          </div>
        </label>
        <button className="btn-primary h-12 justify-center" disabled={isLoading} type="submit">
          {isLoading ? 'Consultando...' : 'Consultar'}
        </button>
      </form>

      {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p> : null}

      {result ? (
        <div className="space-y-4 rounded-[1.5rem] border border-[#e8dac7] bg-[#f8f1e6] p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e34]">Resultado</p>
              <p className="font-display text-2xl text-[#26170f]">{result.availableTables.length} mesas compatíveis encontradas</p>
            </div>
            <p className="text-sm text-[#6b5647]">
              {result.date} às {result.time.slice(0, 5)} para {result.guestCount} pessoa(s)
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {result.availableTables.map((table) => (
              <div className="rounded-[1.4rem] border border-white/70 bg-white/80 p-4" key={table.id}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.26em] text-[#8b5e34]">Mesa {table.table_number}</p>
                    <p className="mt-2 font-display text-2xl text-[#26170f]">Capacidade {table.capacity}</p>
                  </div>
                  <span className="rounded-full bg-[#f8f0e2] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#5a371c]">
                    {table.location || 'Salão principal'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
EOF
cat > client/src/components/reservations/ReservationCard.tsx <<'EOF'
/**
 * Design philosophy for reservation cards: present each booking like a concise itinerary, blending hospitality cues with backend state.
 */
import { Clock3, CookingPot, MapPin, Trash2, UsersRound } from 'lucide-react';
import { formatDateTime, formatReservationStatus } from '@/lib/formatters';
import type { Reservation } from '@/types/api';

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-900 border-amber-200',
  confirmed: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  rejected: 'bg-rose-100 text-rose-900 border-rose-200',
  cancelled: 'bg-slate-200 text-slate-800 border-slate-300',
  completed: 'bg-[#ead8be] text-[#4a311c] border-[#dec39f]'
};

interface ReservationCardProps {
  reservation: Reservation;
  onCancel: (reservationId: number) => void;
  isCancelling: boolean;
}

export function ReservationCard({ reservation, onCancel, isCancelling }: ReservationCardProps) {
  const canCancel = reservation.status === 'pending' || reservation.status === 'confirmed';

  return (
    <article className="glass-panel overflow-hidden rounded-[1.8rem] p-6 shadow-[0_20px_65px_rgba(75,46,25,0.10)]">
      <div className="flex flex-col gap-4 border-b border-[#eadcca] pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e34]">Reserva #{reservation.id}</p>
          <h3 className="font-display text-3xl text-[#26170f]">{reservation.restaurant_name || 'Restaurante reservado'}</h3>
          <p className="text-sm leading-7 text-[#6b5647]">{formatDateTime(reservation.reservation_date, reservation.reservation_time)}</p>
        </div>
        <span className={`inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] ${statusStyles[reservation.status] || statusStyles.pending}`}>
          {formatReservationStatus(reservation.status)}
        </span>
      </div>

      <div className="grid gap-4 py-5 text-sm text-[#4b382a] md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-[#f8f0e2] px-4 py-3">
          <div className="flex items-center gap-2 text-[#8b5e34]">
            <CookingPot className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.22em]">Mesa</span>
          </div>
          <p className="mt-2 font-medium">{reservation.table_number || reservation.table_id}</p>
        </div>
        <div className="rounded-2xl bg-[#f8f0e2] px-4 py-3">
          <div className="flex items-center gap-2 text-[#8b5e34]">
            <UsersRound className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.22em]">Pessoas</span>
          </div>
          <p className="mt-2 font-medium">{reservation.guest_count} convidado(s)</p>
        </div>
        <div className="rounded-2xl bg-[#f8f0e2] px-4 py-3">
          <div className="flex items-center gap-2 text-[#8b5e34]">
            <Clock3 className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.22em]">Status técnico</span>
          </div>
          <p className="mt-2 font-medium">{reservation.status}</p>
        </div>
        <div className="rounded-2xl bg-[#f8f0e2] px-4 py-3">
          <div className="flex items-center gap-2 text-[#8b5e34]">
            <MapPin className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.22em]">Observações</span>
          </div>
          <p className="mt-2 line-clamp-2 font-medium">{reservation.customer_notes || reservation.rejection_reason || 'Sem observações registradas.'}</p>
        </div>
      </div>

      {canCancel ? (
        <button className="btn-secondary inline-flex items-center gap-2 text-rose-900" disabled={isCancelling} onClick={() => onCancel(reservation.id)} type="button">
          <Trash2 className="h-4 w-4" />
          {isCancelling ? 'Cancelando...' : 'Cancelar reserva'}
        </button>
      ) : null}
    </article>
  );
}
EOF
cat > client/src/pages/Home.tsx <<'EOF'
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
                <h1 className="max-w-2xl font-display text-5xl leading-[0.95] text-[#fff8ef] sm:text-6xl lg:text-7xl">
                  Descubra restaurantes e reserve mesas com uma jornada elegante e funcional.
                </h1>
                <p className="max-w-xl text-base leading-8 text-[#f4ede2] sm:text-lg">
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
              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-white/60">Curadoria</p>
                <p className="mt-3 font-display text-3xl">{totalRestaurantsLabel}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-white/60">Autenticação</p>
                <p className="mt-3 font-display text-3xl">JWT</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm">
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
EOF
cat > client/src/pages/LoginPage.tsx <<'EOF'
/**
 * Design philosophy for login: turn authentication into a calm, guided checkpoint with clarity about API integration.
 */
import { LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthSplitLayout } from '@/components/forms/AuthSplitLayout';
import { useAuth } from '@/contexts/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setIsSubmitting(true);
      await login({
        email: String(formData.get('email')),
        password: String(formData.get('password'))
      });
      toast.success('Login realizado com sucesso.');
      navigate('/reservations');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível realizar o login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <AuthSplitLayout
          alternateAction="Criar conta"
          alternateHref="/register"
          alternateLabel="Ainda não possui acesso?"
          description="Entre com as mesmas credenciais cadastradas na API do ReserveAí. O token JWT retornado será salvo localmente para proteger as rotas privadas do sistema."
          eyebrow="Autenticação"
          title="Faça login para gerenciar suas reservas"
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="space-y-2 text-sm text-[#4b382a]">
              E-mail
              <div className="input-shell">
                <Mail className="h-4 w-4 text-[#8b5e34]" />
                <input className="field-input" name="email" placeholder="voce@email.com" required type="email" />
              </div>
            </label>
            <label className="space-y-2 text-sm text-[#4b382a]">
              Senha
              <div className="input-shell">
                <LockKeyhole className="h-4 w-4 text-[#8b5e34]" />
                <input className="field-input" minLength={6} name="password" placeholder="••••••••" required type="password" />
              </div>
            </label>
            <button className="btn-primary w-full justify-center" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Validando credenciais...' : 'Entrar no ReserveAí'}
            </button>
          </form>
        </AuthSplitLayout>
      </div>
    </section>
  );
}
EOF
cat > client/src/pages/RegisterPage.tsx <<'EOF'
/**
 * Design philosophy for registration: welcome new diners with clarity, making each field feel intentional and beginner-friendly.
 */
import { LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthSplitLayout } from '@/components/forms/AuthSplitLayout';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types/api';

export function RegisterPage() {
  const { register } = useAuth();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setIsSubmitting(true);
      await register({
        name: String(formData.get('name')),
        email: String(formData.get('email')),
        password: String(formData.get('password')),
        role: String(formData.get('role')) as UserRole
      });
      toast.success('Conta criada com sucesso.');
      navigate('/reservations');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível concluir o cadastro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <AuthSplitLayout
          alternateAction="Fazer login"
          alternateHref="/login"
          alternateLabel="Já possui conta?"
          description="O cadastro utiliza a rota de autenticação do back-end. Após a criação, o token JWT já deixa o usuário autenticado para listar e criar reservas."
          eyebrow="Cadastro"
          title="Abra sua porta de entrada para reservar mesas com rapidez"
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="space-y-2 text-sm text-[#4b382a]">
              Nome completo
              <div className="input-shell">
                <UserRound className="h-4 w-4 text-[#8b5e34]" />
                <input className="field-input" name="name" placeholder="Seu nome" required type="text" />
              </div>
            </label>
            <label className="space-y-2 text-sm text-[#4b382a]">
              E-mail
              <div className="input-shell">
                <Mail className="h-4 w-4 text-[#8b5e34]" />
                <input className="field-input" name="email" placeholder="voce@email.com" required type="email" />
              </div>
            </label>
            <label className="space-y-2 text-sm text-[#4b382a]">
              Perfil
              <div className="input-shell">
                <select className="field-input" defaultValue="customer" name="role" required>
                  <option value="customer">Customer</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </label>
            <label className="space-y-2 text-sm text-[#4b382a]">
              Senha
              <div className="input-shell">
                <LockKeyhole className="h-4 w-4 text-[#8b5e34]" />
                <input className="field-input" minLength={6} name="password" placeholder="Mínimo de 6 caracteres" required type="password" />
              </div>
            </label>
            <button className="btn-primary w-full justify-center" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        </AuthSplitLayout>
      </div>
    </section>
  );
}
EOF
cat > client/src/pages/RestaurantDetailsPage.tsx <<'EOF'
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
EOF
cat > client/src/pages/ReservationCreatePage.tsx <<'EOF'
/**
 * Design philosophy for reservation creation: guide the user through one decisive form with the minimum friction and clear backend semantics.
 */
import { Calendar, Clock3, MessageSquareText, UsersRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { FullScreenLoader } from '@/components/feedback/FullScreenLoader';
import { StatusMessage } from '@/components/feedback/StatusMessage';
import { restaurantService } from '@/services/restaurant.service';
import { reservationService } from '@/services/reservation.service';
import { tableService } from '@/services/table.service';
import type { Restaurant, TableEntity } from '@/types/api';

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
      guestCount: Number(searchParams.get('guestCount') || 2),
      tableId: Number(searchParams.get('tableId') || 0)
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setIsSubmitting(true);
      await reservationService.create({
        restaurantId,
        tableId: Number(formData.get('tableId')),
        reservationDate: String(formData.get('reservationDate')),
        reservationTime: `${String(formData.get('reservationTime'))}:00`,
        guestCount: Number(formData.get('guestCount')),
        customerNotes: String(formData.get('customerNotes') || '')
      });
      toast.success('Reserva criada com sucesso.');
      navigate('/reservations');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível criar a reserva.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <FullScreenLoader title="Preparando sua reserva" description="Carregando restaurante e mesas disponíveis para preencher o formulário." />;
  }

  if (error || !restaurant) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-4xl">
          <StatusMessage description="Retorne à página anterior e confira a configuração do back-end." title={error || 'Restaurante não encontrado'} tone="error" />
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
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
            <Link className="btn-secondary border-white/15 bg-white/10 text-white hover:bg-white/16" to={`/restaurants/${restaurant.id}`}>
              Voltar aos detalhes
            </Link>
          </div>
        </aside>

        <form className="glass-panel rounded-[2rem] p-6 shadow-[0_20px_65px_rgba(75,46,25,0.10)] sm:p-8" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e34]">Formulário conectado</p>
            <h2 className="font-display text-4xl text-[#26170f]">Preencha os dados da reserva</h2>
            <p className="max-w-2xl text-sm leading-7 text-[#6b5647]">
              Depois do envio, a API valida o limite de horário, a capacidade da mesa e a existência de reservas conflitantes para o mesmo slot.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm text-[#4b382a] md:col-span-2">
              Mesa
              <div className="input-shell">
                <select className="field-input" defaultValue={defaults.tableId || ''} name="tableId" required>
                  <option value="" disabled>Selecione uma mesa</option>
                  {tables.map((table) => (
                    <option key={table.id} value={table.id}>
                      Mesa {table.table_number} · capacidade {table.capacity} · {table.location || 'salão'}
                    </option>
                  ))}
                </select>
              </div>
            </label>
            <label className="space-y-2 text-sm text-[#4b382a]">
              Data
              <div className="input-shell">
                <Calendar className="h-4 w-4 text-[#8b5e34]" />
                <input className="field-input" defaultValue={defaults.date} min={new Date().toISOString().slice(0, 10)} name="reservationDate" required type="date" />
              </div>
            </label>
            <label className="space-y-2 text-sm text-[#4b382a]">
              Horário
              <div className="input-shell">
                <Clock3 className="h-4 w-4 text-[#8b5e34]" />
                <input className="field-input" defaultValue={defaults.time} name="reservationTime" required type="time" />
              </div>
            </label>
            <label className="space-y-2 text-sm text-[#4b382a]">
              Quantidade de pessoas
              <div className="input-shell">
                <UsersRound className="h-4 w-4 text-[#8b5e34]" />
                <input className="field-input" defaultValue={defaults.guestCount} max={20} min={1} name="guestCount" required type="number" />
              </div>
            </label>
            <label className="space-y-2 text-sm text-[#4b382a] md:col-span-2">
              Observações
              <div className="textarea-shell">
                <MessageSquareText className="mt-1 h-4 w-4 text-[#8b5e34]" />
                <textarea className="field-input min-h-28 resize-none" name="customerNotes" placeholder="Ex.: comemoração, acessibilidade, preferência por área interna." />
              </div>
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="btn-primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Criando reserva...' : 'Confirmar reserva'}
            </button>
            <Link className="btn-secondary" to="/reservations">Ir para minhas reservas</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
EOF
cat > client/src/pages/ReservationsPage.tsx <<'EOF'
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
EOF
cat > client/src/pages/NotFound.tsx <<'EOF'
/**
 * Design philosophy for not-found states: even wrong turns should feel intentional, with a graceful route back into the experience.
 */
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="glass-panel mx-auto max-w-3xl rounded-[2rem] p-8 text-center shadow-[0_20px_65px_rgba(75,46,25,0.10)] sm:p-12">
        <p className="text-xs uppercase tracking-[0.35em] text-[#8b5e34]">404</p>
        <h1 className="mt-4 font-display text-5xl text-[#26170f]">Esta página saiu do roteiro.</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6b5647]">
          Volte para a vitrine principal para continuar explorando restaurantes, entrar com sua conta ou revisar suas reservas.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="btn-primary" to="/">Ir para o início</Link>
          <Link className="btn-secondary" to="/reservations">Ver minhas reservas</Link>
        </div>
      </div>
    </section>
  );
}
EOF
