export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: Date;
  createdAt: Date;
}

export type Category =
  | 'Food'
  | 'Transport'
  | 'Utilities'
  | 'Medical'
  | 'Education'
  | 'Entertainment'
  | 'Other';

export const CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Utilities',
  'Medical',
  'Education',
  'Entertainment',
  'Other',
];
