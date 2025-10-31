import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../navigation/types';
import { ExpenseItem } from '../components/expense/ExpenseItem';
import { Input } from '../components/common/Input';
import { useExpenses } from '../context/ExpenseContext';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { Category, CATEGORIES } from '../types/expense.types';
import { SafeAreaView } from 'react-native-safe-area-context';
type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { expenses, loading, getTotalExpenses } = useExpenses();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>(
    'All',
  );

  // Filter expenses based on search and category
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch =
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.amount.toString().includes(searchQuery);

      const matchesCategory =
        selectedCategory === 'All' || expense.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchQuery, selectedCategory]);
  const handleExpensePress = (expenseId: string) => {
    navigation.navigate('ExpenseDetail', { expenseId });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading expenses...</Text>
      </View>
    );
  }

  const totalExpenses = getTotalExpenses();
  const filteredTotal = filteredExpenses.reduce(
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
          <Text style={styles.totalCount}>{expenses.length} expenses</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search expenses..."
          containerStyle={styles.searchInput}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter:</Text>
        <FlatList
          horizontal
          data={['All', ...CATEGORIES]}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedCategory === item && styles.filterChipActive,
              ]}
              onPress={() => setSelectedCategory(item as Category | 'All')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory === item && styles.filterChipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {searchQuery || selectedCategory !== 'All' ? (
        <View style={styles.resultInfo}>
          <Text style={styles.resultText}>
            {filteredExpenses.length} result(s) • ₹{filteredTotal.toFixed(2)}
          </Text>
        </View>
      ) : null}

      <FlatList
        data={filteredExpenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ExpenseItem
            expense={item}
            onPress={() => handleExpensePress(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory !== 'All'
                ? 'No matching expenses'
                : 'No expenses yet'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search or filter'
                : 'Start tracking your expenses!'}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
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
  totalCount: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.surface,
    opacity: 0.8,
    marginTop: SPACING.xs,
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  searchInput: {
    marginBottom: 0,
  },
  filterContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  filterLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  filterList: {
    gap: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  filterChipTextActive: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  resultInfo: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  resultText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
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
