import { API_URL } from '../config/constants';
import { Account, Transaction } from '../types';
import { AccountData, TransactionData, CreateAccountData } from '../types/api';

// Accounts API
export const accountsApi = {
  async getAll(): Promise<Account[]> {
    const response = await fetch(`${API_URL}/accounts`);
    const data: AccountData[] = await response.json();
    return data.map(account => ({
      ...account,
      id: account.id || 0,
      created_at: account.created_at || new Date().toISOString()
    }));
  },

  async create(data: CreateAccountData): Promise<Account> {
    const response = await fetch(`${API_URL}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const accountData: AccountData = await response.json();
    return {
      ...accountData,
      id: accountData.id || 0,
      created_at: accountData.created_at || new Date().toISOString()
    };
  }
};

// Transactions API
export const transactionsApi = {
  async getAll(): Promise<Transaction[]> {
    try {
      const response = await fetch(`${API_URL}/transactions`);
      const data = await response.json();
      return data.map((transaction: TransactionData) => ({
        ...transaction,
        id: transaction.id || 0
      }));
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async create(data: Omit<TransactionData, 'id'>) {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || result.details || 'Failed to create transaction');
      }

      return response.json();
    } catch (error) {
      console.error('Transaction creation failed:', error);
      throw error;
    }
  },

  async update(id: number, data: Omit<TransactionData, 'id'>) {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async delete(id: number) {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
};

// Budgets API
export const budgetsApi = {
  async getAll() {
    const response = await fetch(`${API_URL}/budgets`);
    return response.json();
  },

  async create(data: { category: string; amount: number; period: 'monthly' | 'annual'; year?: number }) {
    const response = await fetch(`${API_URL}/budgets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async update(id: number, data: { category: string; amount: number; period: 'monthly' | 'annual'; year?: number }) {
    const response = await fetch(`${API_URL}/budgets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
};
