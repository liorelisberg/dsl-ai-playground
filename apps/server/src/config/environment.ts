import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Google Gemini API Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    embedKey: process.env.GEMINI_EMBED_KEY || '',
  },

  // Session Configuration
  session: {
    secret: process.env.SESSION_SECRET || 'changeme',
  },

  // Rate Limiting Configuration
  rateLimit: {
    window: parseInt(process.env.RATE_LIMIT_WINDOW || '30'),
    max: parseInt(process.env.RATE_LIMIT_MAX || '6'),
  },

  // Message and Upload Limits
  limits: {
    maxMessageChars: parseInt(process.env.MAX_MESSAGE_CHARS || '2000'),
    maxJsonBytes: parseInt(process.env.MAX_JSON_BYTES || '262144'),
  },

  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '3000'),
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  },
};

// Validation function
export const validateConfig = () => {
  const errors: string[] = [];

  if (!config.gemini.apiKey) {
    errors.push('GEMINI_API_KEY is required');
  }

  if (!config.gemini.embedKey) {
    errors.push('GEMINI_EMBED_KEY is required');
  }

  if (errors.length > 0) {
    console.warn('Environment configuration warnings:');
    errors.forEach(error => console.warn(`- ${error}`));
  }

  return errors.length === 0;
}; 