import express from 'express';
import { getDb } from '../database';

const router = express.Router();

// Get all budgets
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const budgets = await db.all('SELECT * FROM budgets ORDER BY year DESC, period ASC');
    console.log('Retrieved budgets:', budgets);
    res.json(budgets);
  } catch (error) {
    console.error('Error getting budgets:', error);
    res.status(500).json({ error: 'Failed to get budgets' });
  }
});

// Add new budget
router.post('/', async (req, res) => {
  const { category, amount, period, year } = req.body;
  console.log('Received budget data:', req.body);
  
  try {
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO budgets (category, amount, period, year) VALUES (?, ?, ?, ?)',
      [category, amount, period, year || new Date().getFullYear()]
    );
    
    const newBudget = {
      id: result.lastID,
      category,
      amount,
      period,
      year: year || new Date().getFullYear()
    };
    
    console.log('Created new budget:', newBudget);
    res.json(newBudget);
  } catch (err: any) {
    console.error('Error creating budget:', err);
    res.status(500).json({ 
      error: 'Failed to add budget', 
      details: err?.message || 'Unknown error'
    });
  }
});

// Update budget
router.put('/:id', async (req, res) => {
  const { category, amount, period } = req.body;
  const { id } = req.params;
  
  try {
    const db = await getDb();
    await db.run(
      'UPDATE budgets SET category = ?, amount = ?, period = ? WHERE id = ?',
      [category, amount, period, id]
    );
    res.json({ id, category, amount, period });
  } catch (err) {
    console.error('Error updating budget:', err);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

export const budgetRoutes = router;
