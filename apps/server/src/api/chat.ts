import { Router } from 'express';
import { chatService } from '../services/chat';
import { rateLimiter } from '../middleware/rate-limiter';
import { attachSession } from '../middleware/session';

const router = Router();

router.post('/chat', attachSession, rateLimiter, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message' });
    }

    // Get chat history
    const history = chatService.getHistory(req.sessionId);

    // TODO: Implement Gemini API call
    const response = "This is a placeholder response. Gemini integration pending.";

    // Store the interaction
    chatService.addTurn(req.sessionId, 'user', message);
    chatService.addTurn(req.sessionId, 'assistant', response);

    res.json({ text: response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 