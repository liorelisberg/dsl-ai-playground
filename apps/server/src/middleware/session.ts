import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

declare global {
  namespace Express {
    interface Request {
      sessionId: string;
    }
  }
}

export const attachSession = (req: Request, res: Response, next: NextFunction) => {
  let sessionId = req.cookies.sessionId;
  
  if (!sessionId) {
    sessionId = uuidv4();
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
  }
  
  req.sessionId = sessionId;
  next();
}; 