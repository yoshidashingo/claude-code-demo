import React, { useEffect } from 'react'
import { TaskProvider, useTaskContext } from './contexts/TaskContext'
import { TaskList } from './components/task/TaskList'

const TaskApp: React.FC = () => {
  const { fetchTasks } = useTaskContext()

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <TaskList />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <TaskProvider>
      <TaskApp />
    </TaskProvider>
  )
}

export default App