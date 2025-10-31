import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '../types/expense.types';

const EXPENSES_KEY = '@ExpenseTracker:expenses';

export class StorageService {
  /**
   * Save expenses to AsyncStorage
   */
  static async saveExpenses(expenses: Expense[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(expenses);
      await AsyncStorage.setItem(EXPENSES_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving expenses:', error);
      throw new Error('Failed to save expenses');
    }
  }

  /**
   * Get all expenses from AsyncStorage
   */
  static async getExpenses(): Promise<Expense[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(EXPENSES_KEY);
      if (jsonValue === null) {
        return [];
      }
      const expenses = JSON.parse(jsonValue);
      // Convert date strings back to Date objects
      return expenses.map((expense: any) => ({
        ...expense,
        date: new Date(expense.date),
        createdAt: new Date(expense.createdAt),
      }));
    } catch (error) {
      console.error('Error loading expenses:', error);
      return [];
    }
  }

  /**
   * Clear all expenses (useful for testing)
   */
  static async clearExpenses(): Promise<void> {
    try {
      await AsyncStorage.removeItem(EXPENSES_KEY);
    } catch (error) {
      console.error('Error clearing expenses:', error);
      throw new Error('Failed to clear expenses');
    }
  }
}
