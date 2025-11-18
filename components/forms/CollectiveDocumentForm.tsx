
import React, { useState, useRef } from 'react';
import { FormInput } from './FormElements';
import { supabase } from '../../supabaseClient';

interface CollectiveDocumentFormProps {
    onSubmit: (data: { name: string, file: File, fileDataUrl: string }) => void;
}

export const CollectiveDocumentForm: React.FC<CollectiveDocumentFormProps> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 20 * 1024 * 1024) { // 20MB limit
                setError('O arquivo é muito grande. O limite é de 20MB.');
                return;
            }
            setFile(selectedFile);
            if(!name) {
                setName(selectedFile.name.replace(/\.[^/.]+$/, "")); // Set name from file name without extension
            }
            setError('');
        }
    };

    const uploadDocument = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `documents/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
            .from('clio-public')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('clio-public')
            .getPublicUrl(fileName);

        return data.publicUrl;
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
        setIsUploading(true);

        try {
            const fileDataUrl = await uploadDocument(file);
            onSubmit({
                name,
                file,
                fileDataUrl, // Stores Supabase URL
            });
        } catch (err) {
            console.error(err);
            setError('Erro ao fazer upload do documento.');
        } finally {
            setIsUploading(false);
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
                <p className="text-xs text-slate-500 mt-1">Tipos suportados: PDF, DOCX, TXT, etc. Limite de 20MB.</p>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button 
                type="submit" 
                disabled={isUploading}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition disabled:bg-slate-600"
            >
                {isUploading ? 'Enviando...' : 'Salvar Documento'}
            </button>
        </form>
    );
};
