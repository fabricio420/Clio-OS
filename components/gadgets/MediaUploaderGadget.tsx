import React, { useState, useCallback, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import type { Artist } from '../../types';
import { UploadCloudIcon, XIcon } from '../icons';

const fileToBase64 = (file: File): Promise<string> => 
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const MediaUploaderGadget: React.FC = () => {
    const { artists, handleSaveMediaItem } = useAppContext();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<'general' | 'artist'>('general');
    const [artistId, setArtistId] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetState = () => {
        setTitle('');
        setCategory('general');
        setArtistId('');
        setFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setStatus('idle');
        setError(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFileSelect = (selectedFile: File | null) => {
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Arquivo muito grande. Limite de 5MB.');
                return;
            }
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
            setError(null);
            setStatus('idle');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileSelect(e.target.files?.[0] || null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        handleFileSelect(e.dataTransfer.files?.[0] || null);
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
        
        setError(null);
        setStatus('uploading');
        
        try {
            const fileDataUrl = await fileToBase64(file);
            handleSaveMediaItem({
                title,
                category,
                fileDataUrl,
                fileName: file.name,
                artistId: category === 'artist' ? artistId : undefined,
            });
            setStatus('success');
            setTimeout(resetState, 2000); // Reset after 2 seconds
        } catch (err) {
            setError('Não foi possível carregar o arquivo.');
            setStatus('error');
        }
    };
    
    return (
        <div className="w-80">
            <h3 className="font-bold text-center mb-4 text-lime-400">Upload Rápido de Mídia</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                {!previewUrl ? (
                    <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="h-32 border-2 border-dashed border-slate-500 rounded-lg flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-700/50 hover:border-sky-400"
                    >
                        <UploadCloudIcon className="w-8 h-8 mb-2" />
                        <p className="text-sm">Arraste ou clique para enviar</p>
                    </div>
                ) : (
                    <div className="relative h-32 w-full rounded-lg overflow-hidden">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={resetState} className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-red-500"><XIcon className="w-4 h-4" /></button>
                    </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                
                <input type="text" placeholder="Título da mídia" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-900/50 text-white p-2 rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400 text-sm" required />
                
                <select value={category} onChange={(e) => setCategory(e.target.value as 'general' | 'artist')} className="w-full bg-slate-900/50 text-white p-2 rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm">
                    <option value="general">Divulgação Geral</option>
                    <option value="artist">Mídia de Artista</option>
                </select>

                {category === 'artist' && (
                    <select value={artistId} onChange={(e) => setArtistId(e.target.value)} className="w-full bg-slate-900/50 text-white p-2 rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm" required>
                        <option value="">Selecione o artista</option>
                        {artists.map(artist => <option key={artist.id} value={artist.id}>{artist.name}</option>)}
                    </select>
                )}

                {error && <p className="text-red-400 text-xs text-center bg-red-900/50 p-2 rounded-md">{error}</p>}

                <button type="submit" disabled={status === 'uploading' || status === 'success'} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition disabled:bg-slate-600 disabled:cursor-not-allowed">
                    {status === 'uploading' ? 'Salvando...' : status === 'success' ? 'Salvo com Sucesso!' : 'Salvar no Hub de Mídia'}
                </button>
            </form>
        </div>
    );
};

export default MediaUploaderGadget;