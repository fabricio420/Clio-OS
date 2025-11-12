import React from 'react';
import type { Task, TaskStatus as TaskStatusEnum, Member } from '../../types';
import { TaskStatus } from '../../types';
import KanbanColumn from './KanbanColumn';
import { PlusIcon } from '../icons';
import Header from '../Header';

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
    <div className="h-full flex flex-col">
      <Header
        title="Quadro de Tarefas"
        subtitle="Organize as atividades da equipe de forma visual e intuitiva."
        action={
          <button
            onClick={() => onOpenModal('task')}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nova Tarefa</span>
          </button>
        }
      />
      <div className="flex-1 px-4 md:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
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
    </div>
  );
};

export default KanbanBoard;
