import { clerkMiddleware, getAuth } from '@clerk/express';
import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

/**
 * Middleware to require authentication for specific routes.
 * Uses getAuth() to check for a valid session.
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      logger.warn(`Unauthorized access attempt to ${req.originalUrl} from ${req.ip}`);
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    next();
  } catch (error) {
    logger.error('Authentication check failed:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Export base clerkMiddleware for use in server.ts
export { clerkMiddleware };
