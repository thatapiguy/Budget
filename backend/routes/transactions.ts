import express from 'express';
import { getDb } from '../database';

const router = express.Router();

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const transactions = await db.all('SELECT * FROM transactions ORDER BY date DESC');
    console.log('Retrieved transactions:', transactions);
    res.json(transactions);
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

// Add new transaction
router.post('/', async (req, res) => {
  console.log('Transaction POST request received:', {
    body: req.body,
    contentType: req.get('Content-Type')
  });

  const { account_id, category, amount, date, description } = req.body;

  // Validate data types
  if (typeof account_id !== 'number' || isNaN(account_id)) {
    return res.status(400).json({ 
      error: 'Invalid account_id format',
      received: account_id,
      expectedType: 'number'
    });
  }

  if (typeof amount !== 'number' || isNaN(amount)) {
    return res.status(400).json({ 
      error: 'Invalid amount format',
      received: amount,
      expectedType: 'number'
    });
  }

  try {
    const db = await getDb();
    
    // Check if account exists
    const account = await db.get('SELECT * FROM accounts WHERE id = ?', [account_id]);
    console.log('Found account:', account);

    if (!account) {
      const availableAccounts = await db.all('SELECT id, name FROM accounts');
      console.log('Available accounts:', availableAccounts);
      
      return res.status(400).json({ 
        error: 'Account not found',
        requestedId: account_id,
        availableAccounts 
      });
    }

    // Start transaction
    await db.run('BEGIN TRANSACTION');

    try {
      // Update account balance
      await db.run(
        'UPDATE accounts SET current_balance = current_balance + ? WHERE id = ?',
        [amount, account_id]
      );

      // Insert transaction
      const result = await db.run(
        'INSERT INTO transactions (account_id, category, amount, date, description) VALUES (?, ?, ?, ?, ?)',
        [account_id, category, amount, date, description || '']
      );
      
      await db.run('COMMIT');
      
      const newTransaction = {
        id: result.lastID,
        account_id,
        category,
        amount,
        date,
        description: description || ''
      };
      
      console.log('Transaction created successfully:', newTransaction);
      res.json(newTransaction);
    } catch (error) {
      console.error('Database operation failed:', error);
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error: any) { // Type the error as any to access message and stack
    console.error('Transaction creation failed:', error);
    res.status(500).json({ 
      error: 'Failed to create transaction',
      details: error?.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });
  }
});

// Batch import transactions
router.post('/batch', async (req, res) => {
  const { transactions } = req.body;
  
  if (!Array.isArray(transactions)) {
    return res.status(400).json({ error: 'Invalid transactions data' });
  }

  try {
    const db = await getDb();
    await db.run('BEGIN TRANSACTION');

    try {
      for (const transaction of transactions) {
        const { account_id, category, amount, date, description } = transaction;

        // Validate required fields
        if (!account_id || !amount || !date) {
          throw new Error('Missing required fields');
        }

        // Check if account exists
        const account = await db.get('SELECT * FROM accounts WHERE id = ?', [account_id]);
        if (!account) {
          throw new Error(`Account ${account_id} not found`);
        }

        // Update account balance
        await db.run(
          'UPDATE accounts SET current_balance = current_balance + ? WHERE id = ?',
          [amount, account_id]
        );

        // Insert transaction
        await db.run(
          'INSERT INTO transactions (account_id, category, amount, date, description) VALUES (?, ?, ?, ?, ?)',
          [account_id, category, amount, date, description || '']
        );
      }

      await db.run('COMMIT');
      res.json({ 
        success: true, 
        count: transactions.length,
        message: `Successfully imported ${transactions.length} transactions`
      });
    } catch (error: any) {
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error: any) {
    console.error('Batch import failed:', error);
    res.status(500).json({ 
      error: 'Failed to import transactions',
      message: error.message
    });
  }
});

// Update transaction
router.put('/:id', async (req, res) => {
  const { account_id, category, amount, date, description } = req.body;
  const { id } = req.params;
  
  try {
    const db = await getDb();
    await db.run(
      'UPDATE transactions SET account_id = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?',
      [account_id, category, amount, date, description, id]
    );
    res.json({ id, account_id, category, amount, date, description });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const db = await getDb();
    // First, get the transaction to update the account balance
    const transaction = await db.get('SELECT * FROM transactions WHERE id = ?', [id]);
    if (transaction) {
      await db.run(
        'UPDATE accounts SET current_balance = current_balance - ? WHERE id = ?',
        [transaction.amount, transaction.account_id]
      );
    }
    
    await db.run('DELETE FROM transactions WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

export const transactionRoutes = router;
