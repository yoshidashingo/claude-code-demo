export interface Task {
  id: string;
  userId: string;
  content: string;
  completed: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  content: string;
}

export interface UpdateTaskDto {
  content?: string;
  completed?: boolean;
}

export interface ReorderTaskDto {
  taskId: string;
  newOrder: number;
}

export interface TaskResponse {
  task: Task;
}

export interface TasksResponse {
  tasks: Task[];
}