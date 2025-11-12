import React, { useState, useEffect } from 'react';
import type { PhotoAlbum } from '../../types';
import { FormInput } from './FormElements';

interface AlbumFormProps {
    onSubmit: (data: Omit<PhotoAlbum, 'id' | 'photos'>, id?: string) => void;
    album: PhotoAlbum | null;
}

export const AlbumForm: React.FC<AlbumFormProps> = ({ onSubmit, album }) => {
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        if (album) {
            setFormData({ name: album.name, description: album.description });
        }
    }, [album]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, album?.id);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
                label="Nome do Álbum"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <FormInput
                label="Descrição"
                name="description"
                as="textarea"
                value={formData.description}
                onChange={handleChange}
                rows={3}
            />
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">
                Salvar Álbum
            </button>
        </form>
    );
};
