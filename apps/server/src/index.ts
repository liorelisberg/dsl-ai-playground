import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import chatRouter from './routes/chat';
import uploadRouter from './api/upload';
import examplesRouter from './api/examples';
import { config, validateConfig } from './config/environment';
import { vectorStore } from './services/vectorStore';
import semanticChatRoutes from './routes/semanticChat';

// Validate configuration
validateConfig();

// Load Swagger documentation
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

const app = express();

// Middleware
app.use(cors({
  origin: [
    config.cors.origin,
    'http://localhost:8080'
  ],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'DSL AI Playground API Documentation'
}));

// Routes
app.use('/api', chatRouter);
app.use('/api', uploadRouter);
app.use('/api', examplesRouter);
app.use('/api/chat', semanticChatRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '2.0.0-semantic'
  });
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
app.listen(config.server.port, async () => {
  console.log(`🚀 Server running on port ${config.server.port}`);
  console.log(`📚 API Documentation: http://localhost:${config.server.port}/api-docs`);
  console.log(`🔧 Environment: ${config.server.nodeEnv}`);
  console.log(`⚡ Rate Limits: ${config.rateLimit.max} requests per ${config.rateLimit.window}s`);
  console.log(`📡 Health check: http://localhost:${config.server.port}/health`);
  console.log(`💬 Chat API: http://localhost:${config.server.port}/api/chat`);
  console.log(`🧠 Semantic Chat API: http://localhost:${config.server.port}/api/chat/semantic`);
  
  // Initialize vector store for knowledge retrieval
  try {
    console.log(`🧠 Initializing knowledge base...`);
    await vectorStore.initialize();
    
    // Auto-load DSL knowledge base
    await vectorStore.autoLoadKnowledgeBase();
    
    const info = await vectorStore.getCollectionInfo();
    console.log(`✅ Knowledge base ready: ${info.count} documents loaded`);
  } catch (error) {
    console.error(`❌ Failed to initialize knowledge base:`, error);
    console.log(`⚠️  Server will continue without knowledge retrieval`);
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
}); 