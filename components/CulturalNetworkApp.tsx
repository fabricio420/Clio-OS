
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { GlobeIcon, InstagramIcon, UsersIcon, CalendarIcon, ExternalLinkIcon, SearchIcon, MapPinIcon } from './icons';
import Header from './Header';
import type { Collective } from '../types';

interface NetworkCollective extends Collective {
    next_event_date?: string;
    tags?: string[];
    instagram?: string;
    cover_image?: string;
    member_count?: number; // Estimated
}

const CollectiveCard: React.FC<{ collective: NetworkCollective, isCurrent: boolean }> = ({ collective, isCurrent }) => {
    return (
        <div className={`group relative bg-slate-900 rounded-xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isCurrent ? 'border-lime-500/50 ring-1 ring-lime-500/20' : 'border-slate-700 hover:border-sky-500/50'}`}>
            {/* Cover Image */}
            <div className="h-32 w-full bg-slate-800 relative overflow-hidden">
                {collective.cover_image ? (
                    <img src={collective.cover_image} alt={collective.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                        <GlobeIcon className="w-12 h-12 text-slate-700" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                
                {isCurrent && (
                    <div className="absolute top-2 right-2 bg-lime-500 text-slate-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                        SEU COLETIVO
                    </div>
                )}
            </div>

            <div className="p-5 relative">
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white leading-tight">{collective.name}</h3>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 line-clamp-2 mb-4 min-h-[2.5rem]">
                    {collective.description || "Sem descrição pública."}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {collective.tags && collective.tags.length > 0 ? (
                        collective.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-[10px] uppercase tracking-wider font-semibold bg-slate-800 text-sky-300 px-2 py-1 rounded-md border border-slate-700">
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span className="text-[10px] text-slate-600 italic">Sem tags</span>
                    )}
                </div>

                {/* Footer Info */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    {collective.next_event_date ? (
                        <div className="flex items-center gap-2 text-xs text-lime-400">
                            <CalendarIcon className="w-3 h-3" />
                            <span>{new Date(collective.next_event_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                    ) : (
                        <span className="text-xs text-slate-500">Sem eventos previstos</span>
                    )}

                    <div className="flex items-center gap-2">
                        {collective.instagram && (
                            <a 
                                href={`https://instagram.com/${collective.instagram.replace('@', '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-1.5 bg-slate-800 rounded-full text-slate-400 hover:text-pink-400 hover:bg-slate-700 transition-colors"
                                title="Instagram"
                            >
                                <InstagramIcon className="w-4 h-4" />
                            </a>
                        )}
                        {/* Future Feature: Direct Message */}
                        {/* <button className="p-1.5 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-blue-600 transition-colors">
                            <UsersIcon className="w-4 h-4" />
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

const CulturalNetworkApp: React.FC<{ currentCollectiveId?: string }> = ({ currentCollectiveId }) => {
    const [collectives, setCollectives] = useState<NetworkCollective[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCollectives();
    }, []);

    const fetchCollectives = async () => {
        setLoading(true);
        // Fetch collectives where is_public is true
        const { data, error } = await supabase
            .from('collectives')
            .select('*')
            .eq('is_public', true)
            .order('name');

        if (data) {
            setCollectives(data as NetworkCollective[]);
        } else if (error) {
            console.error("Error fetching network:", error);
        }
        setLoading(false);
    };

    const filteredCollectives = collectives.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="h-full flex flex-col bg-slate-950">
            <Header 
                title="Rede Cultural" 
                subtitle="Conecte-se com outros coletivos, descubra parceiros e fortaleça a cena."
                action={
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Buscar coletivos..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-full text-sm text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none w-64 transition-all focus:w-80"
                        />
                    </div>
                }
            />

            <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-8">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                    </div>
                ) : filteredCollectives.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCollectives.map(collective => (
                            <CollectiveCard 
                                key={collective.id} 
                                collective={collective} 
                                isCurrent={collective.id === currentCollectiveId}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                        <GlobeIcon className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg">Nenhum coletivo encontrado.</p>
                        <p className="text-sm">Seja o primeiro a publicar seu perfil na rede!</p>
                    </div>
                )}
                
                <div className="mt-12 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="text-lg font-bold text-white mb-1">Quer aparecer aqui?</h4>
                        <p className="text-sm text-slate-400">Vá em <strong>Informações</strong>, ative o "Perfil Público" e configure sua vitrine.</p>
                    </div>
                    <div className="flex -space-x-2">
                        {/* Decorative circles representing users */}
                        <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900"></div>
                        <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-900"></div>
                        <div className="w-8 h-8 rounded-full bg-slate-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white font-bold">+</div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CulturalNetworkApp;
