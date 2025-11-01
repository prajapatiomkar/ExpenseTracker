import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { CategoryTotal } from '../../types/statistics.types';
import { COLORS, SPACING, FONT_SIZES } from '../../constants/theme';

interface CategoryBreakdownProps {
  data: CategoryTotal[];
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  data,
}) => {
  if (data.length === 0) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Category Breakdown</Text>
      {data.map((item, index) => (
        <View key={item.category} style={styles.row}>
          <View style={styles.leftSection}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.count}>{item.count} expenses</Text>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.amount}>₹{item.total.toFixed(2)}</Text>
            <Text style={styles.percentage}>{item.percentage.toFixed(1)}%</Text>
          </View>
        </View>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  category: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  count: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  amount: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  percentage: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
