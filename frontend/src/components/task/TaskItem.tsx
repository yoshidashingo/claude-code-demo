import React, { useState } from 'react'
import { format } from 'date-fns'
import { FaEdit, FaTrash, FaClock } from 'react-icons/fa'
import { Task, TaskStatus } from '../../types/task.types'
import { Button } from '../common/Button'
import clsx from 'clsx'

interface TaskItemProps {
  task: Task
  onStatusChange: (id: string, status: TaskStatus) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onStatusChange,
  onEdit,
  onDelete
}) => {
  const [isChangingStatus, setIsChangingStatus] = useState(false)

  const handleStatusChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus: TaskStatus = e.target.checked ? 'COMPLETED' : 'PENDING'
    setIsChangingStatus(true)
    try {
      await onStatusChange(task.id, newStatus)
    } finally {
      setIsChangingStatus(false)
    }
  }

  const priorityColors = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-red-100 text-red-800'
  }

  const statusColors = {
    PENDING: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800'
  }

  const statusLabels = {
    PENDING: '未着手',
    IN_PROGRESS: '進行中',
    COMPLETED: '完了'
  }

  const priorityLabels = {
    LOW: '低',
    MEDIUM: '中',
    HIGH: '高'
  }

  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow',
        task.status === 'COMPLETED' && 'opacity-75'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={task.status === 'COMPLETED'}
            onChange={handleStatusChange}
            disabled={isChangingStatus}
            className="mt-1 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <div className="flex-1">
            <h3
              className={clsx(
                'text-lg font-medium text-gray-900',
                task.status === 'COMPLETED' && 'line-through'
              )}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-1 text-sm text-gray-600">{task.description}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={clsx(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  statusColors[task.status]
                )}
              >
                {statusLabels[task.status]}
              </span>
              <span
                className={clsx(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  priorityColors[task.priority]
                )}
              >
                優先度: {priorityLabels[task.priority]}
              </span>
              {task.dueDate && (
                <span className="inline-flex items-center text-xs text-gray-500">
                  <FaClock className="mr-1" />
                  期限: {format(new Date(task.dueDate), 'yyyy/MM/dd')}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            disabled={isChangingStatus}
          >
            <FaEdit />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task)}
            disabled={isChangingStatus}
          >
            <FaTrash className="text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  )
}