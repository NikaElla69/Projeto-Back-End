/**
 * Utility functions for formatting dates, times, and other data.
 */

/**
 * Format a date string to a readable format
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format a date to ISO format (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a time string to a readable format
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
}

/**
 * Format a datetime string to a readable format
 */
export function formatDateTime(datetime: string): string {
  const date = new Date(datetime);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format a phone number
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Format a reservation status to a readable label
 */
export function formatReservationStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmada',
    rejected: 'Rejeitada',
    cancelled: 'Cancelada',
    completed: 'Concluída'
  };
  return statusMap[status] || status;
}

/**
 * Format a user role to a readable label
 */
export function formatUserRole(role: string): string {
  const roleMap: Record<string, string> = {
    customer: 'Cliente',
    owner: 'Proprietário',
    admin: 'Administrador'
  };
  return roleMap[role] || role;
}

/**
 * Get status color based on reservation status
 */
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
    completed: 'bg-blue-100 text-blue-800'
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}
