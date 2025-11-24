
import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { XIcon, CheckSquareIcon, SparklesIcon, ShieldCheckIcon, InfoIcon, ArchiveIcon } from '../icons';

const NotificationCenter: React.FC = () => {
    const { history, isHistoryOpen, toggleHistory, clearHistory } = useNotification();

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <SparklesIcon className="w-4 h-4 text-lime-400" />;
            case 'error': return <ShieldCheckIcon className="w-4 h-4 text-red-400" />;
            case 'warning': return <InfoIcon className="w-4 h-4 text-yellow-400" />;
            default: return <InfoIcon className="w-4 h-4 text-sky-400" />;
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] transition-opacity duration-300 ${isHistoryOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleHistory}
            />

            {/* Sidebar Panel */}
            <div 
                className={`fixed top-0 right-0 h-full w-80 bg-slate-900/95 backdrop-blur-2xl border-l border-white/10 z-[90] shadow-2xl transform transition-transform duration-300 ease-out ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <ArchiveIcon className="w-5 h-5 text-sky-400" />
                        Histórico
                    </h2>
                    <button onClick={toggleHistory} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto h-[calc(100%-120px)] p-4 space-y-3">
                    {history.length > 0 ? (
                        history.map((note) => (
                            <div key={note.id} className="bg-slate-800/50 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">{getIcon(note.type)}</div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-200">{note.title}</p>
                                        {note.message && <p className="text-xs text-slate-400 mt-1">{note.message}</p>}
                                        <p className="text-[10px] text-slate-500 mt-2">
                                            {new Date(note.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-slate-500 py-10">
                            <p>Nenhuma notificação recente.</p>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-slate-900/50">
                    <button 
                        onClick={clearHistory}
                        className="w-full py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        disabled={history.length === 0}
                    >
                        Limpar Histórico
                    </button>
                </div>
            </div>
        </>
    );
};

export default NotificationCenter;
