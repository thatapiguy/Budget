import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Edit, Trash } from 'lucide-react';
import { formatDate } from '../../../utils/dateUtils';
import { Transaction } from '../../../types';

interface TransactionsListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: number) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, onEdit, onDelete }) => {
  const formatAmount = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  const calculateTotals = () => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === 'income') {
          acc.deposits += t.amount;
        } else {
          acc.payments += t.amount;
        }
        return acc;
      },
      { deposits: 0, payments: 0 }
    );
  };

  const totals = calculateTotals();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Description</th>
                <th className="text-left p-3">Category</th>
                <th className="text-right p-3">Payment</th>
                <th className="text-right p-3">Deposit</th>
                {(onEdit || onDelete) && <th className="text-right p-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{formatDate(transaction.date)}</td>
                  <td className="p-3">{transaction.description}</td>
                  <td className="p-3">{transaction.category}</td>
                  <td className="p-3 text-right text-red-600">
                    {transaction.type === 'expense' ? formatAmount(transaction.amount) : ''}
                  </td>
                  <td className="p-3 text-right text-green-600">
                    {transaction.type === 'income' ? formatAmount(transaction.amount) : ''}
                  </td>
                  {(onEdit || onDelete) && (
                    <td className="p-2 text-right">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(transaction)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(transaction.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash size={16} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-medium">
              <tr>
                <td colSpan={3} className="p-3 text-right">Subtotals:</td>
                <td className="p-3 text-right text-red-600">
                  {formatAmount(totals.payments)}
                </td>
                <td className="p-3 text-right text-green-600">
                  {formatAmount(totals.deposits)}
                </td>
              </tr>
              <tr className="border-t-2">
                <td colSpan={3} className="p-3 text-right font-bold">Net Total:</td>
                <td colSpan={2} className={`p-3 text-right font-bold ${
                  totals.deposits - totals.payments >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatAmount(totals.deposits - totals.payments)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
