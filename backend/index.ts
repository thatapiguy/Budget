import express from 'express';
import cors from 'cors';
import { setupDatabase } from './database';
import { transactionRoutes } from './routes/transactions';
import { budgetRoutes } from './routes/budgets';
import { accountRoutes } from './routes/accounts';

const app = express();
const port = 3001;
const host = '0.0.0.0';  // Listen on all network interfaces

// Update CORS configuration to allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.68.88:3000'
];

app.use(cors({
  origin: function(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));

// Increase payload limit for batch imports
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/accounts', accountRoutes);  // Add accounts routes

setupDatabase().then(() => {
  app.listen(port, host, () => {
    console.log(`Backend server running at http://${host}:${port}`);
  });
});
