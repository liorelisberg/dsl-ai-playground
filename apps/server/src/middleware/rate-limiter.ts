import { Request, Response, NextFunction } from 'express';
import { config } from '../config/environment';

// Rate limiting for FREE tier Gemini 2.5 Flash Preview
const MAX_REQUESTS_PER_MINUTE = 10; // Free tier limit
const MAX_REQUESTS_PER_DAY = 500;   // Free tier limit
const WINDOW_MS = config.rateLimit.window * 1000; // Convert to milliseconds
const DAY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface RateLimit {
  timestamp: number;
  count: number;
  dailyCount: number;
  dailyTimestamp: number;
}

const rateLimits = new Map<string, RateLimit>();

// Length guard middleware - checks message character limit
export const lengthGuard = (req: Request, res: Response, next: NextFunction) => {
  const { message } = req.body;
  
  if (message && typeof message === 'string' && message.length > config.limits.maxMessageChars) {
    console.log(`Message length exceeded for ${req.sessionId}: ${message.length} chars (max: ${config.limits.maxMessageChars})`);
    return res.status(413).json({ 
      error: `Message too long. Maximum ${config.limits.maxMessageChars} characters allowed.`,
      maxLength: config.limits.maxMessageChars,
      currentLength: message.length
    });
  }
  
  next();
};

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const key = req.sessionId || req.ip || 'unknown';
  const now = Date.now();
  
  // Clean up old entries
  for (const [storedKey, limit] of rateLimits.entries()) {
    if (now - limit.timestamp > WINDOW_MS && now - limit.dailyTimestamp > DAY_MS) {
      rateLimits.delete(storedKey);
    }
  }
  
  const userRateLimit = rateLimits.get(key) || { 
    timestamp: now, 
    count: 0, 
    dailyCount: 0, 
    dailyTimestamp: now 
  };
  
  // Reset window counter if window expired
  if (now - userRateLimit.timestamp > WINDOW_MS) {
    userRateLimit.timestamp = now;
    userRateLimit.count = 1;
  } else {
    userRateLimit.count++;
  }
  
  // Reset daily counter if day expired
  if (now - userRateLimit.dailyTimestamp > DAY_MS) {
    userRateLimit.dailyTimestamp = now;
    userRateLimit.dailyCount = 1;
  } else {
    userRateLimit.dailyCount++;
  }
  
  rateLimits.set(key, userRateLimit);
  
  // Check session-based limit (6 requests / 30s per session as per requirements)
  if (userRateLimit.count > config.rateLimit.max) {
    console.log(`Rate limit exceeded for session ${key}: ${userRateLimit.count} requests in last ${config.rateLimit.window}s`);
    return res.status(429).json({ 
      error: `Rate limit exceeded. Maximum ${config.rateLimit.max} requests per ${config.rateLimit.window} seconds per session.`,
      retryAfter: Math.ceil((WINDOW_MS - (now - userRateLimit.timestamp)) / 1000)
    });
  }
  
  // Check daily limit (FREE tier: 500 RPD)
  if (userRateLimit.dailyCount > MAX_REQUESTS_PER_DAY) {
    console.log(`Daily rate limit exceeded for ${key}: ${userRateLimit.dailyCount} requests today`);
    return res.status(429).json({ 
      error: 'Daily rate limit exceeded. Free tier allows 500 requests per day. Please try again tomorrow.',
      retryAfter: Math.ceil((DAY_MS - (now - userRateLimit.dailyTimestamp)) / 1000)
    });
  }
  
  // Add headers to inform client about limits
  res.setHeader('X-RateLimit-Limit-Window', config.rateLimit.max);
  res.setHeader('X-RateLimit-Remaining-Window', Math.max(0, config.rateLimit.max - userRateLimit.count));
  res.setHeader('X-RateLimit-Limit-Day', MAX_REQUESTS_PER_DAY);
  res.setHeader('X-RateLimit-Remaining-Day', Math.max(0, MAX_REQUESTS_PER_DAY - userRateLimit.dailyCount));
  res.setHeader('X-RateLimit-Window-Seconds', config.rateLimit.window);
  
  next();
}; 