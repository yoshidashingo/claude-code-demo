import { Response } from 'express';
import { z } from 'zod';
import { taskService } from '../services/taskService';
import { AuthRequest } from '../middleware/auth';

export const createTaskSchema = z.object({
  content: z.string().min(1).max(500),
});

export const updateTaskSchema = z.object({
  content: z.string().min(1).max(500).optional(),
  completed: z.boolean().optional(),
});

export const reorderTaskSchema = z.object({
  taskId: z.string(),
  newOrder: z.number(),
});

export class TaskController {
  async getTasks(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const tasks = await taskService.getTasks(req.user.userId);
      res.json({ tasks });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get tasks' });
    }
  }
  
  async createTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const { content } = req.body;
      const task = await taskService.createTask(req.user.userId, content);
      res.status(201).json({ task });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  }
  
  async updateTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const { id } = req.params;
      const updates = req.body;
      const task = await taskService.updateTask(req.user.userId, id, updates);
      res.json({ task });
    } catch (error: any) {
      if (error.message === 'Task not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Failed to update task' });
    }
  }
  
  async deleteTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const { id } = req.params;
      await taskService.deleteTask(req.user.userId, id);
      res.json({ message: 'Task deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Task not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }
  
  async reorderTasks(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const { taskId, newOrder } = req.body;
      const tasks = await taskService.reorderTasks(req.user.userId, taskId, newOrder);
      res.json({ tasks });
    } catch (error: any) {
      if (error.message === 'Task not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Failed to reorder tasks' });
    }
  }
}

export const taskController = new TaskController();