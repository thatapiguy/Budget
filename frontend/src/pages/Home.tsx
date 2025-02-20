import React, { useEffect, useState } from 'react';
import TransactionsList from '../features/transactions/components/TransactionsList';
import AccountsList from '../features/accounts/components/AccountsList';
import { API_URL } from '../config/constants';

const Home: React.FC = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts();
    fetchRecentTransactions();
  }, []);

  const fetchRecentTransactions = async () => {
    try {
      // Fetch only recent transactions (last 30 days or last 10 transactions)
      const response = await fetch(`${API_URL}/transactions?limit=10`);
      const data = await response.json();
      setRecentTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchAccounts = async () => {
    // ... existing fetch accounts code ...
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-8">
        {/* Accounts Overview */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Accounts Overview</h2>
          <AccountsList accounts={accounts} />
        </section>

        {/* Recent Transactions */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <TransactionsList transactions={recentTransactions} />
        </section>
      </div>
    </div>
  );
};

export default Home;
