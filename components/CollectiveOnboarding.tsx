
import React, { useState } from 'react';
import { UsersIcon, PlusIcon, ClioAppIcon, CheckSquareIcon } from './icons';

interface CollectiveOnboardingProps {
    onCreateCollective: (name: string, description: string) => void;
    onJoinCollective: (collectiveId: string) => void;
    userAvatar: string;
    userName: string;
}

const CollectiveOnboarding: React.FC<CollectiveOnboardingProps> = ({ onCreateCollective, onJoinCollective, userAvatar, userName }) => {
    const [mode, setMode] = useState<'create' | 'join'>('create');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (mode === 'create') {
             if (!name.trim()) return;
             await onCreateCollective(name, description);
        } else {
             if (!joinCode.trim()) return;
             await onJoinCollective(joinCode.trim());
        }
        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen bg-slate-900 text-white p-4 overflow-hidden relative">
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-lime-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-md w-full bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-sky-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                        <ClioAppIcon className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Bem-vindo ao Clio OS</h1>
                    <p className="text-slate-400 mt-2">
                        Olá, <span className="text-white font-semibold">{userName}</span>! Vamos conectar você ao seu coletivo.
                    </p>
                </div>

                <div className="flex space-x-2 mb-6 bg-slate-900/50 p-1 rounded-lg">
                    <button 
                        onClick={() => setMode('create')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${mode === 'create' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Criar Novo
                    </button>
                    <button 
                        onClick={() => setMode('join')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${mode === 'join' ? 'bg-lime-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Já tenho convite
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {mode === 'create' ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Nome do Coletivo</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UsersIcon className="h-5 w-5 text-slate-500" />
                                    </span>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ex: Sarau da Praça"
                                        className="w-full bg-slate-900/50 text-white pl-10 p-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition placeholder:text-slate-500"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Descrição (Opcional)</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Qual o propósito do seu coletivo?"
                                    rows={3}
                                    className="w-full bg-slate-900/50 text-white p-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-500"
                                />
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Código de Convite</label>
                            <p className="text-xs text-slate-400 mb-2">Peça ao administrador do coletivo para enviar o ID.</p>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CheckSquareIcon className="h-5 w-5 text-slate-500" />
                                </span>
                                <input
                                    type="text"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value)}
                                    placeholder="Ex: a1b2-c3d4-e5f6..."
                                    className="w-full bg-slate-900/50 text-white pl-10 p-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition placeholder:text-slate-500"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 text-white font-bold rounded-lg transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] ${mode === 'create' ? 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 shadow-sky-500/20' : 'bg-gradient-to-r from-lime-600 to-green-500 hover:from-lime-700 hover:to-green-600 shadow-lime-500/20'}`}
                    >
                        {isLoading ? (
                            <span>Processando...</span>
                        ) : (
                            <>
                                <PlusIcon className="w-5 h-5" />
                                <span>{mode === 'create' ? 'Criar Coletivo' : 'Entrar no Coletivo'}</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CollectiveOnboarding;
