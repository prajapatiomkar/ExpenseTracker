import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { Expense } from '../../types/expense.types';
import { COLORS, SPACING, FONT_SIZES } from '../../constants/theme';
import { Card } from '../common/Card';

interface ExpenseItemProps {
  expense: Expense;
  onPress?: () => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({
  expense,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.category}>{expense.category}</Text>
          <Text style={styles.amount}>₹{expense.amount.toFixed(2)}</Text>
        </View>
        {expense.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {expense.description}
          </Text>
        ) : null}
        <Text style={styles.date}>{format(expense.date, 'MMM dd, yyyy')}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  category: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  amount: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  date: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
});
