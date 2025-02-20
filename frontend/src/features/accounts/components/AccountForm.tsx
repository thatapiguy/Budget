import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

interface AccountFormProps {
  onSave: (account: {
    name: string;
    type: string;
    starting_balance: number;
  }) => void;
  onCancel: () => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ onSave, onCancel }) => {
  const [account, setAccount] = useState({
    name: '',
    type: 'checking',
    starting_balance: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: account.name,
      type: account.type,
      starting_balance: parseFloat(account.starting_balance)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Account Name</label>
            <input
              type="text"
              value={account.name}
              onChange={(e) => setAccount({ ...account, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Account Type</label>
            <select
              value={account.type}
              onChange={(e) => setAccount({ ...account, type: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="credit">Credit Card</option>
              <option value="cash">Cash</option>
              <option value="investment">Investment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Starting Balance</label>
            <input
              type="number"
              step="0.01"
              value={account.starting_balance}
              onChange={(e) => setAccount({ ...account, starting_balance: e.target.value })}
              className="w-full p-2 border rounded"
              required
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
              Add Account
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AccountForm;
