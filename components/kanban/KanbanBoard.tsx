import React from 'react';
import type { Task, TaskStatus as TaskStatusEnum, Member } from '../../types';
import { TaskStatus } from '../../types';
import KanbanColumn from './KanbanColumn';
import { PlusIcon } from '../icons';

interface KanbanBoardProps {
  onOpenModal: (view: 'task', data?: Task) => void;
  tasks: Task[];
  members: Member[];
  recentlyUpdatedTaskId: string | null;
  handleDeleteTask: (taskId: string) => void;
  handleUpdateTaskStatus: (taskId: string, newStatus: TaskStatusEnum) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ onOpenModal, tasks, members, recentlyUpdatedTaskId, handleDeleteTask, handleUpdateTaskStatus }) => {
  const columns: TaskStatusEnum[] = [TaskStatus.ToDo, TaskStatus.InProgress, TaskStatus.Done];

  const tasksByStatus = (status: TaskStatusEnum) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-white">Quadro de Tarefas</h2>
        <button 
          onClick={() => onOpenModal('task')}
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nova Tarefa</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(status => (
          <KanbanColumn
            key={status}
            title={status}
            tasks={tasksByStatus(status)}
            members={members}
            recentlyUpdatedTaskId={recentlyUpdatedTaskId}
            onEditTask={(task) => onOpenModal('task', task)}
            onDeleteTask={handleDeleteTask}
            onDropTask={handleUpdateTaskStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;