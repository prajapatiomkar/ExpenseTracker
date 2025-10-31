export type RootStackParamList = {
  MainTabs: undefined;
  ExpenseDetail: { expenseId: string }; // Changed: pass ID instead of object
  EditExpense: { expenseId: string }; // Changed: pass ID instead of object
};

export type MainTabParamList = {
  Home: undefined;
  AddExpense: undefined;
  Statistics: undefined;
};
