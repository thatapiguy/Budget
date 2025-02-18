// Make sure this IP matches your server's IP address
const API_URL = 'http://192.168.68.88:3001/api';  // Use localhost for local network access

export interface TransactionData {
  id?: number;          // Add this field
  account_id: number;  // Add this field
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface BudgetData {
  id?: number;
  category: string;
  amount: number;
  period: 'monthly' | 'annual';
  year?: number;
}

export interface AccountData {
  id?: number;
  name: string;
  type: string;
  starting_balance: number;
  current_balance: number;
}

// Transactions API
export const transactionsApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/transactions`);
      const data = await response.json();
      console.log('Fetched transactions:', data);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  create: async (data: TransactionData) => {
    try {
      console.log('Attempting to create transaction:', {
        url: `${API_URL}/transactions`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data
      });

      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('Server response:', {
        status: response.status,
        ok: response.ok,
        body: result
      });

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to create transaction');
      }

      return result;
    } catch (error) {
      console.error('Transaction creation failed:', {
        error,
        errorMessage: (error instanceof Error) ? error.message : 'Unknown error',
        originalData: data
      });
      throw error;
    }
  },

  update: async (id: number, data: TransactionData) => {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Budgets API
export const budgetsApi = {
  getAll: async (): Promise<BudgetData[]> => {
    const response = await fetch(`${API_URL}/budgets`);
    return response.json();
  },

  create: async (data: BudgetData) => {
    const response = await fetch(`${API_URL}/budgets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: number, data: BudgetData) => {
    const response = await fetch(`${API_URL}/budgets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Add accounts API
export const accountsApi = {
  getAll: async (): Promise<AccountData[]> => {
    const response = await fetch(`${API_URL}/accounts`);
    return response.json();
  },

  create: async (data: Omit<AccountData, 'id' | 'current_balance'>) => {
    const response = await fetch(`${API_URL}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateBalance: async (id: number, current_balance: number) => {
    const response = await fetch(`${API_URL}/accounts/${id}/balance`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_balance }),
    });
    return response.json();
  },
};
