import React, { useState, useRef } from 'react';
import { FormInput } from './FormElements';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

interface CollectiveDocumentFormProps {
    onSubmit: (data: { name: string, file: File, fileDataUrl: string }) => void;
}

export const CollectiveDocumentForm: React.FC<CollectiveDocumentFormProps> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
                setError('O arquivo é muito grande. O limite é de 10MB.');
                return;
            }
            setFile(selectedFile);
            if(!name) {
                setName(selectedFile.name.replace(/\.[^/.]+$/, "")); // Set name from file name without extension
            }
            setError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Por favor, selecione um arquivo.');
            return;
        }
        if (!name.trim()) {
            setError('Por favor, insira um nome para o documento.');
            return;
        }
        setError('');
        try {
            const fileDataUrl = await fileToBase64(file);
            onSubmit({
                name,
                file,
                fileDataUrl,
            });
        } catch (err) {
            setError('Não foi possível carregar o arquivo.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Nome do Documento" name="name" value={name} onChange={(e) => setName((e.target as HTMLInputElement).value)} required />
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Arquivo</label>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-slate-500 mt-1">Tipos suportados: PDF, DOCX, TXT, etc. Limite de 10MB.</p>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">Salvar Documento</button>
        </form>
    );
};
