import React, { useState, useEffect } from 'react';
import type { Notebook } from '../../types';
import { FormInput } from './FormElements';

interface NotebookFormProps {
    onSubmit: (name: string, id?: string) => void;
    notebook: Pick<Notebook, 'id' | 'name'> | null;
}

export const NotebookForm: React.FC<NotebookFormProps> = ({ onSubmit, notebook }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (notebook) {
            setName(notebook.name);
        } else {
            setName('');
        }
    }, [notebook]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name.trim(), notebook?.id);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
                label="Nome do Caderno"
                name="name"
                value={name}
                onChange={(e) => setName((e.target as HTMLInputElement).value)}
                placeholder="Ex: Poesias"
                required
                autoFocus
            />
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">
                Salvar Caderno
            </button>
        </form>
    );
};
