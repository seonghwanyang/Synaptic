import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../auth/supabase';

// Module declaration for Express types
export {}; // This makes this file a module

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        role?: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token with Supabase
    const user = await verifyToken(token);

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Optional auth middleware - doesn't fail if no token
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = await verifyToken(token);

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    }

    next();
  } catch (error) {
    // Continue without user context
    next();
  }
};
