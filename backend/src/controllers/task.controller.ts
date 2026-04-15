import { Request, Response, NextFunction } from 'express'
import { taskService } from '../services/task.service'
import { ValidationError } from '../utils/errors'

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    const task = await taskService.create(userId, req.body)
    res.status(201).json({ task })
  } catch (error) {
    next(error)
  }
}

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    const { tasks, total } = await taskService.findAll(userId, req.query as any)
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    res.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    const task = await taskService.findById(req.params.id, userId)
    res.json({ task })
  } catch (error) {
    next(error)
  }
}

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    const task = await taskService.update(req.params.id, userId, req.body)
    res.json({ task })
  } catch (error) {
    next(error)
  }
}

export const updateTaskStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    const task = await taskService.updateStatus(
      req.params.id,
      userId,
      req.body.status
    )
    res.json({ task })
  } catch (error) {
    next(error)
  }
}

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    await taskService.delete(req.params.id, userId)
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    next(error)
  }
}

export const getTaskStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    const statistics = await taskService.getStatistics(userId)
    res.json({ statistics })
  } catch (error) {
    next(error)
  }
}