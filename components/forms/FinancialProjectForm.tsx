import React, { useState, useEffect } from 'react';
import type { FinancialProject } from '../../types';
import { FormInput } from './FormElements';

interface FinancialProjectFormProps {
    onSubmit: (data: Omit<FinancialProject, 'id' | 'transactions'>, id?: string) => void;
    project: Omit<FinancialProject, 'id' | 'transactions'> | null;
}

export const FinancialProjectForm: React.FC<FinancialProjectFormProps> = ({ onSubmit, project }) => {
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        if (project) {
            setFormData({ name: project.name, description: project.description });
        } else {
            setFormData({ name: '', description: '' });
        }
    }, [project]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, (project as FinancialProject)?.id);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
                label="Nome do Projeto/Caixa"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Slam da Resistência"
                required
            />
            <FormInput
                label="Descrição (Opcional)"
                name="description"
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Ex: Arrecadação para a 3ª edição do nosso slam."
            />
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">
                Salvar Projeto
            </button>
        </form>
    );
};