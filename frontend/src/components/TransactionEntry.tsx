import React, { useState } from 'react';

interface Transaction {
  amount: number;
  category: string;
  description: string;
  date: string;
}

const TransactionEntry: React.FC = () => {
  const [transaction, setTransaction] = useState<Transaction>({
    amount: 0,
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Transaction submitted:', transaction);
    // TODO: Send to backend
    setTransaction({
      amount: 0,
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="transaction-entry">
      <h2>Add New Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Amount:
            <input
              type="number"
              value={transaction.amount}
              onChange={(e) => setTransaction({...transaction, amount: parseFloat(e.target.value)})}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Category:
            <select
              value={transaction.category}
              onChange={(e) => setTransaction({...transaction, category: e.target.value})}
              required
            >
              <option value="">Select category</option>
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="entertainment">Entertainment</option>
              <option value="utilities">Utilities</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Description:
            <input
              type="text"
              value={transaction.description}
              onChange={(e) => setTransaction({...transaction, description: e.target.value})}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Date:
            <input
              type="date"
              value={transaction.date}
              onChange={(e) => setTransaction({...transaction, date: e.target.value})}
              required
            />
          </label>
        </div>
        <button type="submit">Add Transaction</button>
      </form>
    </div>
  );
};

export default TransactionEntry;
