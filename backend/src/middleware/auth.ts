import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../config/supabase'

// Extend Express Request type
export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    user_metadata?: any
  }
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    
    // Debug logging
    console.log('Auth middleware:', {
      method: req.method,
      url: req.url,
      hasAuthHeader: !!authHeader,
      authHeader: authHeader ? authHeader.substring(0, 30) + '...' : 'None'
    })
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Authorization header required',
        code: 'NO_AUTH_HEADER'
      })
    }

    const token = authHeader.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        error: 'Token required',
        code: 'NO_TOKEN'
      })
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      console.error('Token verification failed:', error)
      return res.status(401).json({
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      })
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email!,
      user_metadata: user.user_metadata
    }

    console.log('Auth successful for user:', user.id)
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({
      error: 'Authentication error',
      code: 'AUTH_ERROR'
    })
  }
}

// Optional auth middleware - doesn't fail if no token
export const optionalAuthenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  
  if (!authHeader) {
    return next()
  }

  // Token이 있으면 검증 시도
  await authenticate(req, res, next)
}

// For backward compatibility
export const authMiddleware = authenticate
export const optionalAuthMiddleware = optionalAuthenticate