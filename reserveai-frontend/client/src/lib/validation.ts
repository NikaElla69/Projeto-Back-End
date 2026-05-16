/**
 * Validation schemas using Zod for all forms in the application.
 * Centralizes validation logic for consistency and reusability.
 */

import { z } from 'zod';
import type { UserRole, ReservationStatus } from '@/types/api';

// ============================================================================
// Authentication Schemas
// ============================================================================

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z.string()
    .min(1, 'Senha é obrigatória')
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(120, 'Nome não pode ter mais de 120 caracteres'),
  email: z.string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos um número'),
  confirmPassword: z.string()
    .min(1, 'Confirmação de senha é obrigatória'),
  role: z.enum(['customer', 'owner', 'admin'] as const)
    .default('customer')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// ============================================================================
// User Profile Schemas
// ============================================================================

export const profileEditSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(120, 'Nome não pode ter mais de 120 caracteres'),
  email: z.string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
});

export type ProfileEditFormData = z.infer<typeof profileEditSchema>;

export const passwordChangeSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Senha atual é obrigatória'),
  newPassword: z.string()
    .min(8, 'Nova senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos um número'),
  confirmPassword: z.string()
    .min(1, 'Confirmação de senha é obrigatória')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'Nova senha deve ser diferente da senha atual',
  path: ['newPassword']
});

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

// ============================================================================
// Restaurant Schemas
// ============================================================================

export const restaurantSchema = z.object({
  name: z.string()
    .min(2, 'Nome do restaurante é obrigatório')
    .max(150, 'Nome não pode ter mais de 150 caracteres'),
  description: z.string()
    .max(1000, 'Descrição não pode ter mais de 1000 caracteres')
    .optional()
    .or(z.literal('')),
  cuisineType: z.string()
    .max(80, 'Tipo de culinária não pode ter mais de 80 caracteres')
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .regex(/^\+?[\d\s\-()]+$/, 'Telefone inválido')
    .optional()
    .or(z.literal('')),
  city: z.string()
    .max(100, 'Cidade não pode ter mais de 100 caracteres')
    .optional()
    .or(z.literal('')),
  address: z.string()
    .max(255, 'Endereço não pode ter mais de 255 caracteres')
    .optional()
    .or(z.literal('')),
  logoUrl: z.string()
    .url('URL do logo inválida')
    .optional()
    .or(z.literal('')),
  reservationLimitTime: z.string()
    .regex(/^\d{2}:\d{2}$/, 'Formato deve ser HH:MM')
    .optional()
    .or(z.literal('')),
  noShowPolicy: z.string()
    .max(1000, 'Política de não comparecimento não pode ter mais de 1000 caracteres')
    .optional()
    .or(z.literal(''))
});

export type RestaurantFormData = z.infer<typeof restaurantSchema>;

// ============================================================================
// Table Schemas
// ============================================================================

export const tableSchema = z.object({
  restaurantId: z.number()
    .min(1, 'Restaurante é obrigatório'),
  tableNumber: z.string()
    .min(1, 'Número da mesa é obrigatório')
    .max(20, 'Número da mesa não pode ter mais de 20 caracteres'),
  capacity: z.number()
    .min(1, 'Capacidade deve ser pelo menos 1')
    .max(20, 'Capacidade não pode ser maior que 20'),
  location: z.string()
    .max(80, 'Localização não pode ter mais de 80 caracteres')
    .optional()
    .or(z.literal('')),
  isActive: z.boolean()
    .default(true)
});

export type TableFormData = z.infer<typeof tableSchema>;

// ============================================================================
// Reservation Schemas
// ============================================================================

export const reservationSchema = z.object({
  restaurantId: z.number()
    .min(1, 'Restaurante é obrigatório'),
  tableId: z.number()
    .min(1, 'Mesa é obrigatória'),
  reservationDate: z.string()
    .min(1, 'Data é obrigatória')
    .refine((date) => {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, 'Data não pode ser no passado'),
  reservationTime: z.string()
    .regex(/^\d{2}:\d{2}$/, 'Formato deve ser HH:MM'),
  guestCount: z.number()
    .min(1, 'Número de convidados deve ser pelo menos 1')
    .max(20, 'Número de convidados não pode ser maior que 20'),
  customerNotes: z.string()
    .max(500, 'Notas não podem ter mais de 500 caracteres')
    .optional()
    .or(z.literal(''))
});

export type ReservationFormData = z.infer<typeof reservationSchema>;

export const updateReservationSchema = z.object({
  tableId: z.number()
    .min(1, 'Mesa é obrigatória')
    .optional(),
  reservationDate: z.string()
    .min(1, 'Data é obrigatória')
    .refine((date) => {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, 'Data não pode ser no passado')
    .optional(),
  reservationTime: z.string()
    .regex(/^\d{2}:\d{2}$/, 'Formato deve ser HH:MM')
    .optional(),
  guestCount: z.number()
    .min(1, 'Número de convidados deve ser pelo menos 1')
    .max(20, 'Número de convidados não pode ser maior que 20')
    .optional(),
  customerNotes: z.string()
    .max(500, 'Notas não podem ter mais de 500 caracteres')
    .optional()
    .or(z.literal(''))
});

export type UpdateReservationFormData = z.infer<typeof updateReservationSchema>;

export const updateReservationStatusSchema = z.object({
  status: z.enum(['confirmed', 'rejected', 'cancelled', 'completed'] as const),
  rejectionReason: z.string()
    .min(1, 'Motivo da rejeição é obrigatório')
    .max(500, 'Motivo não pode ter mais de 500 caracteres')
    .optional()
}).refine((data) => {
  if (data.status === 'rejected') {
    return data.rejectionReason && data.rejectionReason.length > 0;
  }
  return true;
}, {
  message: 'Motivo da rejeição é obrigatório quando rejeitando uma reserva',
  path: ['rejectionReason']
});

export type UpdateReservationStatusFormData = z.infer<typeof updateReservationStatusSchema>;

// ============================================================================
// Search & Filter Schemas
// ============================================================================

export const restaurantSearchSchema = z.object({
  query: z.string()
    .max(100, 'Busca não pode ter mais de 100 caracteres')
    .optional()
    .or(z.literal('')),
  cuisineType: z.string()
    .optional()
    .or(z.literal('')),
  city: z.string()
    .optional()
    .or(z.literal('')),
  sortBy: z.enum(['name', 'newest', 'rating'] as const)
    .default('name')
});

export type RestaurantSearchFormData = z.infer<typeof restaurantSearchSchema>;

export const availabilitySearchSchema = z.object({
  date: z.string()
    .min(1, 'Data é obrigatória')
    .refine((date) => {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, 'Data não pode ser no passado'),
  time: z.string()
    .regex(/^\d{2}:\d{2}$/, 'Formato deve ser HH:MM'),
  guestCount: z.number()
    .min(1, 'Número de convidados deve ser pelo menos 1')
    .max(20, 'Número de convidados não pode ser maior que 20')
    .default(1)
});

export type AvailabilitySearchFormData = z.infer<typeof availabilitySearchSchema>;

// ============================================================================
// Admin Schemas
// ============================================================================

export const userRoleUpdateSchema = z.object({
  role: z.enum(['customer', 'owner', 'admin'] as const)
});

export type UserRoleUpdateFormData = z.infer<typeof userRoleUpdateSchema>;
