import React, { useState, useEffect } from 'react';
// FIX: Replaced 'Expense' type with 'Transaction' to align with the new financial data model.
import type { Transaction } from '../../types';
import { FormInput } from './FormElements';

// FIX: Updated the 'expense' prop to use the Transaction type.
export const ExpenseForm: React.FC<{onSubmit: (data: any, id?: string) => void, expense: Transaction | null}> = ({ onSubmit, expense }) => {
    // FIX: Changed state property from 'item' to 'description' to match the Transaction type.
    const [formData, setFormData] = useState({ description: '', category: '', amount: 0, date: '' });
    const [error, setError] = useState('');

    useEffect(() => { 
        if (expense) {
            // FIX: Updated to set 'description' from the expense prop instead of 'item'.
            setFormData({ description: expense.description, category: expense.category, amount: expense.amount, date: expense.date });
        }
    }, [expense]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.name === 'amount' ? parseFloat(e.target.value) : e.target.value;
        setFormData({...formData, [e.target.name]: value});
    };

    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        if (formData.amount <= 0) {
            setError('O valor da despesa deve ser maior que zero.');
            return;
        }
        setError('');
        onSubmit(formData, expense?.id); 
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* FIX: Changed the input field's name and value to 'description' and updated the label. */}
            <FormInput label="Item/Descrição" name="description" value={formData.description} onChange={handleChange} required />
            <FormInput label="Categoria" name="category" value={formData.category} onChange={handleChange} required />
            <FormInput label="Valor" name="amount" type="number" step="0.01" value={String(formData.amount)} onChange={handleChange} required />
            <FormInput label="Data" name="date" type="date" value={formData.date} onChange={handleChange} required />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">Salvar</button>
        </form>
    );
};
