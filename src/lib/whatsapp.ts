/**
 * Utility functions for WhatsApp integration
 */

import { BUSINESS } from '@/config/constants';

/**
 * Generate WhatsApp link with pre-filled message
 */
export function getWhatsAppLink(message?: string): string {
  const baseUrl = `https://wa.me/${BUSINESS.whatsapp.replace(/\+/g, '')}`;
  
  if (!message) {
    return `${baseUrl}?text=${encodeURIComponent('Ciao, vorrei prenotare un appuntamento!')}`;
  }
  
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate WhatsApp link from contact form data
 */
export function getWhatsAppLinkFromForm(data: {
  name: string;
  phone: string;
  message: string;
}): string {
  const formattedMessage = `Ciao sono ${data.name}, telefono ${data.phone}. Messaggio: ${data.message}`;
  return getWhatsAppLink(formattedMessage);
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Format: +39 339 239 9044
  return phone.replace(/(\+\d{2})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4');
}

/**
 * Track WhatsApp click event (for analytics)
 */
export function trackWhatsAppClick(source: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'whatsapp_click', {
      event_category: 'engagement',
      event_label: source,
    });
  }
}

declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
  }
}
