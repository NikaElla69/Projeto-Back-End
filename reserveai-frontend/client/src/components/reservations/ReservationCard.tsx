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
