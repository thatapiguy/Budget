export interface BudgetEntry {
  category: string;
  amount: number;
  year?: number;
}

export interface Budgets {
  monthly: { [category: string]: BudgetEntry };
  annual: { [category: string]: BudgetEntry };
}
