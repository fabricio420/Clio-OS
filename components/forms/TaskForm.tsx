

import React, { useState, useEffect } from 'react';
import type { Task, Member } from '../../types';
import { FormInput } from './FormElements';

interface TaskFormProps {
    onSubmit: (data: any, id?: string) => void;
    task: Task | null;
    members: Member[];
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, task, members }) => {
    const [formData, setFormData] = useState({ title: '', description: '', assigneeId: '', dueDate: '' });
    
    useEffect(() => { 
        if (task) {
            setFormData({ title: task.title, description: task.description, assigneeId: task.assigneeId || '', dueDate: task.dueDate });
        }
    }, [task]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setFormData({...formData, [e.target.name]: e.target.value});
    
    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        onSubmit(formData, task?.id); 
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Título" name="title" value={formData.title} onChange={handleChange} required />
            <FormInput label="Descrição" name="description" as="textarea" value={formData.description} onChange={handleChange} rows={3} />
            <FormInput label="Responsável" name="assigneeId" as="select" value={formData.assigneeId} onChange={handleChange}>
                <option value="">Ninguém</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </FormInput>
            <FormInput label="Prazo" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} required />
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">Salvar</button>
        </form>
    );
};
