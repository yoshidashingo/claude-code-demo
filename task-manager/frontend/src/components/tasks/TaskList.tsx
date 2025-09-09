import React, { useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskItem } from './TaskItem';
import { TaskInput } from './TaskInput';
import { Loading } from '../common/Loading';
import { useTaskStore } from '../../stores/taskStore';

export const TaskList: React.FC = () => {
  const { tasks, isLoading, error, fetchTasks, reorderTasks, connectSocket, disconnectSocket } = useTaskStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTasks();
    connectSocket();
    
    return () => {
      disconnectSocket();
    };
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const movedTask = tasks[oldIndex];
        let newOrder: number;
        
        if (newIndex === 0) {
          newOrder = tasks[0].order / 2;
        } else if (newIndex === tasks.length - 1) {
          newOrder = tasks[tasks.length - 1].order + 1000;
        } else {
          const prevOrder = tasks[newIndex - 1].order;
          const nextOrder = tasks[newIndex].order;
          newOrder = (prevOrder + nextOrder) / 2;
        }
        
        reorderTasks(movedTask.id, newOrder);
      }
    }
  };

  if (isLoading && tasks.length === 0) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <TaskInput />
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}
      
      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          タスクがありません。新しいタスクを追加してください。
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};