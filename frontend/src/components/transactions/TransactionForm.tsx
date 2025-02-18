import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface TransactionFormProps {
  categories: string[];
  accounts: Array<{ id: number; name: string }>;
  onSave: (transaction: {
    account_id: number;
    category: string;
    amount: number;
    date: string;
    description: string;
  }) => void;
  editTransaction?: {
    id: number;
    account_id: number;
    category: string;
    amount: number;
    date: string;
    description: string;
  };
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  categories,
  accounts,
  onSave,
  editTransaction,
  onCancel
}) => {
  const [transaction, setTransaction] = useState({
    account_id: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    if (editTransaction) {
      setTransaction({
        account_id: editTransaction.account_id.toString(),
        category: editTransaction.category,
        amount: editTransaction.amount.toString(),
        date: editTransaction.date,
        description: editTransaction.description
      });
    }
  }, [editTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting transaction:', {
      account_id: parseInt(transaction.account_id),
      category: transaction.category,
      amount: parseFloat(transaction.amount),
      date: transaction.date,
      description: transaction.description
    });
    
    onSave({
      account_id: parseInt(transaction.account_id),
      category: transaction.category,
      amount: parseFloat(transaction.amount),
      date: transaction.date,
      description: transaction.description
    });
    setTransaction({
      account_id: '',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editTransaction ? 'Edit Transaction' : 'Add New Transaction'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Account</label>
            <select
              value={transaction.account_id}
              onChange={(e) => setTransaction({ ...transaction, account_id: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={transaction.category}
              onChange={(e) => setTransaction({ ...transaction, category: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              value={transaction.amount}
              onChange={(e) => setTransaction({ ...transaction, amount: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={transaction.date}
              onChange={(e) => setTransaction({ ...transaction, date: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={transaction.description}
              onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              {editTransaction ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
