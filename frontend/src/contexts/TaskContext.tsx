import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  TaskStatus,
  TaskQuery,
  TasksResponse
} from '../types/task.types'
import { taskService } from '../services/task.service'

interface TaskContextType {
  tasks: Task[]
  loading: boolean
  error: string | null
  pagination: TasksResponse['pagination'] | null
  filters: TaskQuery
  
  fetchTasks: (query?: TaskQuery) => Promise<void>
  createTask: (data: CreateTaskDto) => Promise<void>
  updateTask: (id: string, data: UpdateTaskDto) => Promise<void>
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  setFilters: (filters: TaskQuery) => void
  clearError: () => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const useTaskContext = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider')
  }
  return context
}

interface TaskProviderProps {
  children: ReactNode
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<TasksResponse['pagination'] | null>(null)
  const [filters, setFilters] = useState<TaskQuery>({})

  const fetchTasks = useCallback(async (query?: TaskQuery) => {
    setLoading(true)
    setError(null)
    try {
      const response = await taskService.getTasks(query || filters)
      setTasks(response.tasks)
      setPagination(response.pagination)
    } catch (err) {
      setError('タスクの取得に失敗しました')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const createTask = useCallback(async (data: CreateTaskDto) => {
    setLoading(true)
    setError(null)
    try {
      const newTask = await taskService.createTask(data)
      setTasks(prev => [newTask, ...prev])
    } catch (err) {
      setError('タスクの作成に失敗しました')
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTask = useCallback(async (id: string, data: UpdateTaskDto) => {
    setLoading(true)
    setError(null)
    try {
      const updatedTask = await taskService.updateTask(id, data)
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task))
    } catch (err) {
      setError('タスクの更新に失敗しました')
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTaskStatus = useCallback(async (id: string, status: TaskStatus) => {
    setError(null)
    try {
      const updatedTask = await taskService.updateTaskStatus(id, status)
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task))
    } catch (err) {
      setError('ステータスの更新に失敗しました')
      console.error(err)
      throw err
    }
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await taskService.deleteTask(id)
      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (err) {
      setError('タスクの削除に失敗しました')
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value: TaskContextType = {
    tasks,
    loading,
    error,
    pagination,
    filters,
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    setFilters,
    clearError
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}