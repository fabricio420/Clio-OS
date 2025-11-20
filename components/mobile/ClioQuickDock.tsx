
import React, { useState } from 'react';
import { HomeIcon, CheckSquareIcon, UsersIcon, WalletIcon, PlusIcon, XIcon, MicIcon, MenuIcon, FileTextIcon, ZapIcon } from '../icons';
import type { AppName } from '../../App';

interface ClioQuickDockProps {
    activeApp: AppName | null;
    onNavigate: (appName: AppName | null) => void;
    onAction: (action: 'task' | 'artist' | 'transaction' | 'document') => void;
    onOpenMenu: () => void;
}

const ClioQuickDock: React.FC<ClioQuickDockProps> = ({ activeApp, onNavigate, onAction, onOpenMenu }) => {
    const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

    const toggleSpeedDial = () => {
        // Vibrate on open if supported
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10);
        }
        setIsSpeedDialOpen(prev => !prev);
    };

    const handleSpeedDialAction = (action: 'task' | 'artist' | 'transaction' | 'document') => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
        onAction(action);
        setIsSpeedDialOpen(false);
    };

    const NavButton: React.FC<{ 
        icon: React.ReactNode; 
        label: string; 
        isActive: boolean; 
        onClick: () => void; 
    }> = ({ icon, label, isActive, onClick }) => (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
        >
            <div className={`transition-transform duration-200 ${isActive ? '-translate-y-1' : ''}`}>
                {React.cloneElement(icon as React.ReactElement, { 
                    className: `w-6 h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`
                })}
            </div>
            <span className={`text-[10px] font-medium transition-opacity duration-200 ${isActive ? 'opacity-100 text-white' : 'opacity-0 hidden'}`}>
                {label}
            </span>
            {isActive && <div className="absolute bottom-2 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]"></div>}
        </button>
    );

    const ActionButton: React.FC<{
        icon: React.ReactNode;
        label: string;
        colorClass: string;
        delay: string;
        onClick: () => void;
    }> = ({ icon, label, colorClass, delay, onClick }) => (
        <div className={`flex items-center gap-3 transition-all duration-300 ease-out transform ${isSpeedDialOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'} ${delay}`}>
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold py-1 px-3 rounded-lg shadow-lg border border-white/10">
                {label}
            </span>
            <button 
                onClick={onClick}
                className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white ${colorClass} hover:brightness-110 active:scale-95 transition-transform`}
            >
                {icon}
            </button>
        </div>
    );

    return (
        <>
            {/* Speed Dial Overlay Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${isSpeedDialOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSpeedDialOpen(false)}
            />

            {/* Speed Dial Actions Container */}
            <div className="fixed bottom-24 right-4 sm:right-1/2 sm:translate-x-[130px] z-50 flex flex-col items-end sm:items-center gap-4 pointer-events-none">
                <div className="pointer-events-auto flex flex-col items-end gap-4 pb-2">
                    <ActionButton 
                        icon={<FileTextIcon className="w-5 h-5" />} 
                        label="Novo Documento" 
                        colorClass="bg-indigo-600" 
                        delay="delay-0"
                        onClick={() => handleSpeedDialAction('document')}
                    />
                    <ActionButton 
                        icon={<WalletIcon className="w-5 h-5" />} 
                        label="Nova Despesa" 
                        colorClass="bg-red-500" 
                        delay="delay-[50ms]"
                        onClick={() => handleSpeedDialAction('transaction')}
                    />
                    <ActionButton 
                        icon={<MicIcon className="w-5 h-5" />} 
                        label="Novo Artista" 
                        colorClass="bg-purple-600" 
                        delay="delay-[100ms]"
                        onClick={() => handleSpeedDialAction('artist')}
                    />
                    <ActionButton 
                        icon={<CheckSquareIcon className="w-5 h-5" />} 
                        label="Nova Tarefa" 
                        colorClass="bg-blue-600" 
                        delay="delay-[150ms]"
                        onClick={() => handleSpeedDialAction('task')}
                    />
                </div>
            </div>

            {/* Bottom Dock */}
            <nav className="fixed bottom-4 left-4 right-4 h-16 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 flex items-center justify-between px-2 sm:px-6 lg:hidden">
                <div className="flex-1 h-full">
                    <NavButton 
                        icon={<HomeIcon />} 
                        label="Início" 
                        isActive={activeApp === null} 
                        onClick={() => onNavigate(null)} 
                    />
                </div>
                <div className="flex-1 h-full">
                    <NavButton 
                        icon={<CheckSquareIcon />} 
                        label="Tarefas" 
                        isActive={activeApp === 'tasks'} 
                        onClick={() => onNavigate('tasks')} 
                    />
                </div>

                {/* Central Trigger Button */}
                <div className="relative -top-6 w-14 h-14 flex-shrink-0">
                    <button 
                        onClick={toggleSpeedDial}
                        className={`w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.5)] flex items-center justify-center text-white transition-all duration-300 transform ${isSpeedDialOpen ? 'rotate-45 scale-110 bg-red-500 from-red-500 to-red-600 shadow-red-500/50' : 'hover:scale-105 active:scale-95'}`}
                    >
                        <PlusIcon className="w-8 h-8" />
                    </button>
                </div>

                <div className="flex-1 h-full">
                    <NavButton 
                        icon={<UsersIcon />} 
                        label="Equipe" 
                        isActive={activeApp === 'team_hub'} 
                        onClick={() => onNavigate('team_hub')} 
                    />
                </div>
                <div className="flex-1 h-full">
                    <NavButton 
                        icon={<MenuIcon />} 
                        label="Apps" 
                        isActive={false} 
                        onClick={onOpenMenu} 
                    />
                </div>
            </nav>
        </>
    );
};

export default ClioQuickDock;
