import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { PieChartCard } from '../components/statistics/PieChartCard';
import { BarChartCard } from '../components/statistics/BarChartCard';
import { CategoryBreakdown } from '../components/statistics/CategoryBreakdown';
import { useExpenses } from '../context/ExpenseContext';
import { StatisticsUtils } from '../utils/statistics.utils';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
type DateRange = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

export const StatisticsScreen: React.FC = () => {
  const { expenses } = useExpenses();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Filter expenses based on date range
  const filteredExpenses = useMemo(() => {
    if (dateRange.startDate && dateRange.endDate) {
      return StatisticsUtils.filterByDateRange(
        expenses,
        dateRange.startDate,
        dateRange.endDate,
      );
    }
    return expenses;
  }, [expenses, dateRange]);

  // Calculate statistics
  const categoryTotals = useMemo(
    () => StatisticsUtils.getCategoryTotals(filteredExpenses),
    [filteredExpenses],
  );

  const monthlyData = useMemo(
    () => StatisticsUtils.getMonthlyData(expenses, 6),
    [expenses],
  );

  const currentMonthExpenses = useMemo(
    () => StatisticsUtils.getCurrentMonthExpenses(expenses),
    [expenses],
  );

  const currentMonthTotal = currentMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0,
  );

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const averageExpense =
    filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0;

  const onDismiss = () => {
    setShowDatePicker(false);
  };

  const onConfirm = ({
    startDate,
    endDate,
  }: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }) => {
    setShowDatePicker(false);
    setDateRange({ startDate, endDate });
  };

  const clearDateFilter = () => {
    setDateRange({ startDate: undefined, endDate: undefined });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Statistics</Text>

        {/* Date Filter */}
        <Card style={styles.filterCard}>
          <Text style={styles.filterLabel}>Filter by Date Range</Text>
          <Button
            title={
              dateRange.startDate && dateRange.endDate
                ? `${format(dateRange.startDate, 'MMM dd')} - ${format(
                    dateRange.endDate,
                    'MMM dd, yyyy',
                  )}`
                : 'Select Date Range'
            }
            onPress={() => setShowDatePicker(true)}
            variant="outline"
          />
          {dateRange.startDate && dateRange.endDate && (
            <Button
              title="Clear Filter"
              onPress={clearDateFilter}
              variant="outline"
              style={styles.clearButton}
            />
          )}
        </Card>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={styles.summaryValue}>₹{totalExpenses.toFixed(2)}</Text>
            <Text style={styles.summarySubtext}>
              {filteredExpenses.length} expenses
            </Text>
          </Card>

          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Average</Text>
            <Text style={styles.summaryValue}>
              ₹{averageExpense.toFixed(2)}
            </Text>
            <Text style={styles.summarySubtext}>per expense</Text>
          </Card>
        </View>

        <Card style={styles.monthCard}>
          <Text style={styles.monthLabel}>This Month</Text>
          <Text style={styles.monthValue}>₹{currentMonthTotal.toFixed(2)}</Text>
          <Text style={styles.monthSubtext}>
            {currentMonthExpenses.length} expenses
          </Text>
        </Card>

        {/* Charts */}
        <PieChartCard data={categoryTotals} title="Spending by Category" />
        <BarChartCard data={monthlyData} title="Last 6 Months Trend" />
        <CategoryBreakdown data={categoryTotals} />
      </ScrollView>

      <DatePickerModal
        locale="en"
        mode="range"
        visible={showDatePicker}
        onDismiss={onDismiss}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onConfirm={onConfirm}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  filterCard: {
    marginBottom: SPACING.md,
  },
  filterLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  clearButton: {
    marginTop: SPACING.sm,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  summarySubtext: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  monthCard: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.secondary,
  },
  monthLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.surface,
    opacity: 0.9,
  },
  monthValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginTop: SPACING.xs,
  },
  monthSubtext: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.surface,
    opacity: 0.8,
    marginTop: SPACING.xs,
  },
});
