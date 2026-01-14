import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { config } from './config'
import { errorHandler, notFoundHandler } from './middleware/error.middleware'
import { logger } from './utils/logger'
import routes from './routes'

export const createApp = (): Application => {
  const app = express()

  // Security middleware
  app.use(helmet())

  // CORS configuration
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: true,
      optionsSuccessStatus: 200
    })
  )

  // Rate limiting
  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later'
  })
  app.use('/api', limiter)

  // Body parsing
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Request logging
  app.use((req, res, next) => {
    logger.http(`${req.method} ${req.originalUrl}`)
    next()
  })

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // API routes
  app.use('/api', routes)

  // Error handling
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}