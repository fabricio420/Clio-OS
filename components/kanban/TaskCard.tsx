import React, { useState, memo } from 'react';
import type { Task, Member } from '../../types';
import { MoreVerticalIcon } from '../icons';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  members: Member[];
  recentlyUpdatedTaskId: string | null;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onDragStart, members, recentlyUpdatedTaskId }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const assignee = members.find(m => m.id === task.assigneeId);
  
  const isUpdated = recentlyUpdatedTaskId === task.id;

  return (
    <div 
      className={`bg-slate-800 p-4 rounded-lg shadow-md mb-4 border-l-4 border-blue-500 cursor-grab active:cursor-grabbing transition-all duration-500 ${isUpdated ? 'shadow-yellow-400/50 ring-2 ring-yellow-400' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-slate-100 pr-2">{task.title}</h4>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-400 hover:text-white">
            <MoreVerticalIcon className="h-5 w-5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-600 rounded-md shadow-lg z-10">
              <button onClick={() => { onEdit(task); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">Editar</button>
              <button onClick={() => { onDelete(task.id); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700">Excluir</button>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-slate-300 mt-2">{task.description}</p>
      <div className="flex justify-between items-center mt-4">
        <div className="text-xs text-slate-400">
          Prazo: {task.dueDate}
        </div>
        {assignee && (
          <img
            src={assignee.avatar}
            alt={assignee.name}
            title={assignee.name}
            className="w-8 h-8 rounded-full border-2 border-slate-500"
          />
        )}
      </div>
    </div>
  );
};

export default memo(TaskCard);