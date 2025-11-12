import React, { useState, memo } from 'react';
import type { Task, TaskStatus, Member } from '../../types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  title: TaskStatus;
  tasks: Task[];
  members: Member[];
  recentlyUpdatedTaskId: string | null;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDropTask: (taskId: string, newStatus: TaskStatus) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, tasks, members, recentlyUpdatedTaskId, onEditTask, onDeleteTask, onDropTask }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };
  
  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    onDropTask(taskId, title);
    setIsOver(false);
  };

  const getBorderColor = () => {
    if (title === 'A Fazer') return 'border-t-yellow-500';
    if (title === 'Em Andamento') return 'border-t-blue-500';
    if (title === 'Concluído') return 'border-t-lime-500';
    return 'border-t-slate-500';
  };
  
  return (
    <div 
      className={`bg-slate-900 rounded-lg p-4 w-full border-t-4 ${getBorderColor()} transition-colors ${isOver ? 'bg-slate-800' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3 className="text-lg font-semibold text-white mb-4">{title} ({tasks.length})</h3>
      <div className="space-y-4 h-auto md:h-[calc(100vh-250px)] overflow-y-auto pr-2">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            members={members}
            recentlyUpdatedTaskId={recentlyUpdatedTaskId}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(KanbanColumn);