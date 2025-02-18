import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Budget {
  category: string;
  amount: number;
  year?: number;
}

interface Transaction {
  category: string;
  amount: number;
  date: string;
}

interface BudgetCategoryProps {
  title: string;
  budgets: Record<string, Budget>;
  transactions: Transaction[];
  period: 'monthly' | 'annual';
  currentYear?: number;
  onAddBudget?: () => void;
}

const BudgetCategory: React.FC<BudgetCategoryProps> = ({ 
  title, 
  budgets, 
  transactions, 
  period,
  currentYear = new Date().getFullYear(),
  onAddBudget
}) => {
  const getFilteredTransactions = (category: string, budget: Budget) => {
    return transactions.filter(t => {
      const transactionYear = new Date(t.date).getFullYear();
      return t.category === category && 
        (period === 'monthly' || transactionYear === (budget.year || currentYear));
    });
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {title} 
            {period === 'annual' && <span className="text-sm text-gray-500 ml-2">({currentYear})</span>}
          </CardTitle>
          <button
            onClick={onAddBudget}
            className="flex items-center gap-2 text-sm bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus size={16} /> Add Budget
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {Object.entries(budgets).map(([category, budget]) => {
          const categoryTransactions = getFilteredTransactions(category, budget);
          const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
          const percentage = (spent / budget.amount) * 100;
          
          return (
            <div key={category} className="mb-4">
              <div className="flex justify-between mb-2">
                <span>{category}</span>
                <div>
                  <span className="text-gray-600">${spent}</span>
                  <span className="mx-1">/</span>
                  <span>${budget.amount}</span>
                  {period === 'annual' && budget.year && (
                    <span className="text-sm text-gray-500 ml-2">({budget.year})</span>
                  )}
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-full rounded-full ${
                    percentage > 100 ? 'bg-red-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default BudgetCategory;
