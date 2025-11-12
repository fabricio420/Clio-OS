import React, { useState, useEffect } from 'react';
import type { Transaction, TransactionType } from '../../types';
import { TRANSACTION_CATEGORIES } from '../../types';
import { FormInput } from './FormElements';

interface TransactionFormProps {
    onSubmit: (data: Omit<Transaction, 'id' | 'type'>, id?: string) => void;
    transaction: Transaction | null;
    type: TransactionType;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, transaction, type }) => {
    const [formData, setFormData] = useState({ description: '', amount: 0, date: new Date().toISOString().slice(0, 10), category: '' });
    const [error, setError] = useState('');
    
    const isIncome = type === 'income';
    const categories = isIncome ? TRANSACTION_CATEGORIES.income : TRANSACTION_CATEGORIES.expense;

    useEffect(() => {
        if (transaction) {
            setFormData({
                description: transaction.description,
                amount: transaction.amount,
                date: transaction.date,
                category: transaction.category
            });
        } else {
            setFormData({ description: '', amount: 0, date: new Date().toISOString().slice(0, 10), category: '' });
        }
    }, [transaction]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? parseFloat(value) || 0 : value;
        setFormData({ ...formData, [name]: val });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.amount <= 0) {
            setError('O valor deve ser maior que zero.');
            return;
        }
        if (!formData.category) {
            setError('Por favor, selecione uma categoria.');
            return;
        }
        setError('');
        onSubmit(formData, transaction?.id);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={isIncome ? 'Ex: Venda de Ingressos' : 'Ex: Aluguel do Som'}
                required
            />
            <FormInput
                label="Categoria"
                name="category"
                as="select"
                value={formData.category}
                onChange={handleChange}
                required
            >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </FormInput>

            <FormInput
                label="Valor (R$)"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={handleChange}
                required
            />
            <FormInput
                label="Data"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
            />
            
            {error && <p className="text-red-400 text-sm">{error}</p>}
            
            <button type="submit" className={`w-full py-2 px-4 text-white font-semibold rounded-md transition ${isIncome ? 'bg-lime-600 hover:bg-lime-700' : 'bg-red-600 hover:bg-red-700'}`}>
                {transaction ? 'Salvar Alterações' : `Adicionar ${isIncome ? 'Receita' : 'Despesa'}`}
            </button>
        </form>
    );
};