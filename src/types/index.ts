
export type DriverType = "taxi" | "platform";

export interface Platform {
  id: string;
  name: string;
  color: string;
  selected: boolean;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
}

export interface UserConfig {
  driverType: DriverType;
  platforms: Platform[];
  vehicleColor: string;
  expenseCategories: ExpenseCategory[];
  theme: "taxi" | "platform";
}

export interface DayStart {
  id: string;
  date: string;
  startTime: string;
  initialMileage: number;
  initialCash: number;
  notes: string;
  isActive: boolean;
}

export interface Income {
  id: string;
  dayId: string;
  timestamp: string;
  platform: string;
  amount: number;
  paymentMethod: "cash" | "card" | "voucher" | "qr";
  tollIncluded: boolean;
  tollAmount?: number;
  notes?: string;
}

export interface Expense {
  id: string;
  dayId: string;
  timestamp: string;
  category: string;
  amount: number;
  description?: string;
  receiptImage?: string;
}

export interface Day {
  start: DayStart;
  incomes: Income[];
  expenses: Expense[];
  end?: {
    endTime: string;
    finalMileage: number;
    notes?: string;
  };
  pauses?: Array<{
    start: string;
    end?: string;
  }>;
}

export interface StatsSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  totalServices: number;
  mostUsedPlatform: string;
  averageServiceValue: number;
  expensesByCategory: Record<string, number>;
  timeWorked: number;  // in minutes
}
