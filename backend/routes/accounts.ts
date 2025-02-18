import express from 'express';
import { getDb } from '../database';

const router = express.Router();

// Get all accounts
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const accounts = await db.all('SELECT * FROM accounts ORDER BY name');
    res.json(accounts);
  } catch (error) {
    console.error('Error getting accounts:', error);
    res.status(500).json({ error: 'Failed to get accounts' });
  }
});

// Add new account
router.post('/', async (req, res) => {
  const { name, type, starting_balance } = req.body;
  
  try {
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO accounts (name, type, starting_balance, current_balance) VALUES (?, ?, ?, ?)',
      [name, type, starting_balance, starting_balance]
    );
    
    const newAccount = {
      id: result.lastID,
      name,
      type,
      starting_balance,
      current_balance: starting_balance
    };
    
    res.json(newAccount);
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Update account balance
router.put('/:id/balance', async (req, res) => {
  const { id } = req.params;
  const { current_balance } = req.body;
  
  try {
    const db = await getDb();
    await db.run(
      'UPDATE accounts SET current_balance = ? WHERE id = ?',
      [current_balance, id]
    );
    res.json({ id, current_balance });
  } catch (error) {
    console.error('Error updating account balance:', error);
    res.status(500).json({ error: 'Failed to update account balance' });
  }
});

export const accountRoutes = router;
