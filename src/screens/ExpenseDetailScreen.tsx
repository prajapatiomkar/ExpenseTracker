import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { format } from 'date-fns';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useExpenses } from '../context/ExpenseContext';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
type Props = NativeStackScreenProps<RootStackParamList, 'ExpenseDetail'>;

export const ExpenseDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { expenseId } = route.params;
  const { expenses, deleteExpense } = useExpenses();

  // Fetch expense from context using ID
  const expense = expenses.find(e => e.id === expenseId);

  // Handle case where expense is not found
  if (!expense) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Expense not found</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.errorButton}
        />
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(expense.id);
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'Failed to delete expense');
            }
          },
        },
      ],
    );
  };

  const handleEdit = () => {
    navigation.navigate('EditExpense', { expenseId: expense.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.mainCard}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amount}>₹{expense.amount.toFixed(2)}</Text>
          </View>
        </Card>

        <Card style={styles.detailCard}>
          <DetailRow label="Category" value={expense.category} />
          <DetailRow
            label="Date"
            value={format(expense.date, 'EEEE, MMMM dd, yyyy')}
          />
          <DetailRow
            label="Added On"
            value={format(expense.createdAt, 'MMM dd, yyyy HH:mm')}
          />
        </Card>

        {expense.description ? (
          <Card style={styles.detailCard}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.description}>{expense.description}</Text>
          </Card>
        ) : null}

        <View style={styles.buttonContainer}>
          <Button
            title="Edit Expense"
            onPress={handleEdit}
            style={styles.editButton}
          />
          <Button
            title="Delete Expense"
            onPress={handleDelete}
            variant="outline"
            style={styles.deleteButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.danger,
    marginBottom: SPACING.lg,
  },
  errorButton: {
    minWidth: 120,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  mainCard: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.md,
  },
  amountContainer: {
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  amount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  detailCard: {
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  editButton: {
    marginBottom: SPACING.xs,
  },
  deleteButton: {
    borderColor: COLORS.danger,
  },
});
