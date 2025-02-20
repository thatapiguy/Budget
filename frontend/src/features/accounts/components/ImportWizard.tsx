import React, { useState, useEffect } from 'react';
import { read, utils } from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

// Update API URL to use current hostname
const API_URL = `http://${window.location.hostname}:3001/api`;

interface ImportWizardProps {
  accountId: number;
  onImportComplete: () => void;
  onCancel: () => void;
}

interface ColumnMapping {
  date: string;
  description: string;
  amount: string;
  category: string;
}

const DATE_FORMATS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2023)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2023)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2023-12-31)' },
  { value: 'MM/DD/YY', label: 'MM/DD/YY (12/31/23)' },
  { value: 'DD/MM/YY', label: 'DD/MM/YY (31/12/23)' },
  { value: 'MM-DD-YYYY', label: 'MM-DD-YYYY (12-31-2023)' },
  { value: 'YYYY.MM.DD', label: 'YYYY.MM.DD (2023.12.31)' },
];

// Common column name patterns
const COLUMN_PATTERNS = {
  date: ['date', 'trans date', 'transaction date', 'posted', 'posting date'],
  amount: ['amount', 'sum', 'transaction amount', 'debit', 'credit', 'value'],
  description: ['description', 'desc', 'memo', 'narrative', 'transaction description', 'details', 'transaction details'],
  category: ['category', 'type', 'transaction type', 'classification']
};

const ImportWizard: React.FC<ImportWizardProps> = ({ accountId, onImportComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [fileData, setFileData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({
    date: '',
    description: '',
    amount: '',
    category: ''
  });
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [preview, setPreview] = useState<any[]>([]);

  // Auto-detect column mappings based on column names
  const detectColumnMappings = (headers: string[]) => {
    const newMapping: Partial<ColumnMapping> = {};
    
    headers.forEach(header => {
      const lowerHeader = header.toLowerCase().trim();
      
      // Check each field type
      Object.entries(COLUMN_PATTERNS).forEach(([field, patterns]) => {
        if (patterns.some(pattern => lowerHeader.includes(pattern))) {
          newMapping[field as keyof ColumnMapping] = header;
        }
      });
    });

    return { ...mapping, ...newMapping };
  };

  // Update preview whenever mapping or dateFormat changes
  useEffect(() => {
    if (fileData.length && (mapping.date || mapping.amount)) {
      updatePreview();
    }
  }, [mapping, dateFormat]);

  const updatePreview = () => {
    const previewData = fileData.slice(0, 5).map(row => {
      const rowObj: any = {};
      columns.forEach((col, index) => {
        rowObj[col] = row[index];
      });
      
      return {
        date: rowObj[mapping.date],
        description: rowObj[mapping.description] || '',
        amount: rowObj[mapping.amount],
        category: rowObj[mapping.category] || ''
      };
    });
    setPreview(previewData);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length > 0) {
      const headers = jsonData[0] as string[];
      setColumns(headers);
      setFileData(jsonData.slice(1));
      
      // Auto-detect column mappings
      const detectedMapping = detectColumnMappings(headers);
      setMapping(detectedMapping as ColumnMapping);
      
      setStep(2);
    }
  };

  const handleImport = async () => {
    const formattedData = fileData.map(row => {
      const rowObj: any = {};
      columns.forEach((col, index) => {
        rowObj[col] = row[index];
      });

      const { amount, type } = parseAmount(rowObj[mapping.amount]);

      return {
        account_id: accountId,
        date: formatDate(rowObj[mapping.date], dateFormat),
        description: rowObj[mapping.description] || '',
        amount: amount,
        type: type,
        category: rowObj[mapping.category] || 'Uncategorized'
      };
    });

    try {
      console.log('Sending request to:', `${API_URL}/transactions/batch`);
      console.log('Request payload:', { transactions: formattedData });

      const response = await fetch(`${API_URL}/transactions/batch`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ transactions: formattedData })
      });

      if (!response.ok) {
        let errorMessage = 'Import failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, get the status text
          errorMessage = `Import failed: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Import successful:', result);
      onImportComplete();
    } catch (error) {
      console.error('Import error:', error);
      alert(error instanceof Error ? error.message : 'Failed to import transactions');
    }
  };

  const formatDate = (dateValue: any, format: string): string => {
    try {
      // Handle Excel serial date numbers
      if (typeof dateValue === 'number') {
        // Convert Excel date serial number to JavaScript Date
        // Excel's date system starts from 1900-01-01, and uses 1900 as a leap year (which it wasn't)
        // We need to adjust for this Excel bug by subtracting 1 from dates after February 28, 1900
        const excelDate = new Date((dateValue - (dateValue > 60 ? 2 : 1)) * 86400000 + new Date(1900, 0, 1).getTime());
        return excelDate.toISOString().split('T')[0];
      }

      // Handle string dates
      const dateStr = String(dateValue);
      let parts: string[];
      let year: string, month: string, day: string;

      // Remove any leading/trailing whitespace and handle various separators
      const cleanDateStr = dateStr.trim().replace(/[./]/g, '/');

      switch (format) {
        case 'MM/DD/YYYY':
        case 'MM/DD/YY':
          parts = cleanDateStr.split('/');
          month = parts[0].padStart(2, '0');
          day = parts[1].padStart(2, '0');
          year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
          break;
          
        case 'DD/MM/YYYY':
        case 'DD/MM/YY':
          parts = cleanDateStr.split('/');
          day = parts[0].padStart(2, '0');
          month = parts[1].padStart(2, '0');
          year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
          break;
          
        case 'YYYY-MM-DD':
          parts = cleanDateStr.split('-');
          year = parts[0];
          month = parts[1];
          day = parts[2];
          break;
          
        case 'MM-DD-YYYY':
          parts = cleanDateStr.split('-');
          month = parts[0].padStart(2, '0');
          day = parts[1].padStart(2, '0');
          year = parts[2];
          break;
          
        case 'YYYY.MM.DD':
          parts = cleanDateStr.split('.');
          year = parts[0];
          month = parts[1];
          day = parts[2];
          break;
          
        default:
          throw new Error(`Unsupported date format: ${format}`);
      }

      // Validate date parts
      if (!year || !month || !day) {
        throw new Error('Invalid date parts');
      }

      // Ensure 4-digit year
      if (year.length === 2) {
        year = `20${year}`;
      }

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Date parsing error:', { value: dateValue, format, error });
      return String(dateValue); // Return original value if parsing fails
    }
  };

  const parseAmount = (amount: any): { amount: number, type: 'income' | 'expense' } => {
    try {
      let value: number;
      let isNegative = false;

      // Handle if amount is already a number
      if (typeof amount === 'number') {
        value = amount;
        isNegative = amount < 0;
      } else {
        // Convert to string if it's not already
        const amountStr = String(amount).trim();

        // Check for parentheses (negative)
        if (amountStr.startsWith('(') && amountStr.endsWith(')')) {
          isNegative = true;
          value = parseFloat(amountStr.replace(/[()$,]/g, ''));
        } else {
          // Remove currency symbols and commas
          value = parseFloat(amountStr.replace(/[$,]/g, ''));
          // Check if it's already negative
          isNegative = value < 0;
        }
      }

      // Handle credit/debit columns
      const columnName = mapping.amount.toLowerCase();
      if (columnName.includes('debit')) {
        isNegative = true;
      } else if (columnName.includes('credit')) {
        isNegative = false;
      }

      // Make sure we have a positive amount
      value = Math.abs(value);

      return {
        amount: value,
        // If negative, it's an expense. If positive, it's income
        type: isNegative ? 'expense' : 'income'
      };
    } catch (error) {
      console.error('Error parsing amount:', amount, error);
      return { amount: 0, type: 'expense' };
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Import Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <p>Select a CSV or Excel file to import:</p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="grid gap-4">
              {['date', 'amount', 'description', 'category'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {field} Column {field === 'date' || field === 'amount' ? '*' : '(Optional)'}
                  </label>
                  <select
                    value={mapping[field as keyof ColumnMapping]}
                    onChange={(e) => setMapping({ ...mapping, [field]: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select column</option>
                    {columns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium mb-1">Date Format</label>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {DATE_FORMATS.map(format => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Preview */}
            {preview.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Preview</h3>
                <div className="overflow-x-auto border rounded">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="border-b">
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-left p-2">Category</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-right p-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, i) => {
                        const { amount, type } = parseAmount(row.amount);
                        return (
                          <tr key={i} className="border-b">
                            <td className="p-2">{formatDate(row.date, dateFormat)}</td>
                            <td className="p-2">{row.description}</td>
                            <td className="p-2">{row.category}</td>
                            <td className="p-2">
                              <span className={type === 'income' ? 'text-green-600' : 'text-red-600'}>
                                {type === 'income' ? '↑ Income' : '↓ Expense'}
                              </span>
                            </td>
                            <td className={`p-2 text-right ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                              ${amount.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!mapping.date || !mapping.amount}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Import
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImportWizard;
