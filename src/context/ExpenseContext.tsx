import React, { createContext, useState, useEffect, useContext } from 'react';
import { Expense } from '../types/expense.types';
import { StorageService } from '../services/storage.service';

interface ExpenseContextType {
  expenses: Expense[];
  loading: boolean;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  getTotalExpenses: () => number;
  getExpensesByCategory: (category: string) => Expense[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Load expenses on mount
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const loadedExpenses = await StorageService.getExpenses();
      setExpenses(loadedExpenses);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      const newExpense: Expense = {
        ...expenseData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      const updatedExpenses = [...expenses, newExpense];
      await StorageService.saveExpenses(updatedExpenses);
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error('Failed to add expense:', error);
      throw error;
    }
  };

  const updateExpense = async (id: string, expenseData: Partial<Expense>) => {
    try {
      const updatedExpenses = expenses.map(expense =>
        expense.id === id ? { ...expense, ...expenseData } : expense,
      );
      await StorageService.saveExpenses(updatedExpenses);
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error('Failed to update expense:', error);
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const updatedExpenses = expenses.filter(expense => expense.id !== id);
      await StorageService.saveExpenses(updatedExpenses);
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error('Failed to delete expense:', error);
      throw error;
    }
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getExpensesByCategory = (category: string) => {
    return expenses.filter(expense => expense.category === category);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        addExpense,
        updateExpense,
        deleteExpense,
        getTotalExpenses,
        getExpensesByCategory,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook to use expense context
export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within ExpenseProvider');
  }
  return context;
};
