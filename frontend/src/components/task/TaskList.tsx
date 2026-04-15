import React, { useState } from 'react'
import { Task, TaskStatus } from '../../types/task.types'
import { TaskItem } from './TaskItem'
import { TaskForm } from './TaskForm'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { FaPlus } from 'react-icons/fa'
import { useTaskContext } from '../../contexts/TaskContext'

export const TaskList: React.FC = () => {
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask
  } = useTaskContext()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  const handleCreateTask = async (data: any) => {
    await createTask(data)
    setIsFormOpen(false)
  }

  const handleUpdateTask = async (data: any) => {
    if (editingTask) {
      await updateTask(editingTask.id, data)
      setEditingTask(null)
    }
  }

  const handleDeleteTask = async () => {
    if (deletingTask) {
      await deleteTask(deletingTask.id)
      setDeletingTask(null)
    }
  }

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    await updateTaskStatus(id, status)
  }

  if (loading && tasks.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">タスク一覧</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <FaPlus className="mr-2" />
          新規タスク
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">タスクがありません</p>
          <Button
            onClick={() => setIsFormOpen(true)}
            variant="primary"
            className="mt-4"
          >
            <FaPlus className="mr-2" />
            最初のタスクを作成
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onEdit={setEditingTask}
              onDelete={setDeletingTask}
            />
          ))}
        </div>
      )}

      {/* タスク作成モーダル */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="新規タスク作成"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* タスク編集モーダル */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="タスク編集"
      >
        {editingTask && (
          <TaskForm
            task={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={() => setEditingTask(null)}
          />
        )}
      </Modal>

      {/* 削除確認モーダル */}
      <Modal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        title="タスクの削除"
      >
        <div className="space-y-4">
          <p>以下のタスクを削除してもよろしいですか？</p>
          <div className="bg-gray-50 p-3 rounded">
            <p className="font-medium">{deletingTask?.title}</p>
            {deletingTask?.description && (
              <p className="text-sm text-gray-600 mt-1">{deletingTask.description}</p>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setDeletingTask(null)}>
              キャンセル
            </Button>
            <Button variant="danger" onClick={handleDeleteTask}>
              削除
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}