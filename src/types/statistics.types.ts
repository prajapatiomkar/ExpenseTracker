export interface CategoryTotal {
  category: string;
  total: number;
  percentage: number;
  count: number;
}

export interface MonthlyData {
  month: string;
  total: number;
  count: number;
}

export interface BudgetData {
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
}
