import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import chatRouter from './api/chat';

// Load environment variables
dotenv.config();

// Load Swagger documentation
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

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

// Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'DSL AI Playground API Documentation'
}));

// Routes
app.use('/api', chatRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// DSL evaluation endpoint using Zen Engine
app.post('/api/evaluate-dsl', (req, res) => {
  const handleDslEvaluation = async () => {
    try {
      const { expression, data } = req.body;
      
      if (!expression || data === undefined) {
        return res.status(400).json({ error: 'Missing expression or data' });
      }
      
      console.log('DSL evaluation request:', { expression, data });
      
      // Import and use the backend DSL service
      const { evaluateExpression } = await import('./services/dslService');
      const result = await evaluateExpression(expression, data);
      
      res.json(result);
    } catch (error) {
      console.error('DSL evaluation error:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };
  
  handleDslEvaluation();
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api-docs`);
}); 