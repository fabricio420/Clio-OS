import React, { useState, useEffect } from 'react';
import type { Artist, EventInfoData } from '../../types';
import { FormInput } from './FormElements';
import { UploadCloudIcon, XIcon } from '../icons';

interface ArtistFormProps {
    onSubmit: (data: any, id?: string) => void;
    artist: Artist | null;
    eventInfo: EventInfoData;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

export const ArtistForm: React.FC<ArtistFormProps> = ({ onSubmit, artist, eventInfo }) => {
    const [formData, setFormData] = useState({ name: '', performanceType: '', contact: '', notes: '', instagram: '', whatsapp: '', cpf: '', rg: '' });
    const [documentImageFile, setDocumentImageFile] = useState<File | null>(null);
    const [documentImagePreview, setDocumentImagePreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    
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
                setDocumentImagePreview(artist.documentImage);
            }
        }
    }, [artist]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setFormData({...formData, [e.target.name]: e.target.value});
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setError('A imagem é muito grande. O limite é 2MB.');
                return;
            }
            setError('');
            setDocumentImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setDocumentImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setDocumentImageFile(null);
        setDocumentImagePreview(null);
    };
    
    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault(); 
        let documentImageDataUrl = artist?.documentImage || undefined;
        if (documentImageFile) {
            documentImageDataUrl = await fileToBase64(documentImageFile);
        } else if (!documentImagePreview) {
             documentImageDataUrl = undefined;
        }

        const finalData = { ...formData, documentImage: documentImageDataUrl };
        onSubmit(finalData, artist?.id); 
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
                <label className="block text-sm font-medium text-slate-300 mb-1">Documento (Foto)</label>
                {documentImagePreview ? (
                     <div className="relative h-32 w-full rounded-lg overflow-hidden border border-slate-600">
                        <img src={documentImagePreview} alt="Preview" className="w-full h-full object-contain" />
                        <button type="button" onClick={handleRemoveImage} className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-red-500"><XIcon className="w-4 h-4" /></button>
                    </div>
                ) : (
                    <label className="h-24 border-2 border-dashed border-slate-500 rounded-lg flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-700/50 hover:border-sky-400">
                         <UploadCloudIcon className="w-8 h-8 mb-1" />
                         <p className="text-xs">Clique para enviar</p>
                         <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                    </label>
                )}
            </div>

            <FormInput label="Notas" name="notes" as="textarea" value={formData.notes} onChange={handleChange} rows={3} />
            
            {error && <p className="text-red-400 text-sm text-center bg-red-900/50 p-2 rounded-md">{error}</p>}

            <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">Salvar</button>
        </form>
    );
};