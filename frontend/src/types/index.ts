export interface Transaction {
  id: number;
  account_id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface Account {
  id: number;
  name: string;
  type: string;
  current_balance: number;
  starting_balance: number;
  created_at: string;
}
