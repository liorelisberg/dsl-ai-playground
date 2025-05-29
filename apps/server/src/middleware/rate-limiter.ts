import { Request, Response, NextFunction } from 'express';

// Rate limiting for FREE tier Gemini 2.5 Flash Preview
const MAX_REQUESTS_PER_MINUTE = 10; // Free tier limit
const MAX_REQUESTS_PER_DAY = 500;   // Free tier limit
const WINDOW_MS = 60 * 1000; // 1 minute
const DAY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface RateLimit {
  timestamp: number;
  count: number;
  dailyCount: number;
  dailyTimestamp: number;
}

const rateLimits = new Map<string, RateLimit>();

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
  
  // Reset minute counter if window expired
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
  
  // Check minute limit (FREE tier: 10 RPM)
  if (userRateLimit.count > MAX_REQUESTS_PER_MINUTE) {
    console.log(`Rate limit exceeded for ${key}: ${userRateLimit.count} requests in last minute`);
    return res.status(429).json({ 
      error: 'Rate limit exceeded. Free tier allows 10 requests per minute. Please wait before trying again.',
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
  res.setHeader('X-RateLimit-Limit-Minute', MAX_REQUESTS_PER_MINUTE);
  res.setHeader('X-RateLimit-Remaining-Minute', Math.max(0, MAX_REQUESTS_PER_MINUTE - userRateLimit.count));
  res.setHeader('X-RateLimit-Limit-Day', MAX_REQUESTS_PER_DAY);
  res.setHeader('X-RateLimit-Remaining-Day', Math.max(0, MAX_REQUESTS_PER_DAY - userRateLimit.dailyCount));
  
  next();
}; 