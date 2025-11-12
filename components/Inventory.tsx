import React, { useState, memo } from 'react';
import type { InventoryItem, Member } from '../types';
import { InventoryStatus } from '../types';
import { BoxIcon, MoreVerticalIcon, PlusIcon } from './icons';
import Header from './Header';

interface InventoryProps {
  onOpenModal: (view: 'inventory', data?: InventoryItem) => void;
  inventoryItems: InventoryItem[];
  members: Member[];
  handleDeleteInventoryItem: (itemId: string) => void;
}

const getStatusColor = (status: InventoryStatus) => {
    switch (status) {
        case InventoryStatus.Pending: return 'bg-yellow-500';
        case InventoryStatus.Confirmed: return 'bg-blue-500';
        case InventoryStatus.OnSite: return 'bg-lime-500';
        default: return 'bg-slate-500';
    }
};

const InventoryCard: React.FC<{
  item: InventoryItem;
  responsible?: Member;
  onEdit: (item: InventoryItem) => void;
  onDelete: (itemId: string) => void;
}> = memo(({ item, responsible, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-slate-900 rounded-lg shadow-md p-4 flex flex-col justify-between border-t border-lime-400">
      <div>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <BoxIcon className="h-6 w-6 text-sky-400 flex-shrink-0" />
            <div>
                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <p className="text-sm text-slate-400">Quantidade: {item.quantity}</p>
            </div>
          </div>
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-400 hover:text-white p-1">
              <MoreVerticalIcon className="h-5 w-5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-slate-950 border border-slate-700 rounded-md shadow-lg z-10">
                <button onClick={() => { onEdit(item); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Editar</button>
                <button onClick={() => { onDelete(item.id); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800">Excluir</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-700">
         <div className="flex items-center space-x-2">
            <span className={`h-3 w-3 rounded-full ${getStatusColor(item.status)}`}></span>
            <span className="text-xs font-medium text-slate-300">{item.status}</span>
         </div>
         {responsible && (
            <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Resp:</span>
                <img
                    src={responsible.avatar}
                    alt={responsible.name}
                    title={responsible.name}
                    className="w-6 h-6 rounded-full border-2 border-slate-600"
                />
            </div>
         )}
      </div>
    </div>
  );
});

const Inventory: React.FC<InventoryProps> = ({ onOpenModal, inventoryItems, members, handleDeleteInventoryItem }) => {

  return (
    <div className="h-full flex flex-col">
      <Header
        title="Inventário de Materiais"
        subtitle="Gerencie todos os equipamentos e materiais para o evento."
        action={
          <button
            onClick={() => onOpenModal('inventory')}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Novo Item</span>
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8">
        {inventoryItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventoryItems.map(item => {
              const responsible = members.find(m => m.id === item.responsibleId);
              return (
                <InventoryCard
                  key={item.id}
                  item={item}
                  responsible={responsible}
                  onEdit={(itemToEdit) => onOpenModal('inventory', itemToEdit)}
                  onDelete={handleDeleteInventoryItem}
                />
              )
            })}
          </div>
        ) : (
          <div className="bg-slate-900 rounded-lg p-12 text-center text-slate-400 border-t border-slate-700">
              <p>Nenhum item de inventário cadastrado ainda.</p>
              <p className="text-sm mt-2">Adicione equipamentos, materiais de decoração, cabos, e tudo mais que for necessário para o evento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;