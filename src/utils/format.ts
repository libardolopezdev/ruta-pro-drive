
import { CurrencyConfig } from "../types";
import { getUserConfig } from "./storage";

export const formatCurrency = (amount: number, currency?: CurrencyConfig): string => {
  const userConfig = getUserConfig();
  const currencyConf = currency || userConfig.currency;
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currencyConf.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format number with thousands separator
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    useGrouping: true,
  }).format(value);
};

// Format date in a user-friendly way
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CO', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
};

// Format time in a user-friendly way
export const formatTime = (timeString: string): string => {
  // Handle HH:MM format
  if (timeString.includes(':')) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return new Intl.DateTimeFormat('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    }).format(date);
  }
  return timeString;
};
