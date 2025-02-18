import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface MonthPickerProps {
  currentDate: Date;
  onChange: (date: Date) => void;
}

const MonthPicker: React.FC<MonthPickerProps> = ({ currentDate, onChange }) => {
  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    onChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    onChange(newDate);
  };

  const handleMonthSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(event.target.value));
    onChange(newDate);
  };

  const handleYearSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(event.target.value));
    onChange(newDate);
  };

  const currentYear = currentDate.getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => new Date(2000, i).toLocaleString('default', { month: 'long' }));

  return (
    <Card className="border-none shadow-sm">
      <CardContent>
        <div className="flex items-center justify-between py-4">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="text-gray-600" />
          </button>
          
          <div className="flex gap-2">
            <select
              value={currentDate.getMonth()}
              onChange={handleMonthSelect}
              className="px-2 py-1 border rounded"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
            
            <select
              value={currentDate.getFullYear()}
              onChange={handleYearSelect}
              className="px-2 py-1 border rounded"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="text-gray-600" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthPicker;
