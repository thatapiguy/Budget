import React, { useState } from 'react';

export interface AddTransactionFormProps {
  accountId: number;
  onSubmit: (transaction: {
    account_id: number;
    date: string;
    description: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
  }) => void;
}

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ accountId, onSubmit }) => {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    category: '',
    type: 'expense' as 'income' | 'expense'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      account_id: accountId,
      amount: Math.abs(parseFloat(form.amount))
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value as 'income' | 'expense' })}
            className="w-full p-2 border rounded"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>

      {/* ... rest of existing form fields ... */}
    </form>
  );
};

export default AddTransactionForm;
