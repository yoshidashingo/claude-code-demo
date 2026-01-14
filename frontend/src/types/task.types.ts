export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: string
  userId: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  dueDate?: string
  categoryId?: string
  createdAt: string
  updatedAt: string
  category?: {
    id: string
    name: string
    color: string
  }
  tags?: Array<{
    tag: {
      id: string
      name: string
    }
  }>
}

export interface CreateTaskDto {
  title: string
  description?: string
  priority: Priority
  dueDate?: string
  categoryId?: string
}

export interface UpdateTaskDto {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  dueDate?: string | null
  categoryId?: string | null
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

export interface TasksResponse {
  tasks: Task[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}