
import React, { useState, useEffect } from 'react';
import type { Artist, EventInfoData } from '../../types';
import { FormInput } from './FormElements';
import { UploadCloudIcon, XIcon } from '../icons';
import { supabase } from '../../supabaseClient';

interface ArtistFormProps {
    onSubmit: (data: any, id?: string) => void;
    artist: Artist | null;
    eventInfo: EventInfoData;
}

export const ArtistForm: React.FC<ArtistFormProps> = ({ onSubmit, artist, eventInfo }) => {
    const [formData, setFormData] = useState({ name: '', performanceType: '', contact: '', notes: '', instagram: '', whatsapp: '', cpf: '', rg: '' });
    const [documentImageFile, setDocumentImageFile] = useState<File | null>(null);
    const [documentPath, setDocumentPath] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    
    useEffect(() => { 
        if (artist) {
            setFormData({ 
                name: artist.name, 
                performanceType: artist.performanceType, 
                contact: artist.contact, 
                notes: artist.notes, 
                instagram: artist.instagram || '', 
                whatsapp: artist.whatsapp || '',
                cpf: artist.cpf || '',
                rg: artist.rg || '',
            });
            if (artist.documentImage) {
                setDocumentPath(artist.documentImage);
            }
        }
    }, [artist]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setFormData({...formData, [e.target.name]: e.target.value});
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('A imagem é muito grande. O limite é 5MB.');
                return;
            }
            setError('');
            setDocumentImageFile(file);
        }
    };

    const handleRemoveImage = () => {
        setDocumentImageFile(null);
        setDocumentPath(null);
    };

    const uploadPrivateDoc = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        // Use a random name but keep extension
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `docs/${fileName}`;

        // Upload to clio-private bucket
        const { error: uploadError } = await supabase.storage
            .from('clio-private')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        return filePath; // We save the PATH, not the URL, for private files
    };
    
    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault(); 
        setIsUploading(true);
        setError('');

        try {
            let finalDocumentPath = documentPath;

            if (documentImageFile) {
                finalDocumentPath = await uploadPrivateDoc(documentImageFile);
            }

            const finalData = { ...formData, documentImage: finalDocumentPath || undefined };
            onSubmit(finalData, artist?.id); 
        } catch (err) {
            console.error(err);
            setError('Erro ao enviar o documento. Tente novamente.');
        } finally {
            setIsUploading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Nome" name="name" value={formData.name} onChange={handleChange} required />
            <FormInput label="Tipo de Performance" name="performanceType" as="select" value={formData.performanceType} onChange={handleChange} required>
                <option value="">Selecione um tipo</option>
                {eventInfo.artTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </FormInput>
            <FormInput label="Contato (E-mail)" name="contact" type="email" value={formData.contact} onChange={handleChange} required />
            <FormInput label="WhatsApp" name="whatsapp" placeholder="(99) 99999-9999" value={formData.whatsapp} onChange={handleChange} />
            <FormInput label="Instagram" name="instagram" placeholder="@usuario" value={formData.instagram} onChange={handleChange} />
            <FormInput label="CPF" name="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} />
            <FormInput label="RG" name="rg" placeholder="00.000.000-0" value={formData.rg} onChange={handleChange} />
            
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Documento (RG/CPF) - Armazenamento Seguro</label>
                {documentPath && !documentImageFile ? (
                     <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600">
                        <span className="text-sm text-slate-300 truncate">Documento Anexado (Seguro)</span>
                        <button type="button" onClick={handleRemoveImage} className="text-red-400 hover:text-red-300"><XIcon className="w-4 h-4" /></button>
                    </div>
                ) : documentImageFile ? (
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600">
                        <span className="text-sm text-lime-300 truncate">Arquivo selecionado: {documentImageFile.name}</span>
                        <button type="button" onClick={handleRemoveImage} className="text-red-400 hover:text-red-300"><XIcon className="w-4 h-4" /></button>
                    </div>
                ) : (
                    <label className="h-24 border-2 border-dashed border-slate-500 rounded-lg flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-700/50 hover:border-sky-400">
                         <UploadCloudIcon className="w-8 h-8 mb-1" />
                         <p className="text-xs">Clique para enviar foto do documento</p>
                         <input type="file" onChange={handleFileChange} accept="image/*, application/pdf" className="hidden" />
                    </label>
                )}
            </div>

            <FormInput label="Notas" name="notes" as="textarea" value={formData.notes} onChange={handleChange} rows={3} />
            
            {error && <p className="text-red-400 text-sm text-center bg-red-900/50 p-2 rounded-md">{error}</p>}

            <button 
                type="submit" 
                disabled={isUploading}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition disabled:bg-slate-600"
            >
                {isUploading ? 'Enviando e Salvando...' : 'Salvar Artista'}
            </button>
        </form>
    );
};
