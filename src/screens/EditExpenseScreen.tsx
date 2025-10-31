import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { CategoryPicker } from '../components/common/CategoryPicker';
import { Category } from '../types/expense.types';
import { useExpenses } from '../context/ExpenseContext';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
type Props = NativeStackScreenProps<RootStackParamList, 'EditExpense'>;

interface FormErrors {
  amount?: string;
  description?: string;
}

export const EditExpenseScreen: React.FC<Props> = ({ route, navigation }) => {
  const { expenseId } = route.params;
  const { expenses, updateExpense } = useExpenses();

  // Fetch expense from context using ID
  const expense = expenses.find(e => e.id === expenseId);

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Initialize form with expense data
  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDescription(expense.description);
    }
  }, [expense]);

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount))) {
      newErrors.amount = 'Amount must be a number';
    } else if (Number(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await updateExpense(expense.id, {
        amount: Number(amount),
        category,
        description: description.trim(),
      });

      Alert.alert('Success', 'Expense updated successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to update expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Edit Expense</Text>

          <Input
            label="Amount (₹)"
            value={amount}
            onChangeText={text => {
              setAmount(text);
              if (errors.amount) {
                setErrors({ ...errors, amount: undefined });
              }
            }}
            keyboardType="numeric"
            placeholder="Enter amount"
            error={errors.amount}
          />

          <CategoryPicker
            selectedCategory={category}
            onSelectCategory={setCategory}
          />

          <Input
            label="Description (Optional)"
            value={description}
            onChangeText={text => {
              setDescription(text);
              if (errors.description) {
                setErrors({ ...errors, description: undefined });
              }
            }}
            placeholder="What did you spend on?"
            multiline
            numberOfLines={3}
            style={styles.textArea}
            error={errors.description}
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Update Expense"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
            />
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="outline"
              disabled={loading}
              style={styles.cancelButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  cancelButton: {
    marginTop: SPACING.sm,
  },
});
