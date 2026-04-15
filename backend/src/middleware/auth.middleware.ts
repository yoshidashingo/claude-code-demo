import { Request, Response, NextFunction } from 'express'
import { verifyToken, JWTPayload } from '../utils/jwt'
import { AuthenticationError } from '../utils/errors'

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided')
    }
    
    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    
    req.user = payload
    next()
  } catch (error) {
    if (error instanceof Error) {
      next(new AuthenticationError(error.message))
    } else {
      next(new AuthenticationError('Invalid token'))
    }
  }
}