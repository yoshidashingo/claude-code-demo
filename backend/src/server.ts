import { createApp } from './app'
import { config } from './config'
import { logger } from './utils/logger'
import { prisma } from './utils/prisma'

const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    await prisma.$connect()
    logger.info('Database connected successfully')

    const app = createApp()

    const server = app.listen(config.server.port, () => {
      logger.info(`Server is running on port ${config.server.port}`)
      logger.info(`Environment: ${config.server.nodeEnv}`)
    })

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} signal received: closing HTTP server`)
      server.close(() => {
        logger.info('HTTP server closed')
      })

      await prisma.$disconnect()
      logger.info('Database connection closed')
      process.exit(0)
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))
  } catch (error) {
    logger.error('Failed to start server:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

void startServer()