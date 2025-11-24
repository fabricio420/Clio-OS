
import React, { useState, useRef, useEffect } from 'react';
import {
    PowerIcon, WalletIcon, BrushIcon, BookMarkedIcon, HomeIcon,
    CheckSquareIcon, ClockIcon, InfoIcon, ImageIcon, BookOpenIcon, BoxIcon, UsersIcon, FileTextIcon, DockAppIcon,
    GlobeIcon, BriefcaseIcon, UserIcon, SearchIcon, CloudCheckIcon
} from './icons';
import type { Member, EventInfoData, ScheduleItem } from '../types';
import type { AppName, AppStates } from '../App';
import ControlCenter from './ControlCenter';

interface DockIconProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  onHover: (label: string | null) => void;
  disabled?: boolean;
}

const DockIcon: React.FC<DockIconProps> = ({ icon, label, onClick, onHover, disabled }) => (
    <button
        onClick={onClick}
        onMouseEnter={() => onHover(label)}
        // Removed onMouseLeave here to prevent flickering. The container handles clearing.
        disabled={disabled}
        className="group relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex-shrink-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-4 hover:scale-125 focus:outline-none active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0"
        aria-label={label}
    >
        {/* Icon Container with inner glow on hover */}
        <div className="w-full h-full transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] rounded-2xl relative z-10">
            {icon}
        </div>
        
        {/* Reflection Dot (Visual Polish) */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-300 delay-75 scale-0 group-hover:scale-100"></div>
    </button>
);


interface ClioOSDesktopProps {
    onAppClick: (appName: AppName) => void;
    user: Member;
    onLogout: () => void;
    appStates: AppStates;
    eventInfo: EventInfoData;
    schedule: ScheduleItem[];
    onOpenSearch: () => void;
}

const ClioOSDesktop: React.FC<ClioOSDesktopProps> = ({ 
    onAppClick, user, onLogout, appStates,
    eventInfo, schedule, onOpenSearch
}) => {
    const [time, setTime] = useState(new Date());
    const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [hoveredAppLabel, setHoveredAppLabel] = useState<string | null>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const dockRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000 * 60); 
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

    useEffect(() => {
        const dockElement = dockRef.current;
        if (dockElement) {
            const onWheel = (e: WheelEvent) => {
                if (e.deltaY === 0) return;
                // Only prevent default if we can actually scroll (on small screens)
                if (window.innerWidth < 1024) {
                    e.preventDefault();
                    dockElement.scrollLeft += e.deltaY;
                }
            };
            dockElement.addEventListener('wheel', onWheel, { passive: false });
            return () => dockElement.removeEventListener('wheel', onWheel);
        }
    }, []);

    const formattedTime = time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
    const formattedDate = time.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });

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
        { id: 'collab_clio', label: 'Collab Clio', icon: <DockAppIcon bgColorClasses="bg-cyan-700"><BriefcaseIcon /></DockAppIcon> },
        { id: 'browser', label: 'Navegador', icon: <DockAppIcon bgColorClasses="bg-cyan-600"><GlobeIcon /></DockAppIcon> },
        { type: 'separator' },
        { id: 'cultural_network', label: 'Rede Cultural', icon: <DockAppIcon bgColorClasses="bg-gradient-to-r from-violet-600 to-fuchsia-600"><GlobeIcon /></DockAppIcon> },
        { id: 'profile', label: 'Meu Perfil', icon: <DockAppIcon bgColorClasses="bg-gray-500"><UserIcon /></DockAppIcon> },
        { id: 'personalize', label: 'Personalizar', icon: <DockAppIcon bgColorClasses="bg-gradient-to-br from-rose-500 to-violet-600"><BrushIcon /></DockAppIcon> },
    ];

    return (
        <div className="absolute inset-0 flex flex-col overflow-hidden">
             {/* Top Glass Bar */}
            <header className="absolute top-0 left-0 right-0 h-8 bg-black/20 backdrop-blur-lg border-b border-white/5 flex items-center justify-between px-4 text-sm text-white/90 z-30 shadow-sm transition-all hover:bg-black/30">
                <div className="flex-1 flex justify-start items-center gap-4">
                   <button 
                        onClick={onOpenSearch}
                        className="hover:bg-white/10 p-1.5 rounded-lg transition-colors flex items-center gap-2 group"
                        title="Buscar (Ctrl + K)"
                    >
                        <SearchIcon className="w-4 h-4 text-slate-300 group-hover:text-white" />
                        <span className="text-xs text-slate-400 group-hover:text-white hidden md:inline">Buscar</span>
                    </button>
                    
                    <div className="h-4 w-px bg-white/10 mx-1"></div>

                    <button
                        onClick={() => onAppClick('personalize')}
                        className="hover:bg-white/10 p-1.5 rounded-lg transition-colors flex items-center gap-2 group"
                        title="Status do Sistema"
                    >
                        <CloudCheckIcon className="w-4 h-4 text-lime-400 drop-shadow-[0_0_8px_rgba(132,204,22,0.6)]" />
                        <span className="text-xs font-medium text-slate-300 group-hover:text-white hidden md:inline">Clio Cloud</span>
                    </button>
                </div>

                <div className="flex-1 flex justify-center">
                     <button 
                        onClick={() => setIsControlCenterOpen(true)} 
                        className="hover:bg-white/10 px-4 py-1 rounded-full transition-colors font-medium tracking-wide text-xs flex items-center gap-2 border border-transparent hover:border-white/10"
                    >
                        <span className="opacity-70">{formattedDate}</span>
                        <span>{formattedTime}</span>
                    </button>
                </div>

                <div className="flex-1 flex items-center justify-end">
                    <div className="relative" ref={userMenuRef}>
                        <button onClick={() => setIsUserMenuOpen(prev => !prev)} className="flex items-center gap-3 p-1 rounded-full hover:bg-white/10 transition-colors pr-3 border border-transparent hover:border-white/5">
                            <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full border border-white/20 shadow-sm" />
                            <span className="hidden sm:inline text-xs font-medium">{user.name}</span>
                        </button>
                        
                        {isUserMenuOpen && (
                             <div className="absolute top-full right-0 mt-3 w-64 bg-slate-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 text-white p-4 z-50 animate-in fade-in slide-in-from-top-2">
                                <div className="flex flex-col items-center text-center p-2">
                                    <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-slate-700 mb-3 shadow-lg" />
                                    <p className="font-bold text-lg">{user.name}</p>
                                    <p className="text-xs text-sky-400 font-medium uppercase tracking-wider mt-1">{user.role}</p>
                                </div>
                                <hr className="my-3 border-white/10" />
                                <div className="space-y-1">
                                    <button
                                        onClick={() => { onAppClick('profile'); setIsUserMenuOpen(false); }}
                                        className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors group"
                                    >
                                        <UserIcon className="w-5 h-5 text-slate-400 group-hover:text-white" />
                                        <span className="text-sm">Meu Perfil</span>
                                    </button>
                                    <button
                                        onClick={onLogout}
                                        className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-500/20 transition-colors group"
                                    >
                                        <PowerIcon className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                                        <span className="text-sm text-red-400 group-hover:text-red-300">Sair</span>
                                    </button>
                                </div>
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
            />

            <main className="flex-1 pointer-events-none"></main>

            {/* Floating Dock Container */}
            <footer className="w-full flex flex-col items-center justify-end pb-6 z-50 px-4 pointer-events-none fixed bottom-0 left-0 right-0">
                
                 {/* Central Label - Appears above the dock when hovering */}
                 <div className={`
                    mb-5 px-6 py-2 rounded-full bg-slate-900/60 backdrop-blur-xl border border-white/10 text-white text-sm font-medium tracking-wide shadow-[0_10px_30px_rgba(0,0,0,0.5)]
                    transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform origin-bottom select-none
                    ${hoveredAppLabel ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'}
                `}>
                    {hoveredAppLabel || <span className="opacity-0">Placeholder</span>}
                </div>

                <nav 
                    ref={dockRef}
                    className="pointer-events-auto flex items-center justify-start lg:justify-center gap-3 sm:gap-4 px-6 py-4 bg-slate-900/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-[92vw] overflow-x-auto lg:overflow-visible no-scrollbar transition-all hover:bg-slate-900/50"
                    onMouseLeave={() => setHoveredAppLabel(null)}
                >
                    {dockApps.map((app, index) => {
                        if ('type' in app && app.type === 'separator') {
                            return <div key={`sep-${index}`} className="h-8 w-[1px] bg-white/10 self-center flex-shrink-0 mx-1 rounded-full" />;
                        }
                        const { id, label, icon, disabled } = app as { id: AppName, label: string, icon: React.ReactNode, disabled?: boolean };
                        return (
                             <DockIcon 
                                key={id}
                                icon={icon}
                                label={label}
                                disabled={disabled}
                                onClick={() => !disabled && onAppClick(id)}
                                onHover={setHoveredAppLabel}
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
