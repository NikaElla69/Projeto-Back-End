/**
 * Application constants and configuration values.
 */

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 8000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH: 'reserveai.auth',
  THEME: 'reserveai.theme',
  FAVORITES: 'reserveai.favorites'
};

// Date/Time Constants
export const DATE_TIME = {
  MIN_ADVANCE_DAYS: 0,
  MAX_ADVANCE_DAYS: 90,
  BUSINESS_HOURS_START: '11:00',
  BUSINESS_HOURS_END: '23:00',
  TIME_SLOT_INTERVAL: 30 // minutes
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  OWNER: 'owner',
  ADMIN: 'admin'
} as const;

// Reservation Status
export const RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
} as const;

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 120,
  EMAIL_MAX_LENGTH: 150,
  DESCRIPTION_MAX_LENGTH: 1000,
  NOTES_MAX_LENGTH: 500
};

// UI Configuration
export const UI = {
  TOAST_DURATION: 3000,
  MODAL_ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 500
};

// Feature Flags
export const FEATURES = {
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_FAVORITES: true,
  ENABLE_RATINGS: false,
  ENABLE_REVIEWS: false
};
