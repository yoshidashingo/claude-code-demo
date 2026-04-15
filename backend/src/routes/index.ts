import { Router } from 'express'
import taskRoutes from './task.routes'

const router = Router()

// API routes
router.use('/tasks', taskRoutes)

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router