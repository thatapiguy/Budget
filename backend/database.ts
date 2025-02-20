import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

let db: Database | null = null;

export async function setupDatabase() {
  const dbPath = path.resolve(__dirname, 'database.db');
  console.log('Database path:', dbPath);
  
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Enable foreign keys and write-ahead logging
    await db.exec('PRAGMA foreign_keys = ON');
    await db.exec('PRAGMA journal_mode = WAL');

    // Add migration for existing transactions table
    await db.exec(`
      PRAGMA foreign_keys=OFF;
      
      BEGIN TRANSACTION;

      -- Create temporary table
      CREATE TABLE IF NOT EXISTS transactions_backup (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')) DEFAULT 'expense',
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
      );

      -- Copy data from the existing table (if it exists)
      INSERT OR IGNORE INTO transactions_backup 
        SELECT 
          id, 
          account_id, 
          date, 
          category, 
          ABS(amount) as amount, 
          description,
          CASE WHEN amount < 0 THEN 'expense' ELSE 'income' END as type
        FROM transactions;

      -- Drop the old table
      DROP TABLE IF EXISTS transactions;

      -- Rename the new table to the original name
      ALTER TABLE transactions_backup RENAME TO transactions;

      COMMIT;
      
      PRAGMA foreign_keys=ON;
    `);

    // Create tables IF NOT EXISTS (won't affect existing data)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL,
        starting_balance REAL NOT NULL DEFAULT 0,
        current_balance REAL NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')) DEFAULT 'expense',
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        period TEXT NOT NULL CHECK (period IN ('monthly', 'annual')),
        year INTEGER NOT NULL DEFAULT (strftime('%Y', 'now')),
        UNIQUE(category, period, year)
      );
    `);

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
}

export async function getDb() {
  if (!db) {
    await setupDatabase();
  }
  return db!;
}
