import { Router, Request, Response } from 'express';
import { attachSession } from '../middleware/session';
import { config } from '../config/environment';
import multer from 'multer';

// Extend Request interface to include file property
interface ExtendedRequest extends Request {
  file?: Express.Multer.File;
}

const router: Router = Router();

// In-memory JSON store per session
const jsonStore = new Map<string, unknown>();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.limits.maxJsonBytes, // 50KB limit
  },
  fileFilter: (req: ExtendedRequest, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept if MIME type is application/json OR if filename ends with .json
    if (file.mimetype === 'application/json' || file.originalname.toLowerCase().endsWith('.json')) {
      cb(null, true);
    } else {
      cb(new Error('Only JSON files are allowed'));
    }
  },
});

const uploadHandler = async (req: ExtendedRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Parse JSON
    const jsonContent = req.file.buffer.toString('utf8');
    let parsedJson: unknown;
    
    try {
      parsedJson = JSON.parse(jsonContent);
    } catch (parseError) {
      res.status(400).json({ error: 'Invalid JSON format' });
      return;
    }

    // Store in memory with session ID
    jsonStore.set(req.sessionId, parsedJson);

    // Extract top-level keys for response
    const topLevelKeys = typeof parsedJson === 'object' && parsedJson !== null 
      ? Object.keys(parsedJson as Record<string, unknown>) 
      : [];

    console.log(`JSON uploaded for session ${req.sessionId}: ${req.file.size} bytes, keys: ${topLevelKeys.join(', ')}`);

    res.json({
      sizeBytes: req.file.size,
      topLevelKeys,
      message: 'JSON uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        res.status(413).json({ 
          error: `File too large. Maximum size is ${config.limits.maxJsonBytes} bytes (50KB)` 
        });
        return;
      }
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get uploaded JSON for a session
const getJsonHandler = (req: Request, res: Response): void => {
  const sessionData = jsonStore.get(req.sessionId);
  
  if (!sessionData) {
    res.status(404).json({ error: 'No JSON data found for this session' });
    return;
  }

  res.json({ data: sessionData });
};

// Clear uploaded JSON for a session
const clearJsonHandler = (req: Request, res: Response): void => {
  const deleted = jsonStore.delete(req.sessionId);
  
  res.json({ 
    success: deleted,
    message: deleted ? 'JSON data cleared' : 'No JSON data found'
  });
};

// Routes
router.post('/upload-json', attachSession, upload.single('file'), uploadHandler);
router.get('/json', attachSession, getJsonHandler);
router.delete('/json', attachSession, clearJsonHandler);

// Export the JSON store for use in other services
export { jsonStore };
export default router; 