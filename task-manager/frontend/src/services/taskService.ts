import { api } from './api';
import { Task, CreateTaskDto, UpdateTaskDto, ReorderTaskDto, TaskResponse, TasksResponse } from '../types/task.types';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await api.get<TasksResponse>('/api/tasks');
    return response.data.tasks;
  },

  async createTask(data: CreateTaskDto): Promise<Task> {
    const response = await api.post<TaskResponse>('/api/tasks', data);
    return response.data.task;
  },

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    const response = await api.put<TaskResponse>(`/api/tasks/${id}`, data);
    return response.data.task;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/api/tasks/${id}`);
  },

  async reorderTasks(data: ReorderTaskDto): Promise<Task[]> {
    const response = await api.put<TasksResponse>('/api/tasks/reorder', data);
    return response.data.tasks;
  },
};