
import React, { useState, useRef, useEffect } from 'react';
import {
    PowerIcon, WalletIcon, ArchiveIcon, BrushIcon, BookMarkedIcon, ExternalLinkIcon, HomeIcon,
    CheckSquareIcon, ClockIcon, InfoIcon, ImageIcon, BookOpenIcon, BoxIcon, UsersIcon, FileTextIcon, LifeBuoyIcon, DockAppIcon,
    MusicIcon, GlobeIcon, BriefcaseIcon, UserIcon, RadioIcon, WhatsappIcon
} from './icons';
import type { Member, EventInfoData, ScheduleItem, Track } from '../types';
import type { AppName, AppStates } from '../App';
import ControlCenter from './ControlCenter';

interface DockIconProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const DockIcon: React.FC<DockIconProps> = ({ icon, label, onClick, disabled }) => (
    <div className="relative flex flex-col items-center group flex-shrink-0">
        <span className="absolute bottom-full mb-2 px-2 py-1 text-xs text-white bg-black/70 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
            {label}
        </span>
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center transition-all duration-200 ease-out transform group-hover:-translate-y-2 group-hover:scale-110 disabled:opacity-50 disabled:hover:transform-none"
            aria-label={label}
        >
            {icon}
        </button>
    </div>
);


interface ClioOSDesktopProps {
    onAppClick: (appName: AppName) => void;
    user: Member;
    onLogout: () => void;
    appStates: AppStates;
    isMusicPlayerOpen: boolean;
    onToggleMusicPlayer: () => void;
    eventInfo: EventInfoData;
    schedule: ScheduleItem[];
    clioPlaylist: Track[];
    currentClioTrackIndex: number;
    isClioPlaying: boolean;
    handleClioPlayPause: () => void;
}

const ClioOSDesktop: React.FC<ClioOSDesktopProps> = ({ 
    onAppClick, user, onLogout, appStates, isMusicPlayerOpen, onToggleMusicPlayer,
    eventInfo, schedule, clioPlaylist, currentClioTrackIndex, isClioPlaying, 
    handleClioPlayPause
}) => {
    const [time, setTime] = useState(new Date());
    const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000 * 60); // update every minute
        return () => clearInterval(timer);
    }, []);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userMenuRef]);

    const formattedTime = time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });

    const dockApps: ({ id: AppName, label: string; icon: React.ReactNode, disabled?: boolean } | { type: 'separator' })[] = [
        { id: 'dashboard', label: 'Dashboard', icon: <DockAppIcon bgColorClasses="bg-blue-600"><HomeIcon /></DockAppIcon> },
        { id: 'tasks', label: 'Tarefas', icon: <DockAppIcon bgColorClasses="bg-green-600"><CheckSquareIcon /></DockAppIcon> },
        { id: 'schedule', label: 'Cronograma', icon: <DockAppIcon bgColorClasses="bg-orange-600"><ClockIcon /></DockAppIcon> },
        { id: 'artists', label: 'Artistas', icon: <DockAppIcon bgColorClasses="bg-purple-600"><BrushIcon /></DockAppIcon> },
        { id: 'team_hub', label: 'Hub da Equipe', icon: <DockAppIcon bgColorClasses="bg-teal-500"><UsersIcon /></DockAppIcon> },
        { id: 'inventory', label: 'Inventário', icon: <DockAppIcon bgColorClasses="bg-slate-600"><BoxIcon /></DockAppIcon> },
        { type: 'separator' },
        { id: 'info', label: 'Informações', icon: <DockAppIcon bgColorClasses="bg-indigo-600"><InfoIcon /></DockAppIcon> },
        { id: 'media', label: 'Mídia', icon: <DockAppIcon bgColorClasses="bg-red-600"><ImageIcon /></DockAppIcon> },
        { id: 'gallery', label: 'Galeria', icon: <DockAppIcon bgColorClasses="bg-pink-500"><ImageIcon /></DockAppIcon> },
        { id: 'reports', label: 'Relatórios', icon: <DockAppIcon bgColorClasses="bg-gray-700"><FileTextIcon /></DockAppIcon> },
        { id: 'documentation', label: 'Documentação', icon: <DockAppIcon bgColorClasses="bg-indigo-700"><BookOpenIcon /></DockAppIcon> },
        { type: 'separator' },
        { id: 'finances', label: 'Finanças', icon: <DockAppIcon bgColorClasses="bg-emerald-600"><WalletIcon /></DockAppIcon> },
        { id: 'notebooks', label: 'Cadernos', icon: <DockAppIcon bgColorClasses="bg-amber-600"><BookMarkedIcon /></DockAppIcon> },
        { id: 'clio_player', label: 'Player Clio', icon: <DockAppIcon bgColorClasses="bg-rose-600"><MusicIcon /></DockAppIcon> },
        { id: 'collab_clio', label: 'Collab Clio', icon: <DockAppIcon bgColorClasses="bg-cyan-700"><BriefcaseIcon /></DockAppIcon> },
        { id: 'browser', label: 'Navegador', icon: <DockAppIcon bgColorClasses="bg-cyan-600"><GlobeIcon /></DockAppIcon> },
        { type: 'separator' },
        { id: 'profile', label: 'Meu Perfil', icon: <DockAppIcon bgColorClasses="bg-gray-500"><UserIcon /></DockAppIcon> },
        { id: 'personalize', label: 'Personalizar', icon: <DockAppIcon bgColorClasses="bg-gradient-to-br from-rose-500 to-violet-600"><BrushIcon /></DockAppIcon> },
    ];

    return (
        <div className="absolute inset-0 flex flex-col overflow-hidden">
             {/* Top Menu Bar */}
            <header className="absolute top-0 left-0 right-0 h-7 bg-black/20 backdrop-blur-sm flex items-center justify-between px-4 text-sm text-white/90 z-30">
                <div className="flex-1 flex justify-start">
                    <button
                        onClick={onToggleMusicPlayer}
                        className={`p-1 rounded-md transition-colors ${isMusicPlayerOpen ? 'text-lime-400 bg-white/20' : 'text-white/80 hover:text-white hover:bg-white/20'}`}
                        aria-label="Abrir Music Player"
                    >
                        <MusicIcon className="h-4 w-4" />
                    </button>
                </div>
                <div className="flex-1 flex justify-center">
                     <button 
                        onClick={() => setIsControlCenterOpen(true)} 
                        className="hover:bg-white/10 px-2 py-0.5 rounded-md transition-colors"
                        aria-label="Abrir Centro de Controle"
                    >
                        <span>{formattedTime}</span>
                    </button>
                </div>
                <div className="flex-1 flex items-center justify-end">
                    <div className="relative" ref={userMenuRef}>
                        <button onClick={() => setIsUserMenuOpen(prev => !prev)} className="flex items-center gap-2 p-1 rounded-md hover:bg-white/20 transition-colors">
                            <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full" />
                            <span className="hidden sm:inline">{user.name}</span>
                        </button>
                        
                        {isUserMenuOpen && (
                             <div className="absolute top-full right-0 mt-2 w-64 bg-slate-800/80 backdrop-blur-lg rounded-lg shadow-2xl border border-white/10 text-white p-4 z-50">
                                <div className="flex flex-col items-center text-center">
                                    <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full border-2 border-slate-600 mb-3" />
                                    <p className="font-bold text-lg">{user.name}</p>
                                    <p className="text-sm text-sky-400">{user.role}</p>
                                </div>
                                <hr className="my-3 border-slate-700" />
                                <button
                                    onClick={() => { onAppClick('profile'); setIsUserMenuOpen(false); }}
                                    className="w-full text-left flex items-center gap-3 p-2 rounded-md hover:bg-white/10 transition-colors"
                                >
                                    <UserIcon className="w-5 h-5 text-slate-300" />
                                    <span>Meu Perfil</span>
                                </button>
                                <button
                                    onClick={onLogout}
                                    className="w-full text-left flex items-center gap-3 p-2 rounded-md hover:bg-white/10 transition-colors"
                                >
                                    <PowerIcon className="w-5 h-5 text-red-400" />
                                    <span className="text-red-400">Desligar</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            
            <ControlCenter 
                isOpen={isControlCenterOpen} 
                onClose={() => setIsControlCenterOpen(false)}
                eventInfo={eventInfo}
                schedule={schedule}
                playlist={clioPlaylist}
                currentClioTrackIndex={currentClioTrackIndex}
                isPlaying={isClioPlaying}
                onPlayPause={handleClioPlayPause}
            />

            {/* Empty Desktop Area */}
            <main className="flex-1 pointer-events-none"></main>

            {/* Dock */}
            <footer className="w-full flex justify-center pb-2 z-20 px-2">
                <nav className="flex items-end justify-start md:justify-center gap-1 md:gap-2 h-16 md:h-20 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl max-w-[98vw] overflow-x-auto no-scrollbar">
                    {dockApps.map((app, index) => {
                        if ('type' in app && app.type === 'separator') {
                            return <div key={`sep-${index}`} className="h-8 md:h-12 w-px bg-white/20 self-center flex-shrink-0 mx-1" />;
                        }
                        const { id, label, icon, disabled } = app as { id: AppName, label: string, icon: React.ReactNode, disabled?: boolean };
                        return (
                             <DockIcon 
                                key={id}
                                icon={icon}
                                label={label}
                                disabled={disabled}
                                onClick={() => !disabled && onAppClick(id)}
                             />
                        )
                    })}
                </nav>
            </footer>
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default ClioOSDesktop;
