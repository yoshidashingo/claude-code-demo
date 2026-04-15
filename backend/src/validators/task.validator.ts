import Joi from 'joi'

export const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).optional().allow(''),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').required(),
  dueDate: Joi.date().iso().min('now').optional().allow(null),
  categoryId: Joi.string().uuid().optional().allow(null)
})

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  description: Joi.string().max(1000).optional().allow(''),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED').optional(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional(),
  dueDate: Joi.date().iso().min('now').optional().allow(null),
  categoryId: Joi.string().uuid().optional().allow(null)
}).min(1)

export const updateTaskStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED').required()
})

export const taskQuerySchema = Joi.object({
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED').optional(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional(),
  categoryId: Joi.string().uuid().optional(),
  search: Joi.string().max(100).optional(),
  sortBy: Joi.string().valid('createdAt', 'dueDate', 'priority', 'updatedAt').optional(),
  order: Joi.string().valid('asc', 'desc').optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional()
})