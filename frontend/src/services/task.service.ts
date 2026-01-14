import { api } from './api'
import {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  TaskQuery,
  TasksResponse,
  TaskStatus
} from '../types/task.types'

export const taskService = {
  async getTasks(query?: TaskQuery): Promise<TasksResponse> {
    const response = await api.get<TasksResponse>('/tasks', { params: query })
    return response.data
  },

  async getTask(id: string): Promise<Task> {
    const response = await api.get<{ task: Task }>(`/tasks/${id}`)
    return response.data.task
  },

  async createTask(data: CreateTaskDto): Promise<Task> {
    const response = await api.post<{ task: Task }>('/tasks', data)
    return response.data.task
  },

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    const response = await api.put<{ task: Task }>(`/tasks/${id}`, data)
    return response.data.task
  },

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const response = await api.patch<{ task: Task }>(`/tasks/${id}/status`, { status })
    return response.data.task
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`)
  },

  async getStatistics(): Promise<any> {
    const response = await api.get('/tasks/statistics')
    return response.data.statistics
  }
}