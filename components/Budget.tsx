

import React, { useState, memo } from 'react';
// FIX: Replaced 'Expense' type with 'Transaction' to align with the new data model.
import type { Transaction, FinancialProject } from '../types';
import { PlusIcon, MoreVerticalIcon } from './icons';

interface BudgetProps {
  // FIX: Updated modal data type to Transaction.
  onOpenModal: (view: 'expense', data?: Transaction) => void;
  financialProjects: FinancialProject[];
  totalBudget: number;
  handleDeleteTransaction: (projectId: string, transactionId: string) => void;
}

const ExpenseRow: React.FC<{
  // FIX: Updated prop type to Transaction.
  expense: Transaction,
  // FIX: Updated prop type to Transaction.
  onEdit: (expense: Transaction) => void;
  onDelete: (expenseId: string) => void;
}> = memo(({ expense, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
     <tr className="border-b border-slate-700 last:border-b-0 group">
        {/* FIX: Changed property from 'item' to 'description' to match the Transaction type. */}
        <td className="p-4">{expense.description}</td>
        <td className="p-4">{expense.category}</td>
        <td className="p-4">{expense.date}</td>
        <td className="p-4 text-right text-red-400">R$ {expense.amount.toFixed(2)}</td>
        <td className="p-4 w-12 text-right">
            <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-400 hover:text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVerticalIcon className="h-5 w-5" />
                </button>
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-700 rounded-md shadow-lg z-10">
                        <button onClick={() => { onEdit(expense); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">Editar</button>
                        <button onClick={() => { onDelete(expense.id); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700">Excluir</button>
                    </div>
                )}
            </div>
        </td>
    </tr>
  );
});

const ExpenseCard: React.FC<{
    // FIX: Updated prop type to Transaction.
    expense: Transaction,
    // FIX: Updated prop type to Transaction.
    onEdit: (expense: Transaction) => void;
    onDelete: (expenseId: string) => void;
}> = memo(({ expense, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <div className="bg-slate-700 rounded-lg p-4 relative">
            <div className="flex justify-between items-start gap-4">
                <div>
                    {/* FIX: Changed property from 'item' to 'description' to match the Transaction type. */}
                    <p className="font-bold text-slate-100 pr-8">{expense.description}</p>
                    <p className="text-sm text-slate-400">{expense.category} - {expense.date}</p>
                </div>
                <p className="text-lg font-semibold text-red-400 whitespace-nowrap">R$ {expense.amount.toFixed(2)}</p>
            </div>
             <div className="absolute top-2 right-2">
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-400 hover:text-white p-1">
                    <MoreVerticalIcon className="h-5 w-5" />
                </button>
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-700 rounded-md shadow-lg z-10">
                        <button onClick={() => { onEdit(expense); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">Editar</button>
                        <button onClick={() => { onDelete(expense.id); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700">Excluir</button>
                    </div>
                )}
            </div>
        </div>
    );
});


const Budget: React.FC<BudgetProps> = ({ onOpenModal, financialProjects, totalBudget, handleDeleteTransaction }) => {
  const expenses = financialProjects.flatMap(p => p.transactions.filter(t => t.type === 'expense'));
  
  // FIX: Created a handler to find the correct project ID to delete a transaction, as this component is project-agnostic.
  const handleDeleteExpense = (transactionId: string) => {
    const project = financialProjects.find(p => p.transactions.some(t => t.id === transactionId));
    if (project) {
        handleDeleteTransaction(project.id, transactionId);
    }
  };
  
  const totalSpent = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const remainingBudget = totalBudget - totalSpent;

  return (
    <div className="p-4 md:p-8">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Controle de Orçamento</h2>
        <button 
          onClick={() => onOpenModal('expense')}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nova Despesa</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-lg shadow-md text-center">
          <p className="text-sm text-slate-400">Orçamento Total</p>
          <p className="text-3xl font-bold text-blue-400">R$ {totalBudget.toFixed(2)}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg shadow-md text-center">
          <p className="text-sm text-slate-400">Total Gasto</p>
          <p className="text-3xl font-bold text-red-400">R$ {totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg shadow-md text-center">
          <p className="text-sm text-slate-400">Restante</p>
          <p className="text-3xl font-bold text-lime-400">R$ {remainingBudget.toFixed(2)}</p>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-slate-800 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-700">
            <tr>
              <th className="p-4 font-semibold">Item</th>
              <th className="p-4 font-semibold">Categoria</th>
              <th className="p-4 font-semibold">Data</th>
              <th className="p-4 font-semibold text-right">Valor</th>
              <th className="p-4 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <ExpenseRow 
                key={expense.id} 
                expense={expense}
                onEdit={(expenseToEdit) => onOpenModal('expense', expenseToEdit)}
                onDelete={handleDeleteExpense}
               />
            ))}
             {expenses.length === 0 && (
                <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-400">Nenhuma despesa registrada.</td>
                </tr>
             )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
            <h3 className="text-xl font-semibold text-white">Despesas</h3>
            {expenses.length > 0 ? (
                expenses.map(expense => (
                    <ExpenseCard
                        key={expense.id}
                        expense={expense}
                        onEdit={(expenseToEdit) => onOpenModal('expense', expenseToEdit)}
                        onDelete={handleDeleteExpense}
                    />
                ))
            ) : (
                <div className="bg-slate-700 rounded-lg p-4 text-center text-slate-400">
                    Nenhuma despesa registrada.
                </div>
            )}
        </div>
    </div>
  );
};

export default Budget;