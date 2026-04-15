import { TaskStatus, Priority } from '@prisma/client'

export interface CreateTaskDto {
  title: string
  description?: string
  priority: Priority
  dueDate?: Date
  categoryId?: string
}

export interface UpdateTaskDto {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  dueDate?: Date | null
  categoryId?: string | null
}

export interface UpdateTaskStatusDto {
  status: TaskStatus
}

export interface TaskFilters {
  status?: TaskStatus
  priority?: Priority
  categoryId?: string
  search?: string
}

export interface TaskSortOptions {
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'updatedAt'
  order?: 'asc' | 'desc'
}

export interface PaginationOptions {
  page?: number
  limit?: number
}

export interface TaskQuery extends TaskFilters, TaskSortOptions, PaginationOptions {}