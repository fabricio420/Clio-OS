
import React, { useState } from 'react';
import { UsersIcon, PlusIcon, GlobeIcon } from './icons';

interface CollectiveSelectionProps {
    onCreate: (name: string) => void;
    onJoin: (code: string) => void;
    userName: string;
}

const CollectiveSelection: React.FC<CollectiveSelectionProps> = ({ onCreate, onJoin, userName }) => {
    const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        
        if (mode === 'create') {
            onCreate(inputValue);
        } else {
            onJoin(inputValue);
        }
    };

    return (
        <div className="flex items-center justify-center h-full w-full p-4 relative z-50">
             {/* Background Blur Overlay just for this component if needed, though App.tsx handles main BG */}
            
            <div className="bg-slate-900/60 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] shadow-2xl border border-white/10 ring-1 ring-white/5 max-w-lg w-full text-center animate-in zoom-in-95 duration-300">
                <div className="mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                        <GlobeIcon className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Olá, {userName}!</h1>
                    <p className="text-slate-400">Para começar, precisamos conectar você a um Coletivo.</p>
                </div>

                {mode === 'menu' && (
                    <div className="space-y-4">
                        <button 
                            onClick={() => setMode('create')}
                            className="w-full p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-800 hover:border-blue-500/50 transition-all group flex items-center gap-4 text-left"
                        >
                            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <PlusIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Criar Novo Coletivo</h3>
                                <p className="text-sm text-slate-400">Fundar um novo espaço para meu evento.</p>
                            </div>
                        </button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-slate-900 px-2 text-sm text-slate-500">ou</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => setMode('join')}
                            className="w-full p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-800 hover:border-lime-500/50 transition-all group flex items-center gap-4 text-left"
                        >
                            <div className="p-3 bg-lime-500/20 rounded-lg text-lime-400 group-hover:bg-lime-500 group-hover:text-white transition-colors">
                                <UsersIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Entrar com Código</h3>
                                <p className="text-sm text-slate-400">Já tenho um convite de um grupo.</p>
                            </div>
                        </button>
                    </div>
                )}

                {(mode === 'create' || mode === 'join') && (
                    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div>
                            <label className="block text-left text-sm font-medium text-slate-300 mb-2">
                                {mode === 'create' ? 'Nome do Coletivo' : 'Código do Coletivo'}
                            </label>
                            <input 
                                type="text" 
                                autoFocus
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={mode === 'create' ? 'Ex: Coletivo Poesia Viva' : 'Cole o código aqui...'}
                                className="w-full bg-black/20 text-white p-4 rounded-xl border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <button 
                                type="button" 
                                onClick={() => { setMode('menu'); setInputValue(''); }}
                                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold transition"
                            >
                                Voltar
                            </button>
                            <button 
                                type="submit" 
                                className="flex-[2] py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 font-bold shadow-lg shadow-blue-500/20 transition"
                            >
                                {mode === 'create' ? 'Fundar Coletivo' : 'Entrar'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CollectiveSelection;
