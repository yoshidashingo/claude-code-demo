import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/errors'
import { logger } from '../utils/logger'
import { config } from '../config'

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.error(`${err.code}: ${err.message}`)
    res.status(err.statusCode).json({
      error: {
        code: err.code || 'ERROR',
        message: err.message,
        ...(config.server.isDevelopment && { stack: err.stack })
      }
    })
  } else {
    logger.error(`Unexpected error: ${err.message}`)
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: config.server.isDevelopment ? err.message : 'Internal server error',
        ...(config.server.isDevelopment && { stack: err.stack })
      }
    })
  }
}

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.originalUrl} not found`
    }
  })
}