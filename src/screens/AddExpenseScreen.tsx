import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { CategoryPicker } from '../components/common/CategoryPicker';
import { Category } from '../types/expense.types';
import { useExpenses } from '../context/ExpenseContext';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
interface FormErrors {
  amount?: string;
  category?: string;
  description?: string;
}

export const AddExpenseScreen: React.FC = () => {
  const { addExpense } = useExpenses();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [description, setDescription] = useState('');
  const [date] = useState(new Date());
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate amount
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount))) {
      newErrors.amount = 'Amount must be a number';
    } else if (Number(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    // Validate description length
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
      await addExpense({
        amount: Number(amount),
        category,
        description: description.trim(),
        date,
      });

      Alert.alert('Success', 'Expense added successfully!', [
        {
          text: 'OK',
          onPress: resetForm,
        },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setCategory('Food');
    setDescription('');
    setErrors({});
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
          <Text style={styles.title}>Add New Expense</Text>

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

          <Text style={styles.dateText}>
            Date: {date.toLocaleDateString('en-IN')}
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Add Expense"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
            />
            <Button
              title="Reset"
              onPress={resetForm}
              variant="outline"
              disabled={loading}
              style={styles.resetButton}
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
  dateText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  buttonContainer: {
    gap: SPACING.sm,
  },
  resetButton: {
    marginTop: SPACING.sm,
  },
});
