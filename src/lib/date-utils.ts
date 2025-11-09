/**
 * Utility functions for formatting dates and times
 */

import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { it } from 'date-fns/locale';

const TIMEZONE = process.env.TIMEZONE || 'Europe/Rome';

/**
 * Format date in Italian locale
 */
export function formatDate(date: Date | string, formatStr: string = 'dd MMMM yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: it });
}

/**
 * Format date with timezone
 */
export function formatDateWithTimezone(
  date: Date | string,
  formatStr: string = 'dd MMMM yyyy HH:mm'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatInTimeZone(dateObj, TIMEZONE, formatStr, { locale: it });
}

/**
 * Get current date in Rome timezone
 */
export function getCurrentDateInRome(): Date {
  return new Date(
    new Date().toLocaleString('en-US', {
      timeZone: TIMEZONE,
    })
  );
}

/**
 * Format business hours for display
 */
export function formatBusinessHours(hours: {
  open: string | null;
  close: string | null;
  closeAfternoon?: string | null;
  reopenAfternoon?: string | null;
  closed: boolean;
}): string {
  if (hours.closed) {
    return 'Chiuso';
  }
  if (hours.closeAfternoon && hours.reopenAfternoon) {
    return `${hours.open} - ${hours.close} / ${hours.closeAfternoon} - ${hours.reopenAfternoon}`;
  }
  return `${hours.open} - ${hours.close}`;
}
