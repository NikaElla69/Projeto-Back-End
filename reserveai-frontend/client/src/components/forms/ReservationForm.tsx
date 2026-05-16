/**
 * Reservation form component using React Hook Form and Zod validation.
 * Provides professional reservation creation UX.
 */

import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { reservationSchema, type ReservationFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Calendar, Clock, Users, FileText } from 'lucide-react';
import type { TableEntity } from '@/types/api';

interface ReservationFormProps {
  restaurantId: number;
  tables: TableEntity[];
  defaultDate?: string;
  defaultTime?: string;
  defaultGuestCount?: number;
  onSubmit: (data: ReservationFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ReservationForm({
  restaurantId,
  tables,
  defaultDate,
  defaultTime,
  defaultGuestCount = 1,
  onSubmit,
  isLoading = false
}: ReservationFormProps) {
  const [selectedTableCapacity, setSelectedTableCapacity] = useState<number | null>(null);

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema) as any,
    defaultValues: {
      restaurantId,
      tableId: 0,
      reservationDate: defaultDate || new Date().toISOString().slice(0, 10),
      reservationTime: defaultTime || '19:00',
      guestCount: defaultGuestCount,
      customerNotes: ''
    }
  });

  const selectedTableId = form.watch('tableId');
  const guestCount = form.watch('guestCount');

  // Update selected table capacity
  useEffect(() => {
    if (selectedTableId) {
      const table = tables.find((t) => t.id === selectedTableId);
      setSelectedTableCapacity(table?.capacity || null);
    } else {
      setSelectedTableCapacity(null);
    }
  }, [selectedTableId, tables]);

  // Filter available tables based on guest count
  const availableTables = tables.filter((t) => t.is_active && t.capacity >= guestCount);

  const handleSubmit: SubmitHandler<ReservationFormData> = async (data: ReservationFormData) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar reserva';
      toast.error(message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Date Field */}
        <FormField
          control={form.control}
          name="reservationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data da Reserva
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time Field */}
        <FormField
          control={form.control}
          name="reservationTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Horário
              </FormLabel>
              <FormControl>
                <Input
                  type="time"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Guest Count Field */}
        <FormField
          control={form.control}
          name="guestCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Número de Convidados
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  disabled={isLoading}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
              {availableTables.length === 0 && guestCount > 0 && (
                <p className="text-sm text-red-600">
                  Nenhuma mesa disponível para {guestCount} convidado{guestCount !== 1 ? 's' : ''}
                </p>
              )}
            </FormItem>
          )}
        />

        {/* Table Selection */}
        <FormField
          control={form.control}
          name="tableId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mesa</FormLabel>
              <Select
                value={field.value ? String(field.value) : ''}
                onValueChange={(value) => field.onChange(Number(value))}
                disabled={isLoading || availableTables.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma mesa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableTables.map((table) => (
                    <SelectItem key={table.id} value={String(table.id)}>
                      Mesa {table.table_number} (Capacidade: {table.capacity})
                      {table.location && ` - ${table.location}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
              {selectedTableCapacity && (
                <p className="text-sm text-gray-600">
                  Capacidade da mesa: {selectedTableCapacity} pessoas
                </p>
              )}
            </FormItem>
          )}
        />

        {/* Notes Field */}
        <FormField
          control={form.control}
          name="customerNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Observações (opcional)
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Preferências especiais, alergias, etc."
                  disabled={isLoading}
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || availableTables.length === 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando reserva...
            </>
          ) : (
            'Confirmar Reserva'
          )}
        </Button>
      </form>
    </Form>
  );
}
