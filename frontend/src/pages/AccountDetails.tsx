import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AccountData, TransactionData, transactionsApi, accountsApi } from '../services/api';
import ImportWizard from '../components/accounts/ImportWizard';

interface AccountDetailsProps {
  accounts: AccountData[];
  transactions: TransactionData[];
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ accounts, transactions }) => {
  const { id } = useParams<{ id: string }>();
  const account = accounts.find(a => a.id === Number(id));
  const [showImport, setShowImport] = useState(false);

  const loadData = async () => {
    try {
      const [accountsData, transactionsData] = await Promise.all([
        accountsApi.getAll(),
        transactionsApi.getAll()
      ]);
      // Since we can't directly update the parent's state,
      // we'll reload the page to get fresh data
      window.location.reload();
    } catch (error) {
      console.error('Failed to reload data:', error);
    }
  };

  // TypeScript check for account.id
  if (!account?.id) {
    return <div>Invalid account</div>;
  }

  const accountTransactions = transactions.filter(t => t.account_id === account.id);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{account.name}</h2>
          <button
            onClick={() => setShowImport(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Import Transactions
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-600">Type</p>
            <p className="font-semibold capitalize">{account.type}</p>
          </div>
          <div>
            <p className="text-gray-600">Current Balance</p>
            <p className={`font-semibold ${account.current_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${account.current_balance.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Starting Balance</p>
            <p className="font-semibold">${account.starting_balance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <h3 className="text-xl font-bold p-6 border-b">Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Description</th>
                <th className="text-right p-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {accountTransactions.map(transaction => (
                <tr key={transaction.id} className="border-t">
                  <td className="p-4">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="p-4">{transaction.category}</td>
                  <td className="p-4">{transaction.description}</td>
                  <td className={`p-4 text-right ${
                    transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${transaction.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <ImportWizard
            accountId={account.id} // Now TypeScript knows this is definitely a number
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
