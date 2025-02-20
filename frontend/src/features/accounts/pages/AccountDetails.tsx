import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TransactionsList from '../../transactions/components/TransactionsList';
import AddTransactionForm from '../../transactions/components/AddTransactionForm';
import ImportWizard from '../components/ImportWizard';
import { API_URL } from '../../../config/constants';
import { Account, Transaction } from '../../../types';

const AccountDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showImport, setShowImport] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/accounts/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch account details');
      }
      const data = await response.json();
      setAccount(data);
    } catch (error) {
      console.error('Error fetching account:', error);
      setError('Failed to load account details');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions?account_id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to load transactions');
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchAccountDetails(), fetchTransactions()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  if (isLoading) {
    return <div className="p-4">Loading account details...</div>;
  }

  if (error || !account) {
    return <div className="p-4 text-red-600">{error || 'Account not found'}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {account.name}
          <span className={`ml-4 ${account.current_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${account.current_balance.toFixed(2)}
          </span>
        </h1>
        <button
          onClick={() => setShowImport(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Import Transactions
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
        <AddTransactionForm 
          accountId={Number(id)}
          onSubmit={() => {
            fetchAccountDetails();
            fetchTransactions();
          }}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>
        <TransactionsList transactions={transactions} />
      </div>

      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <ImportWizard
            accountId={account.id}
            onImportComplete={() => {
              setShowImport(false);
              loadData();
            }}
            onCancel={() => setShowImport(false)}
          />
        </div>
      )}
    </div>
  );
};

export default AccountDetails;
