
import { UserConfig, DayStart, Income, Expense, Day } from "../types";

const USER_CONFIG_KEY = "rutapro_user_config";
const DAYS_KEY = "rutapro_days";
const ACTIVE_DAY_KEY = "rutapro_active_day";

// Default platforms
export const DEFAULT_PLATFORMS = [
  { id: "uber", name: "Uber", color: "#000000", selected: true },
  { id: "didi", name: "DiDi", color: "#fc4c01", selected: true },
  { id: "indrive", name: "InDrive", color: "#c1f11d", selected: true },
  { id: "mano", name: "Mano", color: "#1e88e5", selected: false },
  { id: "coopebombas", name: "Coopebombas", color: "#0d768c", selected: false }
];

// Default expense categories
export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: "fuel", name: "Tanqueo", color: "#f97316" },
  { id: "food", name: "Alimentación", color: "#84cc16" },
  { id: "wash", name: "Lavado", color: "#0ea5e9" },
  { id: "maintenance", name: "Mantenimiento", color: "#8b5cf6" },
  { id: "other", name: "Otro", color: "#64748b" }
];

// Default user configuration
export const DEFAULT_USER_CONFIG: UserConfig = {
  driverType: "platform",
  platforms: DEFAULT_PLATFORMS,
  vehicleColor: "gray",
  expenseCategories: DEFAULT_EXPENSE_CATEGORIES,
  theme: "platform"
};

// Save user configuration
export const saveUserConfig = (config: UserConfig): void => {
  localStorage.setItem(USER_CONFIG_KEY, JSON.stringify(config));
};

// Get user configuration
export const getUserConfig = (): UserConfig => {
  const configStr = localStorage.getItem(USER_CONFIG_KEY);
  return configStr ? JSON.parse(configStr) : DEFAULT_USER_CONFIG;
};

// Check if user has completed onboarding
export const hasCompletedOnboarding = (): boolean => {
  return localStorage.getItem(USER_CONFIG_KEY) !== null;
};

// Save a day record
export const saveDay = (day: Day): void => {
  const days = getDays();
  const existingIndex = days.findIndex(d => d.start.id === day.start.id);
  
  if (existingIndex >= 0) {
    days[existingIndex] = day;
  } else {
    days.push(day);
  }
  
  localStorage.setItem(DAYS_KEY, JSON.stringify(days));
  
  if (day.start.isActive) {
    localStorage.setItem(ACTIVE_DAY_KEY, day.start.id);
  } else if (localStorage.getItem(ACTIVE_DAY_KEY) === day.start.id) {
    localStorage.removeItem(ACTIVE_DAY_KEY);
  }
};

// Get all days
export const getDays = (): Day[] => {
  const daysStr = localStorage.getItem(DAYS_KEY);
  return daysStr ? JSON.parse(daysStr) : [];
};

// Get active day
export const getActiveDay = (): Day | null => {
  const activeId = localStorage.getItem(ACTIVE_DAY_KEY);
  if (!activeId) return null;
  
  const days = getDays();
  return days.find(day => day.start.id === activeId) || null;
};

// Delete a day
export const deleteDay = (dayId: string): void => {
  const days = getDays().filter(day => day.start.id !== dayId);
  localStorage.setItem(DAYS_KEY, JSON.stringify(days));
  
  if (localStorage.getItem(ACTIVE_DAY_KEY) === dayId) {
    localStorage.removeItem(ACTIVE_DAY_KEY);
  }
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};
