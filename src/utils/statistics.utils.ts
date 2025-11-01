import { Expense, Category } from '../types/expense.types';
import { CategoryTotal, MonthlyData } from '../types/statistics.types';
import {
  startOfMonth,
  endOfMonth,
  format,
  isWithinInterval,
  subMonths,
} from 'date-fns';

export class StatisticsUtils {
  /**
   * Calculate category-wise totals
   */
  static getCategoryTotals(expenses: Expense[]): CategoryTotal[] {
    const categoryMap = new Map<string, { total: number; count: number }>();
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    expenses.forEach(expense => {
      const current = categoryMap.get(expense.category) || {
        total: 0,
        count: 0,
      };
      categoryMap.set(expense.category, {
        total: current.total + expense.amount,
        count: current.count + 1,
      });
    });

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        total: data.total,
        count: data.count,
        percentage: total > 0 ? (data.total / total) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }

  /**
   * Get expenses for current month
   */
  static getCurrentMonthExpenses(expenses: Expense[]): Expense[] {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    return expenses.filter(expense =>
      isWithinInterval(expense.date, { start, end }),
    );
  }

  /**
   * Get monthly data for last N months
   */
  static getMonthlyData(expenses: Expense[], months: number): MonthlyData[] {
    const now = new Date();
    const monthlyData: MonthlyData[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);

      const monthExpenses = expenses.filter(expense =>
        isWithinInterval(expense.date, { start, end }),
      );

      monthlyData.push({
        month: format(monthDate, 'MMM'),
        total: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
        count: monthExpenses.length,
      });
    }

    return monthlyData;
  }

  /**
   * Filter expenses by date range
   */
  static filterByDateRange(
    expenses: Expense[],
    startDate: Date,
    endDate: Date,
  ): Expense[] {
    return expenses.filter(expense =>
      isWithinInterval(expense.date, { start: startDate, end: endDate }),
    );
  }

  /**
   * Get top spending categories
   */
  static getTopCategories(
    expenses: Expense[],
    limit: number = 5,
  ): CategoryTotal[] {
    return this.getCategoryTotals(expenses).slice(0, limit);
  }
}
