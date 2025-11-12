import React, { useState, useEffect } from 'react';
import type { EventInfoData } from '../../types';
import { FormInput, FormCheckbox } from './FormElements';

export const EventInfoForm: React.FC<{onSubmit: (data: EventInfoData) => void, info: EventInfoData | null}> = ({ onSubmit, info }) => {
    const [formData, setFormData] = useState<EventInfoData>({ eventName: '', collectiveName: '', isCollab: false, collabDescription: '', description: '', venueName: '', venueAddress: '', eventDate: '', artistGoal: 0, artTypes: [], hasAwards: false, awardsDescription: '' });
    
    useEffect(() => { 
        if (info) {
            const date = new Date(info.eventDate);
            const formattedDate = date.toISOString().slice(0, 16);
            setFormData({...info, eventDate: formattedDate});
        }
     }, [info]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData({...formData, [name]: checked});
        } else if(type === 'number') {
            setFormData({...formData, [name]: parseInt(value, 10) || 0 });
        } else {
            setFormData({...formData, [name]: value});
        }
    };

    const handleArtTypesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const types = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
        setFormData({...formData, artTypes: types});
    }

    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        onSubmit(formData); 
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Nome do Evento" name="eventName" value={formData.eventName} onChange={handleChange} required />
            <FormInput label="Nome do Coletivo Organizador" name="collectiveName" value={formData.collectiveName} onChange={handleChange} required />
            
            <div className="space-y-2 rounded-md border border-slate-700 p-3">
                <FormCheckbox label="Este é um evento colaborativo?" name="isCollab" checked={formData.isCollab} onChange={handleChange} />
                {formData.isCollab && <FormInput label="Nome do Coletivo Colaborador" name="collabDescription" value={formData.collabDescription} onChange={handleChange} />}
            </div>

            <FormInput label="Descrição do Evento" name="description" as="textarea" value={formData.description} onChange={handleChange} rows={4} required />
            <FormInput label="Nome do Local" name="venueName" value={formData.venueName} onChange={handleChange} required />
            <FormInput label="Endereço do Local" name="venueAddress" as="textarea" value={formData.venueAddress} onChange={handleChange} rows={2} required />
            <FormInput label="Data e Hora do Evento" name="eventDate" type="datetime-local" value={formData.eventDate} onChange={handleChange} required />
            <FormInput label="Meta de Artistas" name="artistGoal" type="number" value={formData.artistGoal} onChange={handleChange} required />
            <FormInput 
                label="Tipos de Arte (separados por vírgula)" 
                name="artTypes" 
                as="textarea" 
                value={formData.artTypes.join(', ')} 
                onChange={handleArtTypesChange} 
                rows={2}
            />
             <div className="space-y-2 rounded-md border border-slate-700 p-3">
                <FormCheckbox label="Haverá Premiação?" name="hasAwards" checked={formData.hasAwards} onChange={handleChange} />
                {formData.hasAwards && <FormInput label="Quais serão os prêmios?" as="textarea" name="awardsDescription" value={formData.awardsDescription} onChange={handleChange} rows={2} />}
            </div>
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">Salvar Informações</button>
        </form>
    );
};
