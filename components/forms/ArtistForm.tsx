import React, { useState, useEffect } from 'react';
import type { Artist, EventInfoData } from '../../types';
import { FormInput } from './FormElements';

interface ArtistFormProps {
    onSubmit: (data: any, id?: string) => void;
    artist: Artist | null;
    eventInfo: EventInfoData;
}

export const ArtistForm: React.FC<ArtistFormProps> = ({ onSubmit, artist, eventInfo }) => {
    const [formData, setFormData] = useState({ name: '', performanceType: '', contact: '', notes: '', instagram: '', whatsapp: '' });
    
    useEffect(() => { 
        if (artist) {
            setFormData({ 
                name: artist.name, 
                performanceType: artist.performanceType, 
                contact: artist.contact, 
                notes: artist.notes, 
                instagram: artist.instagram || '', 
                whatsapp: artist.whatsapp || '' 
            });
        }
    }, [artist]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setFormData({...formData, [e.target.name]: e.target.value});
    
    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        onSubmit(formData, artist?.id); 
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
            <FormInput label="Contato (E-mail)" name="contact" value={formData.contact} onChange={handleChange} required />
            <FormInput label="WhatsApp" name="whatsapp" placeholder="(99) 99999-9999" value={formData.whatsapp} onChange={handleChange} />
            <FormInput label="Instagram" name="instagram" placeholder="@usuario" value={formData.instagram} onChange={handleChange} />
            <FormInput label="Notas" name="notes" as="textarea" value={formData.notes} onChange={handleChange} rows={3} />
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">Salvar</button>
        </form>
    );
};