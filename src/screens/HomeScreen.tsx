import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import { ExpenseItem } from '../components/expense/ExpenseItem';
import { Expense } from '../types/expense.types';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
// Mock data for now
const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    amount: 250,
    category: 'Food',
    description: 'Lunch at restaurant',
    date: new Date(),
    createdAt: new Date(),
  },
  {
    id: '2',
    amount: 50,
    category: 'Transport',
    description: 'Auto to office',
    date: new Date(),
    createdAt: new Date(),
  },
  {
    id: '3',
    amount: 1200,
    category: 'Utilities',
    description: 'Electricity bill',
    date: new Date(2025, 9, 28),
    createdAt: new Date(),
  },
];

export const HomeScreen: React.FC = () => {
  const [expenses] = useState<Expense[]>(MOCK_EXPENSES);

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <Text style={styles.title}>My Expenses</Text>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Spent</Text>
          <Text style={styles.totalAmount}>₹{totalExpenses.toFixed(2)}</Text>
        </View>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ExpenseItem expense={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No expenses yet</Text>
            <Text style={styles.emptySubtext}>
              Start tracking your expenses!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  totalCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.md,
  },
  totalLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.surface,
    opacity: 0.9,
  },
  totalAmount: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginTop: SPACING.xs,
  },
  list: {
    padding: SPACING.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
