import { create } from 'zustand';
import { Task } from '../types/task.types';
import { taskService } from '../services/taskService';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';
import { authService } from '../services/authService';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  socket: Socket | null;

  fetchTasks: () => Promise<void>;
  createTask: (content: string) => Promise<void>;
  updateTask: (id: string, completed: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reorderTasks: (taskId: string, newOrder: number) => Promise<void>;
  
  connectSocket: () => void;
  disconnectSocket: () => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  socket: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskService.getTasks();
      set({ tasks, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'タスクの取得に失敗しました', 
        isLoading: false 
      });
    }
  },

  createTask: async (content) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit('task:create', { content });
    } else {
      try {
        const task = await taskService.createTask({ content });
        set((state) => ({ 
          tasks: [task, ...state.tasks].sort((a, b) => a.order - b.order) 
        }));
      } catch (error: any) {
        set({ 
          error: error.response?.data?.error || 'タスクの作成に失敗しました' 
        });
      }
    }
  },

  updateTask: async (id, completed) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit('task:update', { id, updates: { completed } });
    } else {
      try {
        const updatedTask = await taskService.updateTask(id, { completed });
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? updatedTask : task
          ),
        }));
      } catch (error: any) {
        set({ 
          error: error.response?.data?.error || 'タスクの更新に失敗しました' 
        });
      }
    }
  },

  deleteTask: async (id) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit('task:delete', { id });
    } else {
      try {
        await taskService.deleteTask(id);
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      } catch (error: any) {
        set({ 
          error: error.response?.data?.error || 'タスクの削除に失敗しました' 
        });
      }
    }
  },

  reorderTasks: async (taskId, newOrder) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit('task:reorder', { taskId, newOrder });
    } else {
      try {
        const tasks = await taskService.reorderTasks({ taskId, newOrder });
        set({ tasks });
      } catch (error: any) {
        set({ 
          error: error.response?.data?.error || 'タスクの並び替えに失敗しました' 
        });
      }
    }
  },

  connectSocket: () => {
    const token = authService.getToken();
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('task:created', ({ task }: { task: Task }) => {
      set((state) => ({
        tasks: [task, ...state.tasks].sort((a, b) => a.order - b.order),
      }));
    });

    socket.on('task:updated', ({ task }: { task: Task }) => {
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
      }));
    });

    socket.on('task:deleted', ({ id }: { id: string }) => {
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
    });

    socket.on('task:reordered', ({ tasks }: { tasks: Task[] }) => {
      set({ tasks });
    });

    socket.on('error', ({ message }: { message: string }) => {
      set({ error: message });
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  clearError: () => set({ error: null }),
}));