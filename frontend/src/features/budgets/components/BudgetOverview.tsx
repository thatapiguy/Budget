import React from 'react';

const BudgetOverview: React.FC = () => {
  const totalBudget = 2000;
  const spent = 1500;
  const remaining = totalBudget - spent;

  return (
    <div className="budget-overview">
      <h2>Current Month's Overview</h2>
      <div className="budget-stats">
        <div>
          <h3>Total Budget</h3>
          <p>${totalBudget}</p>
        </div>
        <div>
          <h3>Spent</h3>
          <p>${spent}</p>
        </div>
        <div>
          <h3>Remaining</h3>
          <p>${remaining}</p>
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;
