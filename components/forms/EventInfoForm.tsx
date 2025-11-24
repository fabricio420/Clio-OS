
import React, { useState, useEffect } from 'react';
import type { EventInfoData } from '../../types';
import { FormInput, FormCheckbox } from './FormElements';
import { GlobeIcon, InstagramIcon, ImageIcon } from '../icons';

export const EventInfoForm: React.FC<{onSubmit: (data: EventInfoData) => void, info: EventInfoData | null}> = ({ onSubmit, info }) => {
    const [formData, setFormData] = useState<EventInfoData>({ 
        eventName: '', 
        collectiveName: '', 
        isCollab: false, 
        collabDescription: '', 
        description: '', 
        venueName: '', 
        venueAddress: '', 
        eventDate: '', 
        artistGoal: 0, 
        artTypes: [], 
        hasAwards: false, 
        awardsDescription: '',
        // Public Profile Defaults
        isPublic: false,
        instagram: '',
        coverImage: ''
    });
    
    useEffect(() => { 
        if (info) {
            const date = new Date(info.eventDate);
            const formattedDate = date.toISOString().slice(0, 16);
            setFormData({
                ...info, 
                eventDate: formattedDate,
                isPublic: info.isPublic || false,
                instagram: info.instagram || '',
                coverImage: info.coverImage || ''
            });
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
        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Seção 1: Rede Cultural (Public Profile) */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-4">
                <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2">
                    <GlobeIcon className="w-5 h-5 text-sky-400" />
                    <h3 className="font-bold text-white">Perfil na Rede Cultural</h3>
                </div>
                
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-300">Tornar Coletivo Visível na Rede?</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                    </label>
                </div>
                
                {formData.isPublic && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 pt-2">
                        <FormInput 
                            label="Instagram do Coletivo" 
                            name="instagram" 
                            value={formData.instagram} 
                            onChange={handleChange} 
                            placeholder="@seucoletivo"
                            icon={<InstagramIcon className="w-4 h-4"/>}
                        />
                        <FormInput 
                            label="Link da Imagem de Capa (URL)" 
                            name="coverImage" 
                            value={formData.coverImage} 
                            onChange={handleChange} 
                            placeholder="https://..."
                            icon={<ImageIcon className="w-4 h-4"/>}
                        />
                        <p className="text-xs text-slate-500">
                            * O Nome, Descrição e Tipos de Arte abaixo também aparecerão no seu perfil público.
                        </p>
                    </div>
                )}
            </div>

            {/* Seção 2: Dados do Evento Atual */}
            <div className="space-y-4">
                <h3 className="font-bold text-white border-b border-slate-700 pb-2">Dados do Evento Atual</h3>
                
                <FormInput label="Nome do Evento" name="eventName" value={formData.eventName} onChange={handleChange} required />
                <FormInput label="Nome do Coletivo Organizador" name="collectiveName" value={formData.collectiveName} onChange={handleChange} required />
                
                <div className="space-y-2 rounded-md border border-slate-700 p-3 bg-slate-800/30">
                    <FormCheckbox label="Este é um evento colaborativo?" name="isCollab" checked={formData.isCollab} onChange={handleChange} />
                    {formData.isCollab && <FormInput label="Nome do Coletivo Colaborador" name="collabDescription" value={formData.collabDescription} onChange={handleChange} />}
                </div>

                <FormInput label="Descrição do Evento / Bio do Coletivo" name="description" as="textarea" value={formData.description} onChange={handleChange} rows={4} required />
                <FormInput label="Nome do Local" name="venueName" value={formData.venueName} onChange={handleChange} required />
                <FormInput label="Endereço do Local" name="venueAddress" as="textarea" value={formData.venueAddress} onChange={handleChange} rows={2} required />
                <FormInput label="Data e Hora do Evento" name="eventDate" type="datetime-local" value={formData.eventDate} onChange={handleChange} required />
                <FormInput label="Meta de Artistas" name="artistGoal" type="number" value={formData.artistGoal} onChange={handleChange} required />
                <FormInput 
                    label="Tags / Tipos de Arte (separados por vírgula)" 
                    name="artTypes" 
                    as="textarea" 
                    value={formData.artTypes.join(', ')} 
                    onChange={handleArtTypesChange} 
                    rows={2}
                    placeholder="Poesia, Rap, Dança, Teatro..."
                />
                <div className="space-y-2 rounded-md border border-slate-700 p-3 bg-slate-800/30">
                    <FormCheckbox label="Haverá Premiação?" name="hasAwards" checked={formData.hasAwards} onChange={handleChange} />
                    {formData.hasAwards && <FormInput label="Quais serão os prêmios?" as="textarea" name="awardsDescription" value={formData.awardsDescription} onChange={handleChange} rows={2} />}
                </div>
            </div>

            <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition transform hover:scale-[1.02]">
                Salvar Tudo
            </button>
        </form>
    );
};
