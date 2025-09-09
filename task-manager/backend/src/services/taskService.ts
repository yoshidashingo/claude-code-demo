import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export class TaskService {
  async getTasks(userId: string) {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });
    
    return tasks;
  }
  
  async createTask(userId: string, content: string) {
    const maxOrderTask = await prisma.task.findFirst({
      where: { userId },
      orderBy: { order: 'desc' },
    });
    
    const order = maxOrderTask ? maxOrderTask.order + 1000 : 1000;
    
    const task = await prisma.task.create({
      data: {
        content,
        userId,
        order,
      },
    });
    
    logger.info('Task created:', task.id);
    
    return task;
  }
  
  async updateTask(userId: string, taskId: string, updates: { content?: string; completed?: boolean }) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });
    
    if (!task) {
      throw new Error('Task not found');
    }
    
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updates,
    });
    
    logger.info('Task updated:', updatedTask.id);
    
    return updatedTask;
  }
  
  async deleteTask(userId: string, taskId: string) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });
    
    if (!task) {
      throw new Error('Task not found');
    }
    
    await prisma.task.delete({
      where: { id: taskId },
    });
    
    logger.info('Task deleted:', taskId);
  }
  
  async reorderTasks(userId: string, taskId: string, newOrder: number) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });
    
    if (!task) {
      throw new Error('Task not found');
    }
    
    const oldOrder = task.order;
    
    if (oldOrder === newOrder) {
      return await this.getTasks(userId);
    }
    
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });
    
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    const insertIndex = filteredTasks.findIndex(t => t.order > newOrder);
    
    if (insertIndex === -1) {
      filteredTasks.push(task);
    } else {
      filteredTasks.splice(insertIndex, 0, task);
    }
    
    const updates = filteredTasks.map((t, index) => ({
      id: t.id,
      order: (index + 1) * 1000,
    }));
    
    await prisma.$transaction(
      updates.map(update =>
        prisma.task.update({
          where: { id: update.id },
          data: { order: update.order },
        })
      )
    );
    
    logger.info('Tasks reordered for user:', userId);
    
    return await this.getTasks(userId);
  }
}

export const taskService = new TaskService();