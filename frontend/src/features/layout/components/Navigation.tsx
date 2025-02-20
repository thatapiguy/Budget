import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plus } from 'lucide-react';
import { AccountData } from '../../../types/api';

interface NavigationProps {
  accounts: AccountData[];
  onAddAccount: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ accounts, onAddAccount }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-20 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation Drawer */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Budget Tracker</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-700 rounded-md"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <Link
                to="/"
                className={`block py-2 px-4 rounded ${
                  location.pathname === '/' ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Budget Overview
              </Link>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <span className="text-sm text-gray-400 font-semibold uppercase">
                  Accounts
                </span>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onAddAccount();
                  }}
                  className="text-sm text-green-400 hover:text-green-300"
                >
                  <Plus size={16} />
                </button>
              </div>
              {accounts.map(account => (
                <Link
                  key={account.id}
                  to={`/accounts/${account.id}`}
                  className={`block py-2 px-4 rounded ${
                    location.pathname === `/accounts/${account.id}`
                      ? 'bg-gray-700'
                      : 'hover:bg-gray-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex justify-between items-center">
                    <span>{account.name}</span>
                    <span
                      className={`text-sm ${
                        account.current_balance >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      ${account.current_balance.toFixed(2)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
