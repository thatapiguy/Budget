import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface BudgetFormProps {
  onSave: (budget: { 
    category: string; 
    amount: number; 
    period: 'monthly' | 'annual';
    year?: number;
  }) => void;
  onCancel: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onSave, onCancel }) => {
  const currentYear = new Date().getFullYear();
  const [budget, setBudget] = useState({
    category: '',
    amount: '',
    period: 'monthly' as 'monthly' | 'annual',
    year: currentYear
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate array of years (current year and 2 years into future)
  const years = Array.from(
    { length: 3 }, 
    (_, i) => currentYear + i
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      await onSave({
        category: budget.category,
        amount: parseFloat(budget.amount),
        period: budget.period,
        year: budget.period === 'annual' ? budget.year : undefined
      });
      setBudget({ category: '', amount: '', period: 'monthly', year: currentYear });
    } catch (err) {
      console.error('Form submission error:', err);
      setError('Failed to save budget. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Budget Category</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category Name</label>
            <input
              type="text"
              value={budget.category}
              onChange={(e) => setBudget({ ...budget, category: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Budget Amount</label>
            <input
              type="number"
              value={budget.amount}
              onChange={(e) => setBudget({ ...budget, amount: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Period</label>
            <select
              value={budget.period}
              onChange={(e) => setBudget({ ...budget, period: e.target.value as 'monthly' | 'annual' })}
              className="w-full p-2 border rounded"
            >
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>

          {budget.period === 'annual' && (
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <select
                value={budget.year}
                onChange={(e) => setBudget({ ...budget, year: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:bg-indigo-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Add Budget Category'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BudgetForm;
