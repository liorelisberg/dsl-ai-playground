import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import chatRouter from './api/chat';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:8080',
    'http://localhost:8080',
    'http://localhost:8081', 
    'http://localhost:8082',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api', chatRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Test DSL evaluation endpoint (for testing Zen Engine integration)
app.post('/api/test-dsl', (req, res) => {
  const testDsl = async () => {
    try {
      const { expression, data } = req.body;
      
      if (!expression || !data) {
        return res.status(400).json({ error: 'Missing expression or data' });
      }
      
      console.log('Testing DSL evaluation:', expression, data);
      
      // Simple test without importing frontend service
      res.json({ 
        result: `Testing expression: ${expression} with data: ${JSON.stringify(data)}`,
        message: 'DSL test endpoint working - Zen Engine integration to be tested on frontend'
      });
    } catch (error) {
      console.error('DSL test error:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };
  
  testDsl();
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 