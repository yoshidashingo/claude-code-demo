import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt';
import { logger } from '../utils/logger';
import { taskService } from '../services/taskService';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const setupTaskSocket = (io: Server) => {
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const payload = verifyToken(token);
      socket.userId = payload.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket: AuthenticatedSocket) => {
    if (!socket.userId) {
      socket.disconnect();
      return;
    }
    
    logger.info('User connected:', socket.userId);
    
    socket.join(`user:${socket.userId}`);
    
    socket.on('task:create', async (data: { content: string }) => {
      try {
        const task = await taskService.createTask(socket.userId!, data.content);
        io.to(`user:${socket.userId}`).emit('task:created', { task });
      } catch (error) {
        socket.emit('error', { message: 'Failed to create task' });
      }
    });
    
    socket.on('task:update', async (data: { id: string; updates: any }) => {
      try {
        const task = await taskService.updateTask(socket.userId!, data.id, data.updates);
        io.to(`user:${socket.userId}`).emit('task:updated', { task });
      } catch (error) {
        socket.emit('error', { message: 'Failed to update task' });
      }
    });
    
    socket.on('task:delete', async (data: { id: string }) => {
      try {
        await taskService.deleteTask(socket.userId!, data.id);
        io.to(`user:${socket.userId}`).emit('task:deleted', { id: data.id });
      } catch (error) {
        socket.emit('error', { message: 'Failed to delete task' });
      }
    });
    
    socket.on('task:reorder', async (data: { taskId: string; newOrder: number }) => {
      try {
        const tasks = await taskService.reorderTasks(socket.userId!, data.taskId, data.newOrder);
        io.to(`user:${socket.userId}`).emit('task:reordered', { tasks });
      } catch (error) {
        socket.emit('error', { message: 'Failed to reorder tasks' });
      }
    });
    
    socket.on('disconnect', () => {
      logger.info('User disconnected:', socket.userId);
    });
  });
};