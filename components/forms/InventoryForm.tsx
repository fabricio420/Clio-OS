import React, { useState, useEffect } from 'react';
import type { InventoryItem, Member } from '../../types';
import { InventoryStatus } from '../../types';
import { FormInput } from './FormElements';

interface InventoryFormProps {
    onSubmit: (data: Omit<InventoryItem, 'id'>, id?: string) => void;
    item: InventoryItem | null;
    members: Member[];
}

export const InventoryForm: React.FC<InventoryFormProps> = ({ onSubmit, item, members }) => {
    const [formData, setFormData] = useState({ name: '', quantity: 1, status: InventoryStatus.Pending, responsibleId: '' });
    
    useEffect(() => { 
        if (item) {
            setFormData({ name: item.name, quantity: item.quantity, status: item.status, responsibleId: item.responsibleId || '' });
        }
    }, [item]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? parseInt(value, 10) || 1 : value;
        setFormData({...formData, [name]: val});
    };
    
    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        onSubmit(formData, item?.id); 
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Nome do Item" name="name" value={formData.name} onChange={handleChange} required />
            <FormInput label="Quantidade" name="quantity" type="number" min="1" value={formData.quantity} onChange={handleChange} required />
            <FormInput label="Status" name="status" as="select" value={formData.status} onChange={handleChange}>
                {Object.values(InventoryStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </FormInput>
            <FormInput label="Responsável" name="responsibleId" as="select" value={formData.responsibleId} onChange={handleChange}>
                <option value="">Ninguém</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </FormInput>
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">Salvar Item</button>
        </form>
    );
};