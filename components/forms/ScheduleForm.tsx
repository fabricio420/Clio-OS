

import React, { useState, useEffect } from 'react';
import type { ScheduleItem } from '../../types';
import { FormInput } from './FormElements';

export const ScheduleForm: React.FC<{onSubmit: (data: any, id?: string) => void, item: ScheduleItem | null}> = ({ onSubmit, item }) => {
    const [formData, setFormData] = useState({ time: '', title: '', description: '', responsible: '' });
    
    useEffect(() => { 
        if (item) {
            setFormData({ time: item.time, title: item.title, description: item.description, responsible: item.responsible });
        }
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({...formData, [e.target.name]: e.target.value});
    
    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        onSubmit(formData, item?.id); 
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Hora" name="time" type="time" value={formData.time} onChange={handleChange} required />
            <FormInput label="Título" name="title" value={formData.title} onChange={handleChange} required />
            <FormInput label="Descrição" name="description" as="textarea" value={formData.description} onChange={handleChange} rows={3} />
            <FormInput label="Responsável" name="responsible" value={formData.responsible} onChange={handleChange} required />
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">Salvar</button>
        </form>
    );
};
