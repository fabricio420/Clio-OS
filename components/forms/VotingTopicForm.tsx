import React, { useState } from 'react';
import { FormInput } from './FormElements';
import { PlusIcon, XIcon } from '../icons';

interface VotingTopicFormProps {
    onSubmit: (data: { title: string, description: string, options: { text: string }[] }) => void;
}

export const VotingTopicForm: React.FC<VotingTopicFormProps> = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [error, setError] = useState('');

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, '']);
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validOptions = options.map(o => ({ text: o.trim() })).filter(o => o.text);
        if (validOptions.length < 2) {
            setError('A votação precisa de pelo menos duas opções válidas.');
            return;
        }
        setError('');
        onSubmit({ title, description, options: validOptions });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
                label="Título da Votação"
                name="title"
                value={title}
                onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
                required
            />
            <FormInput
                label="Descrição (Contexto)"
                name="description"
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
            />
            
            <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1">Opções de Voto</label>
                 <div className="space-y-2">
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                className="w-full bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder={`Opção ${index + 1}`}
                            />
                            <button
                                type="button"
                                onClick={() => removeOption(index)}
                                className="p-2 text-red-400 hover:bg-slate-700 rounded-md disabled:opacity-50"
                                disabled={options.length <= 2}
                            >
                                <XIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    ))}
                 </div>
                 <button
                    type="button"
                    onClick={addOption}
                    className="mt-2 flex items-center space-x-1 text-sm text-sky-400 hover:text-sky-300"
                 >
                     <PlusIcon className="w-4 h-4"/>
                     <span>Adicionar Opção</span>
                 </button>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">
                Criar Votação
            </button>
        </form>
    );
};
