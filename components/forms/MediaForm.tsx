
import React, { useState } from 'react';
import type { MediaItem, Artist } from '../../types';
import { FormInput } from './FormElements';
import { supabase } from '../../supabaseClient';

export const MediaForm: React.FC<{onSubmit: (data: Omit<MediaItem, 'id'>) => void, artists: Artist[]}> = ({ onSubmit, artists }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<'general' | 'artist'>('general');
    const [artistId, setArtistId] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const uploadToSupabase = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `media/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('clio-public')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('clio-public')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Por favor, selecione um arquivo.');
            return;
        }
        if (!title.trim()) {
            setError('Por favor, insira um título.');
            return;
        }
        if (category === 'artist' && !artistId) {
            setError('Por favor, selecione um artista.');
            return;
        }
        
        setError('');
        setIsUploading(true);

        try {
            const fileDataUrl = await uploadToSupabase(file);
            
            onSubmit({
                title,
                category,
                fileDataUrl, // Agora é uma URL do Supabase, não Base64
                fileName: file.name,
                artistId: category === 'artist' ? artistId : undefined,
            });
        } catch (err) {
            console.error(err);
            setError('Erro ao fazer upload da imagem. Tente novamente.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Título" name="title" value={title} onChange={(e) => setTitle((e.target as HTMLInputElement).value)} required />
            <FormInput label="Categoria" name="category" as="select" value={category} onChange={(e) => setCategory((e.target as HTMLSelectElement).value as 'general' | 'artist')} >
                <option value="general">Divulgação Geral</option>
                <option value="artist">Mídia de Artista</option>
            </FormInput>
             {category === 'artist' && (
                <FormInput label="Artista" name="artistId" as="select" value={artistId} onChange={(e) => setArtistId((e.target as HTMLSelectElement).value)} required>
                    <option value="">Selecione o artista</option>
                    {artists.map(artist => (
                        <option key={artist.id} value={artist.id}>{artist.name}</option>
                    ))}
                </FormInput>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Arquivo</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button 
                type="submit" 
                disabled={isUploading}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
                {isUploading ? 'Enviando...' : 'Salvar Mídia'}
            </button>
        </form>
    )
};
