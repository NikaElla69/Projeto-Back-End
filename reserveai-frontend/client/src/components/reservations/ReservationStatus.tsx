/**
 * Reservation status badge component.
 * Displays the current status of a reservation with appropriate styling.
 */

import { Badge } from '@/components/ui/badge';
import { formatReservationStatus, getStatusColor } from '@/lib/format';
import type { ReservationStatus } from '@/types/api';

interface ReservationStatusBadgeProps {
  status: ReservationStatus;
}

export function ReservationStatusBadge({ status }: ReservationStatusBadgeProps) {
  const colorClass = getStatusColor(status);

  return (
    <Badge className={colorClass}>
      {formatReservationStatus(status)}
    </Badge>
  );
}
