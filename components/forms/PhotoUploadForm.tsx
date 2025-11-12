import React, { useState, useRef } from 'react';
import type { Photo } from '../../types';
import { FormInput } from './FormElements';
import { UploadCloudIcon } from '../icons';

const fileToBase64 = (file: File): Promise<string> => 
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

interface PhotoUploadFormProps {
    onSubmit: (albumId: string, photos: Omit<Photo, 'id'>[]) => void;
    albumId: string;
}

export const PhotoUploadForm: React.FC<PhotoUploadFormProps> = ({ onSubmit, albumId }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [caption, setCaption] = useState('');
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // FIX: Explicitly type selectedFiles as File[] to fix type inference issues in reduce and map.
            const selectedFiles: File[] = Array.from(e.target.files);
            const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
            if (totalSize > 20 * 1024 * 1024) { // 20MB limit for batch
                setError('O tamanho total dos arquivos excede 20MB.');
                return;
            }
            setFiles(selectedFiles);
            const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviews(previewUrls);
            setError('');
        }
    };
    
    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) {
            setError('Por favor, selecione pelo menos uma foto.');
            return;
        }
        setIsUploading(true);
        setError('');
        try {
            const photosToUpload: Omit<Photo, 'id'>[] = await Promise.all(
                files.map(async file => {
                    const dataUrl = await fileToBase64(file);
                    return {
                        dataUrl,
                        caption,
                        fileName: file.name,
                    };
                })
            );
            onSubmit(albumId, photosToUpload);
        } catch (err) {
            setError('Falha ao processar as imagens. Tente novamente.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            {previews.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-700 rounded-md">
                    {previews.map((src, index) => (
                        <img key={index} src={src} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded"/>
                    ))}
                </div>
            ) : null}
            <button
                type="button"
                onClick={triggerFileSelect}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-slate-600 hover:border-sky-500 rounded-md text-slate-400 transition"
            >
                <UploadCloudIcon className="w-6 h-6"/>
                <span>{files.length > 0 ? `${files.length} arquivos selecionados` : 'Selecionar Fotos'}</span>
            </button>
            <FormInput
                label="Legenda (opcional, aplicada a todas as fotos)"
                name="caption"
                value={caption}
                onChange={(e) => setCaption((e.target as HTMLInputElement).value)}
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
                type="submit"
                disabled={isUploading}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition disabled:bg-slate-600"
            >
                {isUploading ? 'Enviando...' : `Enviar ${files.length} Foto(s)`}
            </button>
        </form>
    );
};