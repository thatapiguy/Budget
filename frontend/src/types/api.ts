export interface AccountData {
  id?: number;
  name: string;
  type: string;
  current_balance: number;
  starting_balance: number;
  created_at?: string;
}

export interface TransactionData {
  id?: number;
  account_id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

export interface CreateAccountData {
  name: string;
  type: string;
  starting_balance: number;
}

export interface BudgetData {
  id?: number;
  category: string;
  amount: number;
  period: 'monthly' | 'annual';
  year?: number;
}
