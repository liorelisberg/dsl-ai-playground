import { Router, Request, Response } from 'express';
import { chatService } from '../services/chat';
import { geminiService } from '../services/gemini';
import { rateLimiter, lengthGuard } from '../middleware/rate-limiter';
import { attachSession } from '../middleware/session';

const router: Router = Router();

const chatHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Invalid message' });
      return;
    }

    // Get chat history
    const history = chatService.getHistory(req.sessionId);

    // Generate response using Gemini API
    const geminiResponse = await geminiService.generateResponse(message, history);
    
    if (geminiResponse.error) {
      console.error('Gemini API Error:', geminiResponse.error);
      // Still return the fallback response to user
    }

    // Store the interaction
    chatService.addTurn(req.sessionId, 'user', message);
    chatService.addTurn(req.sessionId, 'assistant', geminiResponse.text);

    res.json({ text: geminiResponse.text });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @ts-ignore - Express v5 typing issue
router.post('/chat', attachSession, lengthGuard, rateLimiter, chatHandler);

export default router; 