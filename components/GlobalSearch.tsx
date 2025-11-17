
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SearchIcon, XIcon, UserIcon, CheckSquareIcon, MicIcon, BoxIcon, FileTextIcon, WalletIcon, ChevronRightIcon } from './icons';
import { useAppContext } from '../contexts/AppContext';
import type { ModalView } from '../types';

interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenModal: (view: ModalView, data: any) => void;
}

type SearchResultType = 'member' | 'task' | 'artist' | 'inventory' | 'document' | 'finance';

interface SearchResult {
    id: string;
    type: SearchResultType;
    title: string;
    subtitle: string;
    data: any;
    score: number;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, onOpenModal }) => {
    const { members, tasks, artists, inventoryItems, financialProjects, collectiveDocuments } = useAppContext();
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % results.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (results[selectedIndex]) {
                    handleSelect(results[selectedIndex]);
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex]); // Add results to dependency if not using ref, but memoized below handles it

    const results = useMemo(() => {
        if (!query.trim()) return [];

        const lowerQuery = query.toLowerCase();
        let list: SearchResult[] = [];

        // Search Members
        members.forEach(m => {
            if (m.name.toLowerCase().includes(lowerQuery) || m.role.toLowerCase().includes(lowerQuery)) {
                list.push({ id: m.id, type: 'member', title: m.name, subtitle: m.role, data: m, score: 1 });
            }
        });

        // Search Tasks
        tasks.forEach(t => {
            if (t.title.toLowerCase().includes(lowerQuery)) {
                list.push({ id: t.id, type: 'task', title: t.title, subtitle: `Status: ${t.status}`, data: t, score: 1 });
            }
        });

        // Search Artists
        artists.forEach(a => {
            if (a.name.toLowerCase().includes(lowerQuery) || a.performanceType.toLowerCase().includes(lowerQuery)) {
                list.push({ id: a.id, type: 'artist', title: a.name, subtitle: a.performanceType, data: a, score: 1 });
            }
        });

        // Search Inventory
        inventoryItems.forEach(i => {
            if (i.name.toLowerCase().includes(lowerQuery)) {
                list.push({ id: i.id, type: 'inventory', title: i.name, subtitle: `Qtd: ${i.quantity}`, data: i, score: 1 });
            }
        });

        // Search Documents
        collectiveDocuments.forEach(d => {
            if (d.name.toLowerCase().includes(lowerQuery)) {
                list.push({ id: d.id, type: 'document', title: d.name, subtitle: 'Documento', data: null, score: 1 }); // Docs usually don't have edit modal in the same way, might need handling
            }
        });

        // Search Finance Projects
        financialProjects.forEach(p => {
            if (p.name.toLowerCase().includes(lowerQuery)) {
                list.push({ id: p.id, type: 'finance', title: p.name, subtitle: 'Projeto Financeiro', data: p, score: 1 });
            }
        });

        return list.slice(0, 10); // Limit to 10 results
    }, [query, members, tasks, artists, inventoryItems, collectiveDocuments, financialProjects]);


    const handleSelect = (result: SearchResult) => {
        switch (result.type) {
            case 'member': onOpenModal('member', result.data); break;
            case 'task': onOpenModal('task', result.data); break;
            case 'artist': onOpenModal('artist', result.data); break;
            case 'inventory': onOpenModal('inventory', result.data); break;
            case 'finance': onOpenModal('financial_project', result.data); break;
            case 'document': /* Specific handling or open collab app */ break; 
        }
        onClose();
    };

    const getIcon = (type: SearchResultType) => {
        switch (type) {
            case 'member': return <UserIcon className="w-5 h-5 text-blue-400" />;
            case 'task': return <CheckSquareIcon className="w-5 h-5 text-green-400" />;
            case 'artist': return <MicIcon className="w-5 h-5 text-purple-400" />;
            case 'inventory': return <BoxIcon className="w-5 h-5 text-slate-400" />;
            case 'document': return <FileTextIcon className="w-5 h-5 text-sky-400" />;
            case 'finance': return <WalletIcon className="w-5 h-5 text-emerald-400" />;
            default: return <SearchIcon className="w-5 h-5 text-slate-400" />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"></div>

            {/* Search Window */}
            <div 
                className="relative w-full max-w-2xl bg-slate-800 rounded-xl shadow-2xl border border-slate-600 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Input Area */}
                <div className="flex items-center px-4 py-4 border-b border-slate-700">
                    <SearchIcon className="w-6 h-6 text-slate-400 mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 bg-transparent text-xl text-white placeholder:text-slate-500 focus:outline-none"
                        placeholder="Buscar no Clio OS..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <button onClick={onClose} className="p-1 bg-slate-700 text-slate-400 rounded hover:bg-slate-600 hover:text-white text-xs px-2 py-1">
                        ESC
                    </button>
                </div>

                {/* Results List */}
                {results.length > 0 ? (
                    <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2">
                        <div className="px-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Resultados
                        </div>
                        {results.map((result, index) => (
                            <button
                                key={`${result.type}-${result.id}`}
                                onClick={() => handleSelect(result)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={`w-full px-4 py-3 flex items-center justify-between group transition-colors ${
                                    index === selectedIndex ? 'bg-blue-600/20 border-l-4 border-blue-500' : 'hover:bg-slate-700/50 border-l-4 border-transparent'
                                }`}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`p-2 rounded-lg ${index === selectedIndex ? 'bg-slate-800' : 'bg-slate-700'}`}>
                                        {getIcon(result.type)}
                                    </div>
                                    <div className="text-left truncate">
                                        <p className={`font-medium truncate ${index === selectedIndex ? 'text-white' : 'text-slate-200'}`}>
                                            {result.title}
                                        </p>
                                        <p className={`text-xs truncate ${index === selectedIndex ? 'text-blue-200' : 'text-slate-400'}`}>
                                            {result.subtitle}
                                        </p>
                                    </div>
                                </div>
                                {index === selectedIndex && (
                                    <ChevronRightIcon className="w-4 h-4 text-blue-400" />
                                )}
                            </button>
                        ))}
                    </div>
                ) : query.trim() ? (
                    <div className="p-8 text-center text-slate-500">
                        <p>Nenhum resultado encontrado para "{query}"</p>
                    </div>
                ) : (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        <p>Digite para buscar tarefas, membros, artistas e mais...</p>
                    </div>
                )}

                 {/* Footer Hints */}
                 <div className="px-4 py-2 bg-slate-800 border-t border-slate-700 flex items-center justify-end gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-slate-700 rounded">↑↓</span> Navegar</span>
                    <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-slate-700 rounded">↵</span> Selecionar</span>
                 </div>
            </div>
        </div>
    );
};

export default GlobalSearch;
