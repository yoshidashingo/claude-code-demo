import React, { useState } from 'react';
import { useTaskStore } from '../../stores/taskStore';

export const TaskInput: React.FC = () => {
  const [content, setContent] = useState('');
  const { createTask } = useTaskStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      await createTask(content.trim());
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="新しいタスクを入力..."
        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        autoFocus
      />
    </form>
  );
};