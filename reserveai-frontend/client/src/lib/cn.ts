/**
 * Utility function for merging Tailwind CSS classes.
 * Handles conflicts and ensures proper class precedence.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
