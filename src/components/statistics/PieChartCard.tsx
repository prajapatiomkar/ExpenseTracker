import React from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Card } from '../common/Card';
import { CategoryTotal } from '../../types/statistics.types';
import { COLORS, SPACING, FONT_SIZES } from '../../constants/theme';

interface PieChartCardProps {
  data: CategoryTotal[];
  title: string;
}

const CHART_COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#FF6384',
];

export const PieChartCard: React.FC<PieChartCardProps> = ({ data, title }) => {
  const screenWidth = Dimensions.get('window').width;

  const chartData = data.map((item, index) => ({
    name: item.category,
    population: item.total,
    color: CHART_COLORS[index % CHART_COLORS.length],
    legendFontColor: COLORS.text,
    legendFontSize: 12,
  }));

  if (data.length === 0) {
    return (
      <Card style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.emptyText}>No data available</Text>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <PieChart
        data={chartData}
        width={screenWidth - SPACING.md * 4}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
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
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: SPACING.xl,
  },
});
