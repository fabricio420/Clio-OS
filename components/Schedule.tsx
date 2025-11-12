import React, { useState, memo } from 'react';
import type { ScheduleItem } from '../types';
import { ClockIcon, PlusIcon, MoreVerticalIcon } from './icons';
import Header from './Header';

interface ScheduleProps {
  onOpenModal: (view: 'schedule', data?: ScheduleItem) => void;
  schedule: ScheduleItem[];
  handleDeleteScheduleItem: (itemId: string) => void;
}

const ScheduleItemComponent: React.FC<{
  item: ScheduleItem;
  onEdit: (item: ScheduleItem) => void;
  onDelete: (itemId: string) => void;
}> = memo(({ item, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="mb-8 pl-8 relative">
      <div className="absolute -left-5 -top-1 bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center">
        <ClockIcon className="h-4 w-4 text-white" />
      </div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-blue-300">{item.time}</p>
          <h3 className="text-xl font-bold text-lime-400 mt-1">{item.title}</h3>
          <p className="text-slate-300 mt-2">{item.description}</p>
          <p className="text-xs text-slate-400 mt-2">Responsável: {item.responsible}</p>
        </div>
        <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-400 hover:text-white p-2">
                <MoreVerticalIcon className="h-5 w-5" />
            </button>
            {menuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-700 rounded-md shadow-lg z-10">
                    <button onClick={() => { onEdit(item); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">Editar</button>
                    <button onClick={() => { onDelete(item.id); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700">Excluir</button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
});


const Schedule: React.FC<ScheduleProps> = ({ onOpenModal, schedule, handleDeleteScheduleItem }) => {
  const sortedItems = [...schedule].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="h-full flex flex-col">
      <Header
        title="Cronograma do Sarau"
        subtitle="Uma linha do tempo de tudo o que acontecerá durante o evento."
        action={
          <button
            onClick={() => onOpenModal('schedule')}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Novo Item</span>
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8">
        <div className="bg-slate-900 rounded-lg shadow-md p-6 border-t border-lime-400">
          <div className="relative border-l-2 border-blue-500 ml-4">
            {sortedItems.map((item) => (
              <ScheduleItemComponent
                key={item.id}
                item={item}
                onEdit={(itemToEdit) => onOpenModal('schedule', itemToEdit)}
                onDelete={handleDeleteScheduleItem}
              />
            ))}
            {sortedItems.length === 0 && <p className="text-slate-400 pl-8">Nenhum item no cronograma.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;