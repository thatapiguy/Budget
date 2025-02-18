import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import BudgetForm from './budget/BudgetForm';
import TransactionForm from './transactions/TransactionForm';
import AccountForm from './accounts/AccountForm';
import { transactionsApi, budgetsApi, accountsApi, TransactionData, BudgetData, AccountData } from '../services/api';
import BudgetCategory from './BudgetCategory';
import TransactionList from './TransactionList';
import MonthPicker from './MonthPicker';

interface Transaction {
  id: number;
  account_id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
}

interface Budget {
  category: string;
  amount: number;
  year?: number;
}

interface Budgets {
  monthly: Record<string, Budget>;
  annual: Record<string, Budget>;
}

const BudgetTracker: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const currentYear = currentMonth.getFullYear();

  const [budgets, setBudgets] = useState<Budgets>({
    monthly: {},
    annual: {}
  });

  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [budgetPeriod, setBudgetPeriod] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transactionsData, budgetsData, accountsData] = await Promise.all([
        transactionsApi.getAll(),
        budgetsApi.getAll(),
        accountsApi.getAll()
      ]);
      
      setTransactions(transactionsData);
      setAccounts(accountsData);
      
      const formattedBudgets: Budgets = {
        monthly: {},
        annual: {}
      };
      
      budgetsData.forEach((budget: BudgetData) => {
        if (budget.period === 'monthly' || budget.period === 'annual') {
          formattedBudgets[budget.period][budget.category] = {
            category: budget.category,
            amount: budget.amount,
            year: budget.period === 'annual' ? budget.year : undefined
          };
        }
      });
      
      setBudgets(formattedBudgets);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleAddBudget = async (newBudget: { category: string; amount: number; period: 'monthly' | 'annual' }) => {
    try {
      await budgetsApi.create(newBudget);
      loadData(); // Reload all data
      setShowBudgetForm(false);
    } catch (error) {
      console.error('Failed to add budget:', error);
    }
  };

  const handleAddTransaction = async (data: Omit<Transaction, 'id'> & { account_id: number }) => {
    try {
      await transactionsApi.create(data);
      loadData(); // Reload all data
      setShowTransactionForm(false);
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const handleEditTransaction = async (data: Omit<Transaction, 'id'> & { account_id: number }) => {
    if (editingTransaction) {
      try {
        await transactionsApi.update(editingTransaction.id, { ...data, account_id: editingTransaction.account_id });
        loadData(); // Reload all data
        setEditingTransaction(null);
        setShowTransactionForm(false);
      } catch (error) {
        console.error('Failed to update transaction:', error);
      }
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      await transactionsApi.delete(id);
      loadData();
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleTransactionFormClose = () => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
  };

  const handleBudgetFormClose = () => {
    setShowBudgetForm(false);
  };

  const handleAddAccount = async (data: { name: string; type: string; starting_balance: number }) => {
    try {
      await accountsApi.create(data);
      loadData();
      setShowAccountForm(false);
    } catch (error) {
      console.error('Failed to add account:', error);
    }
  };

  const getFilteredTransactions = () => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === currentMonth.getMonth() &&
        transactionDate.getFullYear() === currentMonth.getFullYear()
      );
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Budget Tracker</h1>
        <button
          onClick={() => setShowTransactionForm(true)}
          className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <Plus size={20} /> Add Transaction
        </button>
      </div>

      <MonthPicker currentDate={currentMonth} onChange={setCurrentMonth} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetCategory
          title="Monthly Budgets"
          budgets={budgets.monthly}
          transactions={getFilteredTransactions()}
          period="monthly"
          onAddBudget={() => {
            setShowBudgetForm(true);
            setBudgetPeriod('monthly');
          }}
        />
        <BudgetCategory
          title="Annual Budgets"
          budgets={budgets.annual}
          transactions={transactions}
          period="annual"
          currentYear={currentYear}
          onAddBudget={() => {
            setShowBudgetForm(true);
            setBudgetPeriod('annual');
          }}
        />
      </div>

      <TransactionList
        transactions={getFilteredTransactions()}
        onEdit={handleEditClick}
        onDelete={handleDeleteTransaction}
      />

      {showBudgetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <BudgetForm 
              onSave={handleAddBudget} 
              onCancel={handleBudgetFormClose} 
            />
          </div>
        </div>
      )}

      {showTransactionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <TransactionForm
              categories={[
                ...Object.keys(budgets.monthly),
                ...Object.keys(budgets.annual)
              ]}
              accounts={accounts.filter(account => account.id !== undefined) as { id: number; name: string; }[]}
              onSave={editingTransaction ? handleEditTransaction : handleAddTransaction}
              editTransaction={editingTransaction || undefined}
              onCancel={handleTransactionFormClose}
            />
          </div>
        </div>
      )}

      {showAccountForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <AccountForm
              onSave={handleAddAccount}
              onCancel={() => setShowAccountForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetTracker;
