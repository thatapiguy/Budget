import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BudgetTracker from './features/budgets/components/BudgetTracker';
import Navigation from './features/layout/components/Navigation';
import AccountDetails from './features/accounts/pages/AccountDetails';
import { accountsApi, transactionsApi } from './services/api';
import AccountForm from './features/accounts/components/AccountForm';
import { Account, Transaction } from './types';
import { CreateAccountData } from './types/api';

const App: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAccountForm, setShowAccountForm] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [accountsData, transactionsData] = await Promise.all([
          accountsApi.getAll(),
          transactionsApi.getAll()
        ]);
        setAccounts(accountsData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  const handleAddAccount = async (data: CreateAccountData) => {
    try {
      await accountsApi.create(data);
      const accountsData = await accountsApi.getAll();
      setAccounts(accountsData);
      setShowAccountForm(false);
    } catch (error) {
      console.error('Failed to add account:', error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation 
          accounts={accounts} 
          onAddAccount={() => setShowAccountForm(true)} 
        />
        <main className="pt-16 px-4">  {/* Added padding-top to account for menu button */}
          <Routes>
            <Route path="/" element={<BudgetTracker />} />
            <Route 
              path="/accounts/:id" 
              element={<AccountDetails />} 
            />
          </Routes>
        </main>

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
    </Router>
  );
};

export default App;
