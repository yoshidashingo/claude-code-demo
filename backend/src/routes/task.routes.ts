import { Router } from 'express'
// import { authenticate } from '../middleware/auth.middleware'
import { mockAuthenticate as authenticate } from '../middleware/mock-auth.middleware'
import { validate, validateQuery } from '../middleware/validation.middleware'
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  taskQuerySchema
} from '../validators/task.validator'
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStatistics
} from '../controllers/task.controller'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Task CRUD operations
router.post('/', validate(createTaskSchema), createTask)
router.get('/', validateQuery(taskQuerySchema), getTasks)
router.get('/statistics', getTaskStatistics)
router.get('/:id', getTaskById)
router.put('/:id', validate(updateTaskSchema), updateTask)
router.patch('/:id/status', validate(updateTaskStatusSchema), updateTaskStatus)
router.delete('/:id', deleteTask)

export default router