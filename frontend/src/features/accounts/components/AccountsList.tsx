import React from 'react';
import { Link } from 'react-router-dom';

interface Account {
  id: number;
  name: string;
  type: string;
  current_balance: number;
}

interface AccountsListProps {
  accounts: Account[];
}

export const AccountsList: React.FC<AccountsListProps> = ({ accounts }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {accounts.map(account => (
        <Link
          key={account.id}
          to={`/accounts/${account.id}`}
          className="p-4 border rounded-lg hover:bg-gray-50"
        >
          <h3 className="font-semibold">{account.name}</h3>
          <p className="text-gray-600">{account.type}</p>
          <p className={`text-lg ${account.current_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${account.current_balance.toFixed(2)}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default AccountsList;
