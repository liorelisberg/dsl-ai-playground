import { Request, Response, NextFunction } from 'express';

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW) * 1000 || 30000; // 30 seconds default
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX) || 6; // 6 requests default

interface RateLimit {
  timestamp: number;
  count: number;
}

const rateLimits = new Map<string, RateLimit>();

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const key = req.sessionId || req.ip || 'unknown';
  const now = Date.now();
  
  // Clean up old entries
  for (const [storedKey, limit] of rateLimits.entries()) {
    if (now - limit.timestamp > WINDOW_MS) {
      rateLimits.delete(storedKey);
    }
  }
  
  const userRateLimit = rateLimits.get(key) || { timestamp: now, count: 0 };
  
  if (now - userRateLimit.timestamp > WINDOW_MS) {
    userRateLimit.timestamp = now;
    userRateLimit.count = 1;
  } else {
    userRateLimit.count++;
  }
  
  rateLimits.set(key, userRateLimit);
  
  if (userRateLimit.count > MAX_REQUESTS) {
    console.log(`Rate limit exceeded for ${key}`);
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  
  next();
}; 