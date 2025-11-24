
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { Member, Task, ScheduleItem, Artist, ModalView, EventInfoData, MediaItem, InventoryItem, Gadget, PhotoAlbum, Photo, CollectiveDocument, MeetingMinute, VotingTopic, TaskStatus, FinancialProject, Transaction, Notebook, Note, GadgetType, GadgetData, FeedPost, TeamStatus, VoteOption, AuditLog, Collective } from './types';
import { TaskStatus as TaskStatusEnum, InventoryStatus } from './types';
import LoginScreen from './components/LoginScreen';
import ClioOSDesktop from './components/ClioOSDesktop';
import AppWindow from './components/AppWindow';
import PersonalizeApp from './components/PersonalizeApp';
import FinanceApp from './components/FinanceApp';
import NotebooksApp from './components/NotebooksApp';
import PhotoGalleryApp from './components/PhotoGalleryApp';
import BrowserApp from './components/BrowserApp';
import CollabClioApp from './components/CollabClioApp';
import GadgetWrapper from './components/gadgets/GadgetWrapper';
import AnalogClock from './components/gadgets/AnalogClock';
import CountdownGadget from './components/gadgets/CountdownGadget';
import QuickNoteGadget from './components/gadgets/QuickNoteGadget';
import FinancialSummaryGadget from './components/gadgets/FinancialSummaryGadget';
import TeamStatusGadget from './components/gadgets/TeamStatusGadget';
import WeatherGadget from './components/gadgets/WeatherGadget';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/kanban/KanbanBoard';
import Schedule from './components/Schedule';
import Artists from './components/Artists';
import Modal from './components/Modal';
import EventInfo from './components/EventInfo';
import MediaHub from './components/MediaHub';
import Documentation from './components/Documentation';
import TeamHub from './components/TeamHub';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import AvatarViewer from './components/AvatarViewer';
import ControlCenter from './components/ControlCenter';
import GlobalSearch from './components/GlobalSearch';
import CollectiveSelection from './components/CollectiveSelection';
import ClioQuickDock from './components/mobile/ClioQuickDock';
import { ProfileApp } from './components/ProfileApp';
import { TaskForm } from './components/forms/TaskForm';
import { ScheduleForm } from './components/forms/ScheduleForm';
import { ArtistForm } from './components/forms/ArtistForm';
import { EventInfoForm } from './components/forms/EventInfoForm';
import { MediaForm } from './components/forms/MediaForm';
import { InventoryForm } from './components/forms/InventoryForm';
import { MemberForm } from './components/forms/MemberForm';
import { AlbumForm } from './components/forms/AlbumForm';
import { PhotoUploadForm } from './components/forms/PhotoUploadForm';
import { CollectiveDocumentForm } from './components/forms/CollectiveDocumentForm';
import { MeetingMinuteForm } from './components/forms/MeetingMinuteForm';
import { VotingTopicForm } from './components/forms/VotingTopicForm';
import { TransactionForm } from './components/forms/TransactionForm';
import { FinancialProjectForm } from './components/forms/FinancialProjectForm';
import { ChevronLeftIcon, HomeIcon, CheckSquareIcon, ClockIcon, UsersIcon, BoxIcon, InfoIcon, ImageIcon, BookOpenIcon, FileTextIcon, WalletIcon, BookMarkedIcon, BriefcaseIcon, GlobeIcon, UserIcon, BrushIcon, DockAppIcon, MenuIcon, BarChartIcon, StickyNoteIcon, XIcon, SearchIcon, CloudIcon } from './components/icons';
import { AppContext } from './contexts/AppContext';
import { supabase } from './supabaseClient';
import Toast, { ToastType } from './components/Toast';

// --- RESPONSIVE HOOK ---
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);

  return matches;
};


// --- MOCK DATA FOR NEW USERS ---
const defaultEventDate = new Date();

const MOCK_EVENT_INFO: EventInfoData = {
    eventName: 'Meu Novo Sarau',
    collectiveName: 'Meu Coletivo',
    description: 'Use o botão "Editar Informações" para descrever seu evento aqui. Conte sobre o que é, quem pode participar e o que as pessoas podem esperar!',
    venueName: 'Local a definir',
    venueAddress: '',
    eventDate: defaultEventDate.toISOString().slice(0, 16),
    artistGoal: 10,
    artTypes: [],
    hasAwards: false,
    awardsDescription: '',
    isCollab: false,
    collabDescription: '',
};

const DEFAULT_GADGETS: Gadget[] = [
    { id: 'default-countdown', type: 'countdown', position: { x: 20, y: 20 } },
    { id: 'default-note', type: 'quick_note', position: { x: 300, y: 20 }, data: { content: 'Lembretes importantes do Sarau...' } },
    { id: 'default-team', type: 'team_status', position: { x: 20, y: 200 } }
];

const MOCK_INITIAL_DATA = {
    members: [] as Member[],
    tasks: [] as Task[],
    schedule: [] as ScheduleItem[],
    artists: [] as Artist[],
    eventInfo: MOCK_EVENT_INFO,
    mediaItems: [] as MediaItem[],
    inventoryItems: [] as InventoryItem[],
    feedPosts: [] as FeedPost[],
    financialProjects: [] as FinancialProject[],
    notebooks: [] as Notebook[],
    photoAlbums: [] as PhotoAlbum[],
    collectiveDocuments: [] as CollectiveDocument[],
    meetingMinutes: [] as MeetingMinute[],
    votingTopics: [] as VotingTopic[],
    teamStatuses: [] as TeamStatus[],
    gadgets: DEFAULT_GADGETS,
    auditLogs: [] as AuditLog[],
    totalBudget: 0,
};

const wallpapers = [
    { name: 'Clio Rebelde 1', url: 'https://i.postimg.cc/0NYRtj9R/clio-rebelde-editada-0-6.jpg' },
    { name: 'Clio Rebelde 2', url: 'https://i.postimg.cc/76HcmNBn/clio-rebelde-editada-0-5.jpg' },
    { name: 'Clio Rebelde 3', url: 'https://i.postimg.cc/QNP4Tsrv/clio-rebelde-editada-0-2.jpg' },
    { name: 'Clio Rebelde 4', url: 'https://i.postimg.cc/2Sd2MZL7/clio-rebelde-editada-0-1.jpg' },
    { name: 'Clio Rebelde 5', url: 'https://i.postimg.cc/4dyPY22N/clio-rebelde-1920x1080.jpg' },
    { name: 'Clio Rebelde 6', url: 'https://i.postimg.cc/tRZ0fBq3/clio-rebelde-1920x1080-1.jpg' }
];


// --- APP TYPES ---
export type AppName = 
    | 'dashboard' | 'info' | 'tasks' | 'schedule' | 'artists' | 'team_hub' 
    | 'media' | 'inventory' | 'reports' | 'documentation' | 'clio_company' 
    | 'personalize' | 'finances' | 'notebooks' | 'gallery' | 'browser' | 'collab_clio' | 'profile';

export type AppStatus = 'open' | 'minimized' | 'closed';
export type AppStates = Record<AppName, AppStatus>;

const initialAppStates: AppStates = {
    dashboard: 'closed', info: 'closed', tasks: 'closed', schedule: 'closed',
    artists: 'closed', team_hub: 'closed', media: 'closed', inventory: 'closed',
    reports: 'closed', documentation: 'closed', clio_company: 'closed',
    personalize: 'closed', finances: 'closed', notebooks: 'closed', gallery: 'closed',
    browser: 'closed', collab_clio: 'closed', profile: 'closed'
};

const DEFAULT_WALLPAPER = 'https://i.postimg.cc/0NYRtj9R/clio-rebelde-editada-0-6.jpg';
const DEFAULT_AVATAR = 'https://i.postimg.cc/7L8d9B1p/clio-rebelde-editada-0(17).jpg';

const TEST_USER_EMAIL = 'admin@teste.clio';
const TEST_USER: Member = {
    id: 'test-user-id',
    name: 'Usuário de Teste',
    email: TEST_USER_EMAIL,
    avatar: DEFAULT_AVATAR,
    role: 'Membro'
};

const TEST_COLLECTIVE: Collective = {
    id: 'test-collective-id',
    name: 'Coletivo de Teste',
    code: 'admin-test',
    description: 'Espaço de demonstração para testar todas as funcionalidades do Clio OS.'
};

// --- MOBILE-SPECIFIC COMPONENTS ---
const MobileTopBar: React.FC<{ user: Member, onToggleControlCenter: () => void, onOpenProfile: () => void, onOpenSearch: () => void }> = ({ user, onToggleControlCenter, onOpenProfile, onOpenSearch }) => {
    const [time, setTime] = useState(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }));

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }));
        }, 1000 * 60);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="flex-shrink-0 bg-black/30 backdrop-blur-lg h-12 flex items-center justify-between px-3 z-30 border-b border-white/10 relative">
            <div className="flex items-center justify-start flex-1">
                <button onClick={onOpenProfile} className="flex items-center active:opacity-70">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                </button>
            </div>
            
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <span className="font-semibold text-sm text-white">{time}</span>
            </div>

            <div className="flex items-center justify-end gap-2 flex-1">
                 <button onClick={onOpenSearch} className="p-2 rounded-full active:bg-white/20">
                    <SearchIcon className="w-5 h-5 text-white" />
                </button>
                <button onClick={onToggleControlCenter} className="p-2 -mr-2 active:opacity-70">
                    <MenuIcon className="w-6 h-6 text-white" />
                </button>
            </div>
        </header>
    );
};

const MobileAppDrawer: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    apps: { name: AppName; title: string; icon: React.ReactNode }[];
    onAppClick: (appName: AppName) => void;
}> = ({ isOpen, onClose, apps, onAppClick }) => {
    const touchStartY = useRef<number | null>(null);
    const touchEndY = useRef<number | null>(null);
    const minSwipeDistance = 50;

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.targetTouches[0].clientY;
        touchEndY.current = null;
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndY.current = e.targetTouches[0].clientY;
    };
    const handleTouchEnd = () => {
        if (!touchStartY.current || !touchEndY.current) return;
        const distance = touchStartY.current - touchEndY.current;
        const isSwipeDown = distance < -minSwipeDistance;

        if (isSwipeDown) {
            onClose();
        }
        touchStartY.current = null;
        touchEndY.current = null;
    };

    return (
    <>
        <div 
            className={`fixed inset-0 bg-black/50 z-[60] transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        />
        <div
            className={`fixed bottom-0 left-0 right-0 z-[70] bg-slate-900/95 backdrop-blur-xl rounded-t-3xl transition-transform duration-300 ease-out border-t border-white/10 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
            style={{ maxHeight: '85dvh' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto my-4" onClick={onClose}></div>
            <div className="overflow-y-auto p-6 pb-12" style={{ maxHeight: 'calc(85dvh - 40px)' }}>
                <h3 className="text-white font-bold text-lg mb-6 px-1">Todos os Apps</h3>
                <div className="grid grid-cols-4 gap-x-2 gap-y-8">
                    {apps.map(({ name, title, icon }) => (
                        <button key={name} onClick={() => onAppClick(name)} className="flex flex-col items-center justify-start space-y-2 rounded-lg active:scale-95 transition-transform">
                            <div className="w-14 h-14">{icon}</div>
                            <span className="text-xs text-center text-slate-300 font-medium leading-tight">{title}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </>
    );
};

const MobileGadgetWrapper: React.FC<{ children: React.ReactNode, onLongPress: () => void }> = ({ children, onLongPress }) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startPress = () => {
        timerRef.current = setTimeout(() => {
            onLongPress();
        }, 800); // 800ms long press
    };

    const endPress = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    return (
        <div 
            className="relative touch-manipulation select-none"
            onTouchStart={startPress}
            onTouchEnd={endPress}
            onTouchMove={endPress}
            onMouseDown={startPress} // For mouse testing
            onMouseUp={endPress}
            onMouseLeave={endPress}
        >
            {children}
        </div>
    );
};

const MobileGadgetMenu: React.FC<{ isOpen: boolean, onClose: () => void, onRemove: () => void, onChange: () => void }> = ({ isOpen, onClose, onRemove, onChange }) => {
    if (!isOpen) return null;
    return (
         <>
            <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
            <div className="fixed bottom-4 left-4 right-4 bg-slate-800 rounded-xl p-2 z-50 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-10">
                <button onClick={onChange} className="w-full p-3 text-center text-blue-400 font-semibold border-b border-slate-700 active:bg-slate-700 rounded-t-lg">
                    Trocar Gadget
                </button>
                <button onClick={onRemove} className="w-full p-3 text-center text-red-400 font-semibold active:bg-slate-700 rounded-b-lg">
                    Remover Gadget
                </button>
            </div>
            <button onClick={onClose} className="fixed bottom-4 left-0 right-0 mx-auto w-10 h-10 bg-white text-slate-900 rounded-full flex items-center justify-center z-50 shadow-lg font-bold text-lg mb-36">
                <XIcon className="w-6 h-6" />
            </button>
        </>
    )
};

const GadgetSelectorModal: React.FC<{ isOpen: boolean, onClose: () => void, onSelect: (type: GadgetType) => void }> = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;
    
    const options: { type: GadgetType, label: string, icon: React.ReactNode }[] = [
         { type: 'analog_clock', label: 'Relógio', icon: <ClockIcon className="w-6 h-6" /> },
         { type: 'countdown', label: 'Contagem', icon: <ClockIcon className="w-6 h-6 text-lime-400" /> },
         { type: 'quick_note', label: 'Nota', icon: <StickyNoteIcon className="w-6 h-6 text-yellow-400" /> },
         { type: 'financial_summary', label: 'Finanças', icon: <BarChartIcon className="w-6 h-6 text-emerald-400" /> },
         { type: 'team_status', label: 'Equipe', icon: <UsersIcon className="w-6 h-6 text-teal-400" /> },
         { type: 'weather', label: 'Clima', icon: <CloudIcon className="w-6 h-6 text-blue-400" /> },
    ];

    return (
         <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-xl w-full max-w-sm p-4 shadow-2xl border border-slate-600" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4 text-center">Escolher Gadget</h3>
                <div className="grid grid-cols-3 gap-3">
                    {options.map(opt => (
                        <button key={opt.type} onClick={() => onSelect(opt.type)} className="flex flex-col items-center justify-center bg-slate-700 p-3 rounded-lg hover:bg-slate-600 transition-colors space-y-2">
                            {opt.icon}
                            <span className="text-xs text-slate-200">{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>
         </div>
    );
}


// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [users, setUsers] = useState<Member[]>(() => JSON.parse(localStorage.getItem('clio-os-users') || '[]'));
    const [loggedInUser, setLoggedInUser] = useState<Member | null>(null);
    const [currentCollective, setCurrentCollective] = useState<Collective | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    // This state will hold all data for the currently logged-in user
    const [userState, setUserState] = useState<any>(MOCK_INITIAL_DATA);

    const [wallpaperImage, setWallpaperImage] = useState<string | null>(null);
    const [appStates, setAppStates] = useState<AppStates>(initialAppStates);

    // Mobile state
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [activeMobileApp, setActiveMobileApp] = useState<AppName | null>(null);
    const [isMobileControlCenterOpen, setIsMobileControlCenterOpen] = useState(false);
    const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
    const [mobilePage, setMobilePage] = useState(0);
    const [selectedGadgetId, setSelectedGadgetId] = useState<string | null>(null);
    const [isGadgetMenuOpen, setIsGadgetMenuOpen] = useState(false);
    const [isGadgetSelectorOpen, setIsGadgetSelectorOpen] = useState(false);

    // Global Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalView, setModalView] = useState<ModalView | null>(null);
    const [editingItem, setEditingItem] = useState<any>(null);
    
    // Toast State
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    
    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type });
    };

    // Mobile gesture handling
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const touchEndY = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const minSwipeDistance = 50;

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.targetTouches[0].clientY;
        touchStartX.current = e.targetTouches[0].clientX;
        touchEndY.current = null;
        touchEndX.current = null;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndY.current = e.targetTouches[0].clientY;
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartY.current || !touchEndY.current || !touchStartX.current || !touchEndX.current) return;

        const xDiff = touchStartX.current - touchEndX.current;
        const yDiff = touchStartY.current - touchEndY.current;

        const isHorizontal = Math.abs(xDiff) > Math.abs(yDiff);

        // Don't trigger if a panel is already open
        if (isAppDrawerOpen || isMobileControlCenterOpen || isSearchOpen || activeMobileApp) {
            touchStartY.current = null; touchStartX.current = null;
            touchEndY.current = null; touchEndX.current = null;
            return;
        }

        if (isHorizontal) {
             if (Math.abs(xDiff) > minSwipeDistance) {
                 if (xDiff > 0) {
                     // Swiped Left -> Next Page
                     setMobilePage(prev => Math.min(prev + 1, 2)); // Max 3 pages (0, 1, 2)
                 } else {
                     // Swiped Right -> Prev Page
                     setMobilePage(prev => Math.max(prev - 1, 0));
                 }
             }
        } else {
            // Vertical Swipes
             if (yDiff < -minSwipeDistance) {
                 setIsMobileControlCenterOpen(true);
             }
        }
        
        // Reset refs
        touchStartY.current = null; touchStartX.current = null;
        touchEndY.current = null; touchEndX.current = null;
    };

    // --- SUPABASE AUTH ---
    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setLoadingAuth(true);
            if (session?.user) {
                fetchUserProfile(session.user.id, session.user.email!);
            } else {
                setLoadingAuth(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchUserProfile(session.user.id, session.user.email!);
            } else {
                setLoggedInUser(null);
                setCurrentCollective(null);
                setUserState(MOCK_INITIAL_DATA); // Reset to defaults
                setLoadingAuth(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // --- FETCH DATA WHEN COLLECTIVE CHANGES ---
    useEffect(() => {
        if (loggedInUser && currentCollective) {
            fetchTasks();
            fetchArtists();
            fetchFinancialData();
            fetchSchedule();
            fetchInventory();
            fetchFeedPosts();
            fetchTeamStatuses();
            fetchCollabData();
            fetchNotebooks();
            fetchMedia();
            fetchAlbums();
            fetchAuditLogs();
        }
    }, [loggedInUser, currentCollective]);

    // --- SUPABASE REALTIME SUBSCRIPTION ---
    useEffect(() => {
        if (!loggedInUser || !currentCollective) return;

        // Channel for general data updates
        const channel = supabase.channel('clio_realtime_sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => fetchTasks())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'artists' }, () => fetchArtists())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'schedule_items' }, () => fetchSchedule())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory_items' }, () => fetchInventory())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'financial_projects' }, () => fetchFinancialData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => fetchFinancialData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'team_feed_posts' }, () => fetchFeedPosts())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'team_statuses' }, () => fetchTeamStatuses())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'collective_documents' }, () => fetchCollabData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'meeting_minutes' }, () => fetchCollabData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'voting_topics' }, () => fetchCollabData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'voting_options' }, () => fetchCollabData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notebooks' }, () => fetchNotebooks())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, () => fetchNotebooks())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'media_items' }, () => fetchMedia())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'photo_albums' }, () => fetchAlbums())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, () => fetchAlbums())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchAllProfiles())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'audit_logs' }, () => fetchAuditLogs())
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Clio OS Realtime: Conectado');
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [loggedInUser, currentCollective]);


    const fetchUserProfile = async (userId: string, email: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (data) {
                const user: Member = {
                    id: data.id,
                    email: email,
                    name: data.name || 'Usuário',
                    role: data.role || 'Membro',
                    avatar: data.avatar || DEFAULT_AVATAR
                };
                setLoggedInUser(user);
                loadUserData(email);
                fetchAllProfiles();
                checkUserMembership(userId); // Check if they are already in a collective
            } else {
                 // Profile doesn't exist in DB (maybe signed up before table existed), create it now
                 const newUser: Member = {
                    id: userId,
                    email: email,
                    name: email.split('@')[0], // Default name
                    role: 'Membro',
                    avatar: DEFAULT_AVATAR
                };
                 
                 const { error: insertError } = await supabase.from('profiles').insert([{ 
                     id: userId, 
                     name: newUser.name, 
                     email: newUser.email, 
                     role: newUser.role, 
                     avatar: newUser.avatar 
                 }]);

                 if (!insertError) {
                     setLoggedInUser(newUser);
                     loadUserData(email);
                     fetchAllProfiles();
                     checkUserMembership(userId);
                 } else {
                     console.error("Error auto-creating profile:", insertError);
                 }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingAuth(false);
        }
    };
    
    const checkUserMembership = async (userId: string) => {
        try {
            // Check if user is linked to any collective
            const { data, error } = await supabase
                .from('collective_members')
                .select('collective_id, collectives(*)')
                .eq('member_id', userId)
                .single(); // For now, assuming user belongs to one collective. If multiple, this needs array handling.

            if (data && data.collectives) {
                const c = data.collectives as any;
                const loadedCollective: Collective = {
                    id: c.id,
                    name: c.name,
                    code: c.code,
                    description: c.description
                };
                setCurrentCollective(loadedCollective);
                updateUserState('eventInfo', { ...MOCK_EVENT_INFO, collectiveName: c.name, eventName: `Evento de ${c.name}` });
            } else {
                setCurrentCollective(null); // Will trigger selection screen
            }
        } catch (err) {
            console.error("Error checking membership:", err);
            setCurrentCollective(null);
        }
    }
    
    const fetchAllProfiles = async () => {
        const { data } = await supabase.from('profiles').select('*');
        if (data) {
            const mappedMembers = data.map((p: any) => ({
                id: p.id,
                name: p.name || 'Sem Nome',
                role: p.role || 'Membro',
                avatar: p.avatar || DEFAULT_AVATAR,
                email: p.email || ''
            }));
            updateUserState('members', mappedMembers);
        }
    };

    // --- AUDIT LOG HELPER ---
    const logAction = async (action: 'CREATE' | 'UPDATE' | 'DELETE', entity: string, details: string) => {
        if (!loggedInUser || !currentCollective) return;
        try {
            const payload = {
                user_id: loggedInUser.id,
                user_name: loggedInUser.name,
                user_avatar: loggedInUser.avatar,
                action: action,
                entity: entity,
                details: details,
                collective_id: currentCollective.id,
                created_at: new Date().toISOString()
            };
            
            const { error } = await supabase.from('audit_logs').insert(payload);
            if (error && error.code === '42703') { // Undefined column
                 const { collective_id, ...rest } = payload;
                 await supabase.from('audit_logs').insert(rest);
            }
        } catch (err) {
            console.error("Error logging action:", err); 
        }
    };
    
    // --- SAFE FETCH HELPER ---
    const safeFetch = async (
        table: string, 
        select = '*', 
        collectiveId?: string, 
        orderBy?: { col: string, asc: boolean }, 
        limit?: number
    ) => {
        try {
            let query = supabase.from(table).select(select);
            
            if (collectiveId) {
                query = query.eq('collective_id', collectiveId);
            }
            
            if (orderBy) {
                query = query.order(orderBy.col, { ascending: orderBy.asc });
            }
            
            if (limit) {
                query = query.limit(limit);
            }

            const res = await query;
            if (!res.error) return res;

            // If error is related to missing column, try fallback (Shared Space Mode)
            // PGRST204: Column not found. 42703: Undefined column.
            if (res.error.code === 'PGRST204' || res.error.code === '42703' || res.error.message?.includes('column')) {
                let fallback = supabase.from(table).select(select);
                if (orderBy) fallback = fallback.order(orderBy.col, { ascending: orderBy.asc });
                if (limit) fallback = fallback.limit(limit);
                return await fallback;
            }
            
            throw res.error;
        } catch (err) {
            console.warn(`Error fetching ${table} (safely):`, err);
            return { data: null, error: err };
        }
    };

    // --- SUPABASE DATA FETCHING (CORE) ---
    const fetchTasks = async () => {
        if (!currentCollective) return;
        const { data } = await safeFetch('tasks', '*', currentCollective.id);
        if (data) {
            const mappedTasks: Task[] = data.map((t: any) => ({
                id: t.id,
                title: t.title,
                description: t.description,
                status: t.status as TaskStatusEnum,
                dueDate: t.due_date,
                assigneeId: t.assignee_id,
                collectiveId: t.collective_id
            }));
            updateUserState('tasks', mappedTasks);
        }
    };

    const fetchArtists = async () => {
        if (!currentCollective) return;
        const { data } = await safeFetch('artists', '*', currentCollective.id);
        if (data) {
            const mappedArtists: Artist[] = data.map((a: any) => ({
                id: a.id,
                name: a.name,
                performanceType: a.performance_type,
                contact: a.contact,
                notes: a.notes,
                instagram: a.instagram,
                whatsapp: a.whatsapp,
                cpf: a.cpf,
                rg: a.rg,
                documentImage: a.document_image,
                collectiveId: a.collective_id
            }));
            updateUserState('artists', mappedArtists);
        }
    };

    const fetchSchedule = async () => {
        if (!currentCollective) return;
        const { data } = await safeFetch('schedule_items', '*', currentCollective.id);
        if (data) {
            updateUserState('schedule', data);
        }
    };

    const fetchInventory = async () => {
        if (!currentCollective) return;
        const { data } = await safeFetch('inventory_items', '*', currentCollective.id);
        if (data) {
            const mappedInventory = data.map((i: any) => ({
                id: i.id,
                name: i.name,
                quantity: i.quantity,
                status: i.status,
                responsibleId: i.responsible_id,
                collectiveId: i.collective_id
            }));
            updateUserState('inventoryItems', mappedInventory);
        }
    };

    const fetchFinancialData = async () => {
        if (!currentCollective) return;
        const { data } = await safeFetch('financial_projects', '*, transactions (*)', currentCollective.id);

        if (data) {
            const mappedProjects: FinancialProject[] = data.map((p: any) => ({
                id: p.id,
                name: p.name,
                description: p.description,
                collectiveId: p.collective_id,
                transactions: (p.transactions || []).map((t: any) => ({
                    id: t.id,
                    description: t.description,
                    amount: t.amount,
                    type: t.type as 'income' | 'expense',
                    date: t.date,
                    category: t.category
                }))
            }));
            updateUserState('financialProjects', mappedProjects);
        }
    };

    // --- SUPABASE FEED & COLLAB FETCHING ---
    const fetchFeedPosts = async () => {
        if (!currentCollective) return;
        const { data } = await safeFetch(
            'team_feed_posts', 
            '*, author:profiles(*)', 
            currentCollective.id, 
            { col: 'created_at', asc: false }
        );

        if (data) {
            const mappedPosts: FeedPost[] = data.map((p: any) => ({
                id: p.id,
                content: p.content,
                timestamp: p.created_at,
                collectiveId: p.collective_id,
                author: {
                    id: p.author?.id,
                    name: p.author?.name || 'Desconhecido',
                    role: p.author?.role || '',
                    avatar: p.author?.avatar || DEFAULT_AVATAR,
                    email: p.author?.email || ''
                }
            }));
            updateUserState('feedPosts', mappedPosts);
        }
    };

    const fetchTeamStatuses = async () => {
        if (!currentCollective) return;
        const { data } = await safeFetch('team_statuses', '*', currentCollective.id);
        if (data) {
            const mappedStatuses = data.map((s: any) => ({
                memberId: s.member_id,
                status: s.status,
                collectiveId: s.collective_id
            }));
            updateUserState('teamStatuses', mappedStatuses);
        }
    };

    const fetchCollabData = async () => {
        if (!currentCollective) return;
        // Documents
        const { data: docs } = await safeFetch('collective_documents', '*', currentCollective.id);
        if (docs) {
            const mappedDocs = docs.map((d: any) => ({
                id: d.id,
                name: d.name,
                fileDataUrl: d.file_data_url,
                fileName: d.file_name,
                fileType: d.file_type,
                uploadedAt: d.created_at,
                uploaderId: d.uploader_id,
                collectiveId: d.collective_id
            }));
            updateUserState('collectiveDocuments', mappedDocs);
        }

        // Meeting Minutes
        const { data: minutes } = await safeFetch('meeting_minutes', '*', currentCollective.id);
        if (minutes) {
            const mappedMinutes = minutes.map((m: any) => ({
                id: m.id,
                date: m.date,
                attendeeIds: m.attendee_ids || [],
                agenda: m.agenda,
                decisions: m.decisions,
                collectiveId: m.collective_id
            }));
            updateUserState('meetingMinutes', mappedMinutes);
        }

        // Voting Topics & Options
        const { data: topics } = await safeFetch('voting_topics', '*, options:voting_options(*)', currentCollective.id);
        
        if (topics) {
            const mappedTopics: VotingTopic[] = topics.map((t: any) => ({
                id: t.id,
                title: t.title,
                description: t.description,
                creatorId: t.creator_id,
                createdAt: t.created_at,
                status: t.status,
                collectiveId: t.collective_id,
                options: (t.options || []).map((o: any) => ({
                    id: o.id,
                    text: o.text,
                    voterIds: o.voter_ids || []
                }))
            }));
            updateUserState('votingTopics', mappedTopics);
        }
    };
    
    // --- SUPABASE NOTEBOOKS, MEDIA, GALLERY ---
    const fetchNotebooks = async () => {
        if (!currentCollective) return;
        const { data } = await safeFetch('notebooks', '*, notes(*)', currentCollective.id);
        if(data) {
            const mapped = data.map((nb: any) => ({
                id: nb.id,
                name: nb.name,
                collectiveId: nb.collective_id,
                notes: (nb.notes || []).map((n: any) => ({
                    id: n.id,
                    title: n.title,
                    content: n.content,
                    updatedAt: n.updated_at
                }))
            }));
            updateUserState('notebooks', mapped);
        }
    };

    const fetchMedia = async () => {
         if (!currentCollective) return;
         const { data } = await safeFetch('media_items', '*', currentCollective.id);
         if(data) {
            const mapped = data.map((m: any) => ({
                id: m.id,
                title: m.title,
                category: m.category,
                fileDataUrl: m.file_data_url,
                fileName: m.file_name,
                artistId: m.artist_id,
                collectiveId: m.collective_id
            }));
            updateUserState('mediaItems', mapped);
         }
    }

    const fetchAlbums = async () => {
         if (!currentCollective) return;
         const { data } = await safeFetch('photo_albums', '*, photos(*)', currentCollective.id);
         if(data) {
            const mapped = data.map((a: any) => ({
                id: a.id,
                name: a.name,
                description: a.description,
                collectiveId: a.collective_id,
                photos: (a.photos || []).map((p: any) => ({
                    id: p.id,
                    dataUrl: p.data_url,
                    caption: p.caption,
                    fileName: p.file_name 
                }))
            }));
            updateUserState('photoAlbums', mapped);
         }
    }

    const fetchAuditLogs = async () => {
        if (!currentCollective) return;
        const { data } = await safeFetch(
            'audit_logs', 
            '*', 
            currentCollective.id, 
            { col: 'created_at', asc: false }, 
            50
        );
        
        if (data) {
            const mappedLogs: AuditLog[] = data.map((l: any) => ({
                id: l.id,
                userId: l.user_id,
                userName: l.user_name || 'Desconhecido',
                userAvatar: l.user_avatar || DEFAULT_AVATAR,
                action: l.action,
                entity: l.entity,
                details: l.details,
                timestamp: l.created_at,
                collectiveId: l.collective_id
            }));
            updateUserState('auditLogs', mappedLogs);
        }
    };

    // --- SUPABASE HANDLERS (CRUD) ---

    // Tasks
    const handleSaveTask = async (taskData: Omit<Task, 'id' | 'status'>, editingId?: string) => {
        if (!currentCollective) return;
        try {
            if (editingId) {
                await supabase.from('tasks').update({ title: taskData.title, description: taskData.description, due_date: taskData.dueDate, assignee_id: taskData.assigneeId || null }).eq('id', editingId);
                logAction('UPDATE', 'Tarefa', `Editou a tarefa: ${taskData.title}`);
                showToast('Tarefa atualizada!', 'success');
            } else {
                const payload = { 
                    title: taskData.title, 
                    description: taskData.description, 
                    due_date: taskData.dueDate, 
                    assignee_id: taskData.assigneeId || null, 
                    status: TaskStatusEnum.ToDo,
                    collective_id: currentCollective.id
                };
                
                const { error } = await supabase.from('tasks').insert([payload]);
                if (error && error.code === '42703') {
                     const { collective_id, ...rest } = payload;
                     await supabase.from('tasks').insert([rest]);
                }
                
                logAction('CREATE', 'Tarefa', `Criou nova tarefa: ${taskData.title}`);
                showToast('Tarefa criada!', 'success');
            }
        } catch (err) { console.error(err); showToast('Erro ao salvar tarefa', 'error'); }
    };
    const handleDeleteTask = async (id: string) => { 
        const task = tasks.find(t => t.id === id);
        await supabase.from('tasks').delete().eq('id', id); 
        logAction('DELETE', 'Tarefa', `Excluiu a tarefa: ${task?.title || id}`);
        showToast('Tarefa excluída', 'info');
    };
    const handleUpdateTaskStatus = async (id: string, status: TaskStatus) => { 
        await supabase.from('tasks').update({ status }).eq('id', id);
        const task = tasks.find(t => t.id === id);
        logAction('UPDATE', 'Tarefa', `Moveu tarefa "${task?.title}" para ${status}`);
    };

    // Artists
    const handleSaveArtist = async (data: any, id?: string) => {
        if (!currentCollective) return;
        const payload = { name: data.name, performance_type: data.performanceType, contact: data.contact, notes: data.notes, instagram: data.instagram, whatsapp: data.whatsapp, cpf: data.cpf, rg: data.rg, document_image: data.documentImage, collective_id: currentCollective.id };
        
        const performInsert = async (p: any) => {
            const { error } = await supabase.from('artists').insert([p]);
            if (error && error.code === '42703') {
                const { collective_id, ...rest } = p;
                await supabase.from('artists').insert([rest]);
            }
        };

        if(id) {
            await supabase.from('artists').update(payload).eq('id', id);
            logAction('UPDATE', 'Artista', `Atualizou dados de: ${data.name}`);
            showToast('Artista atualizado!', 'success');
        } else {
            await performInsert(payload);
            logAction('CREATE', 'Artista', `Cadastrou novo artista: ${data.name}`);
            showToast('Artista cadastrado!', 'success');
        }
    };
    const handleDeleteArtist = async (id: string) => { 
        const artist = artists.find(a => a.id === id);
        await supabase.from('artists').delete().eq('id', id); 
        logAction('DELETE', 'Artista', `Removeu artista: ${artist?.name || id}`);
        showToast('Artista removido', 'info');
    };

    // Schedule
    const handleSaveScheduleItem = async (data: any, id?: string) => {
        if (!currentCollective) return;
        const payload = { ...data, collective_id: currentCollective.id };
        if(id) {
            await supabase.from('schedule_items').update(data).eq('id', id);
            logAction('UPDATE', 'Cronograma', `Editou item do cronograma: ${data.time} - ${data.title}`);
            showToast('Cronograma atualizado!', 'success');
        } else {
            const { error } = await supabase.from('schedule_items').insert([payload]);
            if (error && error.code === '42703') {
                const { collective_id, ...rest } = payload;
                await supabase.from('schedule_items').insert([rest]);
            }
            logAction('CREATE', 'Cronograma', `Adicionou ao cronograma: ${data.time} - ${data.title}`);
            showToast('Item adicionado ao cronograma!', 'success');
        }
    };
    const handleDeleteScheduleItem = async (id: string) => { 
        const item = schedule.find(i => i.id === id);
        await supabase.from('schedule_items').delete().eq('id', id); 
        logAction('DELETE', 'Cronograma', `Removeu item: ${item?.title || id}`);
        showToast('Item removido do cronograma', 'info');
    };

    // Inventory
    const handleSaveInventoryItem = async (data: any, id?: string) => {
        if (!currentCollective) return;
        const payload = { name: data.name, quantity: data.quantity, status: data.status, responsible_id: data.responsibleId, collective_id: currentCollective.id };
        if(id) {
            await supabase.from('inventory_items').update(payload).eq('id', id);
            logAction('UPDATE', 'Inventário', `Atualizou item: ${data.name} (${data.quantity})`);
            showToast('Item atualizado!', 'success');
        } else {
            const { error } = await supabase.from('inventory_items').insert([payload]);
            if (error && error.code === '42703') {
                 const { collective_id, ...rest } = payload;
                 await supabase.from('inventory_items').insert([rest]);
            }
            logAction('CREATE', 'Inventário', `Adicionou item: ${data.name} (${data.quantity})`);
            showToast('Item adicionado ao inventário!', 'success');
        }
    };
    const handleDeleteInventoryItem = async (id: string) => { 
        const item = inventoryItems.find(i => i.id === id);
        await supabase.from('inventory_items').delete().eq('id', id); 
        logAction('DELETE', 'Inventário', `Removeu item: ${item?.name || id}`);
        showToast('Item removido do inventário', 'info');
    };

    // Finances
    const handleSaveFinancialProject = async (data: any, id?: string) => {
        if (!currentCollective) return;
        if(id) {
            await supabase.from('financial_projects').update({ name: data.name, description: data.description }).eq('id', id);
            logAction('UPDATE', 'Financeiro', `Editou projeto: ${data.name}`);
            showToast('Projeto atualizado!', 'success');
        } else {
            const payload = { name: data.name, description: data.description, collective_id: currentCollective.id };
            const { error } = await supabase.from('financial_projects').insert([payload]);
             if (error && error.code === '42703') {
                 const { collective_id, ...rest } = payload;
                 await supabase.from('financial_projects').insert([rest]);
            }
            logAction('CREATE', 'Financeiro', `Criou projeto: ${data.name}`);
            showToast('Projeto criado!', 'success');
        }
    };
    const handleDeleteFinancialProject = async (id: string) => { 
        const project = financialProjects.find(p => p.id === id);
        await supabase.from('financial_projects').delete().eq('id', id); 
        logAction('DELETE', 'Financeiro', `Excluiu projeto: ${project?.name || id}`);
        showToast('Projeto excluído', 'info');
    };
    const handleSaveTransaction = async (projId: string, data: any, id?: string) => {
        const payload = { project_id: projId, description: data.description, amount: data.amount, type: data.type, date: data.date, category: data.category };
        if(id) {
            await supabase.from('transactions').update(payload).eq('id', id);
            logAction('UPDATE', 'Financeiro', `Editou transação: ${data.description} (R$${data.amount})`);
            showToast('Transação atualizada!', 'success');
        } else {
            await supabase.from('transactions').insert([payload]);
            logAction('CREATE', 'Financeiro', `Nova transação: ${data.description} (R$${data.amount})`);
            showToast('Transação registrada!', 'success');
        }
    };
    const handleDeleteTransaction = async (pid: string, id: string) => { 
        await supabase.from('transactions').delete().eq('id', id); 
        logAction('DELETE', 'Financeiro', 'Excluiu uma transação');
        showToast('Transação excluída', 'info');
    };

    // Team Hub (Feed & Status)
    const handleAddPost = async (content: string, author: Member) => {
        if (!loggedInUser || !currentCollective) return;
        const payload = { content, author_id: loggedInUser.id, collective_id: currentCollective.id };
        const { error } = await supabase.from('team_feed_posts').insert([payload]);
        if (error && error.code === '42703') {
             const { collective_id, ...rest } = payload;
             await supabase.from('team_feed_posts').insert([rest]);
        }
        showToast('Postagem publicada!', 'success');
    };
    const handleUpdateTeamStatus = async (statusText: string) => {
        if (!loggedInUser || !currentCollective) return;
        const payload = { member_id: loggedInUser.id, status: statusText, collective_id: currentCollective.id };
        const { error } = await supabase.from('team_statuses').upsert(payload);
        if (error && error.code === '42703') {
              const { collective_id, ...rest } = payload;
             await supabase.from('team_statuses').upsert(rest);
        }
        showToast('Status atualizado!', 'success');
    };

    // Collab Clio (Docs, Minutes, Voting)
    const handleSaveCollectiveDocument = async (docData: any, uploaderId: string) => {
        if (!currentCollective) return;
        const payload = {
            name: docData.name,
            file_data_url: docData.fileDataUrl, 
            file_name: docData.file.name,
            file_type: docData.file.type,
            uploader_id: uploaderId,
            collective_id: currentCollective.id
        };
        const { error } = await supabase.from('collective_documents').insert([payload]);
         if (error && error.code === '42703') {
             const { collective_id, ...rest } = payload;
             await supabase.from('collective_documents').insert([rest]);
        }
        logAction('CREATE', 'Documentos', `Carregou documento: ${docData.name}`);
        showToast('Documento salvo!', 'success');
    };
    const handleDeleteCollectiveDocument = async (id: string) => {
        if(window.confirm('Tem certeza?')) {
            await supabase.from('collective_documents').delete().eq('id', id);
            logAction('DELETE', 'Documentos', 'Excluiu um documento');
            showToast('Documento excluído', 'info');
        }
    };

    const handleSaveMeetingMinute = async (data: any, id?: string) => {
        if (!currentCollective) return;
        const payload = { date: data.date, attendee_ids: data.attendeeIds, agenda: data.agenda, decisions: data.decisions, collective_id: currentCollective.id };
        if(id) {
            await supabase.from('meeting_minutes').update(payload).eq('id', id);
            logAction('UPDATE', 'Reuniões', `Atualizou ata de: ${data.date}`);
            showToast('Ata atualizada!', 'success');
        } else {
            const { error } = await supabase.from('meeting_minutes').insert([payload]);
            if (error && error.code === '42703') {
                const { collective_id, ...rest } = payload;
                await supabase.from('meeting_minutes').insert([rest]);
            }
            logAction('CREATE', 'Reuniões', `Criou ata de reunião: ${data.date}`);
            showToast('Ata salva!', 'success');
        }
    };
    const handleDeleteMeetingMinute = async (id: string) => {
        if(window.confirm('Tem certeza?')) {
            await supabase.from('meeting_minutes').delete().eq('id', id);
            logAction('DELETE', 'Reuniões', 'Excluiu ata de reunião');
            showToast('Ata excluída', 'info');
        }
    };

    const handleSaveVotingTopic = async (data: any, creatorId: string) => {
        if (!currentCollective) return;
        
        const payload = { title: data.title, description: data.description, creator_id: creatorId, collective_id: currentCollective.id };
        
        // Try inserting with collective_id
        let { data: topic, error } = await supabase
            .from('voting_topics')
            .insert([payload])
            .select()
            .single();
        
        // Fallback if column missing
        if (error && error.code === '42703') {
             const { collective_id, ...rest } = payload;
             const res = await supabase.from('voting_topics').insert([rest]).select().single();
             topic = res.data;
             error = res.error;
        }
        
        if (topic && !error) {
            const optionsPayload = data.options.map((o: any) => ({
                topic_id: topic.id,
                text: o.text
            }));
            await supabase.from('voting_options').insert(optionsPayload);
            logAction('CREATE', 'Votação', `Iniciou votação: ${data.title}`);
            showToast('Votação criada!', 'success');
        }
    };

    const handleCastVote = async (topicId: string, optionId: string, voterId: string) => {
        // This logic is simplified. In a real app, this should be a Postgres function to be atomic.
        // 1. Get current options for the topic
        const { data: options } = await supabase.from('voting_options').select('*').eq('topic_id', topicId);
        if (!options) return;

        // 2. Remove voterId from all options of this topic
        for (const opt of options) {
            const currentVoters = opt.voter_ids || [];
            if (currentVoters.includes(voterId)) {
                const newVoters = currentVoters.filter((id: string) => id !== voterId);
                await supabase.from('voting_options').update({ voter_ids: newVoters }).eq('id', opt.id);
            }
        }

        // 3. Add voterId to selected option
        const targetOption = options.find((o: any) => o.id === optionId);
        if (targetOption) {
            const currentVoters = targetOption.voter_ids || [];
            await supabase.from('voting_options').update({ voter_ids: [...currentVoters, voterId] }).eq('id', optionId);
        }
        showToast('Voto computado!', 'success');
    };

    const handleCloseVoting = async (topicId: string) => {
        await supabase.from('voting_topics').update({ status: 'closed' }).eq('id', topicId);
        logAction('UPDATE', 'Votação', 'Encerrou uma votação');
        showToast('Votação encerrada!', 'info');
    };
    
    // --- Notebooks Handlers ---
    const handleSaveNotebook = async (name: string, editingId?: string) => {
        if (!loggedInUser || !currentCollective) return;
        if(editingId) {
             await supabase.from('notebooks').update({ name }).eq('id', editingId);
             showToast('Caderno renomeado!', 'success');
        } else {
             const payload = { name, owner_id: loggedInUser.id, collective_id: currentCollective.id };
             const { error } = await supabase.from('notebooks').insert([payload]);
             if (error && error.code === '42703') {
                  const { collective_id, ...rest } = payload;
                  await supabase.from('notebooks').insert([rest]);
             }
             showToast('Caderno criado!', 'success');
        }
    };
    
    const handleDeleteNotebook = async (notebookId: string) => {
        await supabase.from('notebooks').delete().eq('id', notebookId);
        showToast('Caderno excluído', 'info');
    }

    const handleSaveNote = async (notebookId: string, noteData: Pick<Note, 'title' | 'content'>, editingId?: string) => {
        const payload = { 
            notebook_id: notebookId, 
            title: noteData.title, 
            content: noteData.content,
            updated_at: new Date().toISOString()
        };
        if(editingId) {
             await supabase.from('notes').update(payload).eq('id', editingId);
             // Note: We don't toast on every auto-save to avoid spam
        } else {
             await supabase.from('notes').insert([payload]);
             showToast('Nota criada!', 'success');
        }
    };

    const handleDeleteNote = async (notebookId: string, noteId: string) => {
        await supabase.from('notes').delete().eq('id', noteId);
        showToast('Nota excluída', 'info');
    };
    
    // --- Media Handlers ---
    const handleSaveMediaItem = async (mediaData: Omit<MediaItem, 'id'>) => {
        if (!currentCollective) return;
        const payload = {
            title: mediaData.title,
            category: mediaData.category,
            file_data_url: mediaData.fileDataUrl,
            file_name: mediaData.fileName,
            artist_id: mediaData.artistId,
            collective_id: currentCollective.id
        };
        const { error } = await supabase.from('media_items').insert([payload]);
        if (error && error.code === '42703') {
             const { collective_id, ...rest } = payload;
             await supabase.from('media_items').insert([rest]);
        }
        logAction('CREATE', 'Mídia', `Upload de arquivo: ${mediaData.title}`);
        showToast('Mídia salva!', 'success');
    };
    
    const handleDeleteMediaItem = async (mediaId: string) => {
        const media = mediaItems.find(m => m.id === mediaId);
        await supabase.from('media_items').delete().eq('id', mediaId);
        logAction('DELETE', 'Mídia', `Excluiu arquivo: ${media?.title || mediaId}`);
        showToast('Mídia excluída', 'info');
    }
    
    // --- Gallery Handlers ---
    const handleSavePhotoAlbum = async (albumData: Omit<PhotoAlbum, 'id' | 'photos'>, editingId?: string) => {
        if (!currentCollective) return;
        if(editingId) {
            await supabase.from('photo_albums').update(albumData).eq('id', editingId);
            showToast('Álbum atualizado!', 'success');
        } else {
            const payload = { ...albumData, collective_id: currentCollective.id };
            const { error } = await supabase.from('photo_albums').insert([payload]);
            if (error && error.code === '42703') {
                 const { collective_id, ...rest } = payload;
                 await supabase.from('photo_albums').insert([rest]);
            }
            showToast('Álbum criado!', 'success');
        }
    };
    
    const handleDeletePhotoAlbum = async (albumId: string) => {
        await supabase.from('photo_albums').delete().eq('id', albumId);
        showToast('Álbum excluído', 'info');
    }
    
    const handleAddPhotosToAlbum = async (albumId: string, photos: Omit<Photo, 'id'>[]) => {
        const payload = photos.map(p => ({
            album_id: albumId,
            data_url: p.dataUrl,
            caption: p.caption,
            file_name: p.fileName // Fix: Access 'fileName' from input object 'p'
        }));
        await supabase.from('photos').insert(payload);
        showToast(`${photos.length} fotos adicionadas!`, 'success');
    };
    
    const handleDeletePhoto = async (albumId: string, photoId: string) => {
        await supabase.from('photos').delete().eq('id', photoId);
        showToast('Foto excluída', 'info');
    };

    // --- COLLECTIVE SELECTION HANDLERS ---

    const handleCreateCollective = async (name: string) => {
        if (!loggedInUser) return;
        try {
            // Generate a simple 6-char unique code
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            
            const payload = { 
                name: name, 
                code: code,
                owner_id: loggedInUser.id
            };

            const { data: collective, error } = await supabase.from('collectives').insert([payload]).select().single();
            
            if (error) throw error;

            // Add creator as member
            if (collective) {
                await supabase.from('collective_members').insert([{
                    collective_id: collective.id,
                    member_id: loggedInUser.id,
                    role: 'Admin'
                }]);
                
                setCurrentCollective({
                    id: collective.id,
                    name: collective.name,
                    code: collective.code,
                    description: collective.description
                });
                showToast(`Coletivo "${name}" criado com sucesso!`, 'success');
                updateUserState('eventInfo', { ...MOCK_EVENT_INFO, collectiveName: name, eventName: `Evento de ${name}` });
            }
        } catch (err) {
            console.error(err);
            showToast('Erro ao criar coletivo.', 'error');
        }
    };

    const handleJoinCollective = async (code: string) => {
        if (!loggedInUser) return;
        try {
            // 1. Find collective by code
            const { data: collective, error } = await supabase.from('collectives').select('*').eq('code', code).single();
            
            if (error || !collective) {
                showToast('Coletivo não encontrado com este código.', 'error');
                return;
            }

            // 2. Add user to collective_members
            const { error: joinError } = await supabase.from('collective_members').insert([{
                collective_id: collective.id,
                member_id: loggedInUser.id,
                role: 'Membro'
            }]);

            if (joinError) {
                if (joinError.code === '23505') { // Unique violation
                     showToast('Você já faz parte deste coletivo!', 'info');
                } else {
                     throw joinError;
                }
            } else {
                showToast(`Bem-vindo ao ${collective.name}!`, 'success');
            }

            setCurrentCollective({
                id: collective.id,
                name: collective.name,
                code: collective.code,
                description: collective.description
            });
            updateUserState('eventInfo', { ...MOCK_EVENT_INFO, collectiveName: collective.name, eventName: `Evento de ${collective.name}` });

        } catch (err) {
            console.error(err);
            showToast('Erro ao entrar no coletivo.', 'error');
        }
    };


    
    // Handle Global Search Keyboard Shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);


    const loadUserData = (email: string) => {
        const userDataString = localStorage.getItem(`collab-clio-data-${email}`);
        let loadedData = { ...MOCK_INITIAL_DATA }; // Start with fresh defaults
        
        if(userDataString) {
            const parsedData = JSON.parse(userDataString);
             // Merge saved data with defaults to ensure all fields exist
            loadedData = { ...loadedData, ...parsedData };
        }

        // Ensure default gadgets exist if array is empty (for existing users)
        if (!loadedData.gadgets || loadedData.gadgets.length === 0) {
            loadedData.gadgets = DEFAULT_GADGETS;
        }
        
        // MOST DATA IS NOW HANDLED BY SUPABASE
        // Local state is only used for Gadgets, Wallpaper
        setUserState(loadedData);
        
        const userWallpaper = localStorage.getItem(`clio-os-wallpaper-${email}`);
        setWallpaperImage(userWallpaper);
    };

    const saveUserData = useCallback(() => {
        if (loggedInUser && userState) {
            // We still save everything to local storage for the non-migrated features
            localStorage.setItem(`collab-clio-data-${loggedInUser.email}`, JSON.stringify(userState));
        }
    }, [loggedInUser, userState]);

    useEffect(() => {
        saveUserData();
    }, [userState, saveUserData]);

    const handleLogin = async (email: string, password: string): Promise<boolean> => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error(error);
            return false;
        }
        return true;
    };

    const handleSignUp = async (name: string, email: string, password: string): Promise<{ success: boolean, message: string }> => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name, // Metadata for trigger if needed, or we insert manually
                },
                emailRedirectTo: window.location.origin,
            }
        });

        if (error) return { success: false, message: error.message };
        
        if (data.user) {
             // Insert into profiles table
             const { error: profileError } = await supabase
                .from('profiles')
                .insert([{ id: data.user.id, name: name, email: email, role: 'Membro', avatar: DEFAULT_AVATAR }]);
             
             if (profileError) console.error('Error creating profile:', profileError);
        }

        return { success: true, message: 'Conta criada! Verifique seu e-mail para confirmar.' };
    };
    
    const handleSignUpWrapper = (name: string, email: string, pass: string) => {
         return handleSignUp(name, email, pass) as any; 
    }

    const handleGuestLogin = () => {
        // Guest login sets the user to "User Teste" AND automatically sets the collective to "Test Collective"
        const guestDataString = localStorage.getItem(`collab-clio-data-${TEST_USER_EMAIL}`);
        if (guestDataString) {
            const guestData = JSON.parse(guestDataString);
            guestData.members = guestData.members.map((m: Member) => m.id === TEST_USER.id ? TEST_USER : m);
            if(!guestData.members.find((m:Member) => m.id === TEST_USER.id)) {
                 guestData.members.push(TEST_USER);
            }
            if (!guestData.gadgets || guestData.gadgets.length === 0) {
                guestData.gadgets = DEFAULT_GADGETS;
            }
            setUserState(guestData);
        } else {
            const guestData = { ...MOCK_INITIAL_DATA, members: [TEST_USER] };
            localStorage.setItem(`collab-clio-data-${TEST_USER_EMAIL}`, JSON.stringify(guestData));
            setUserState(guestData);
        }
        setLoggedInUser(TEST_USER);
        setCurrentCollective(TEST_COLLECTIVE); // Auto-enter test collective
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setLoggedInUser(null);
        setCurrentCollective(null);
        setUserState(MOCK_INITIAL_DATA);
        setAppStates(initialAppStates);
        setActiveMobileApp(null);
    };

    const randomLoginWallpaper = useMemo(() => {
        if (loggedInUser) return null; // Don't calculate if logged in
        const randomIndex = Math.floor(Math.random() * wallpapers.length);
        return wallpapers[randomIndex].url;
    }, [loggedInUser]);
    
    // Generate a random wallpaper for the session if the user hasn't selected one
    const sessionRandomWallpaper = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * wallpapers.length);
        return wallpapers[randomIndex].url;
    }, []);

    // --- GENERIC STATE UPDATE HANDLER (Local) ---
    const updateUserState = (key: keyof typeof MOCK_INITIAL_DATA, value: any) => {
        setUserState((current: any) => ({ ...current, [key]: value }));
    };
    
    // --- LOCAL HANDLERS (Legacy / Not Migrated Yet) ---
    const handleSaveMember = (memberData: Member) => updateUserState('members', userState.members.map((m: Member) => m.id === memberData.id ? { ...m, ...memberData } : m));
    const handleSaveProfile = (updatedData: Partial<Member>) => {
        if(!loggedInUser) return;
        const updatedUser = { ...loggedInUser, ...updatedData };
        setLoggedInUser(updatedUser);
        handleSaveMember(updatedUser);
        // Ideally update 'profiles' table here too
    }
    const handleChangePassword = (currentPassword: string, newPassword: string) => {
        alert('Alteração de senha via Supabase ainda será implementada.');
        return { success: true, message: 'Simulação: Senha alterada!' };
    };

    const handleSaveEventInfo = (infoData: EventInfoData) => updateUserState('eventInfo', infoData);
    
    
     const handleAddGadget = (type: GadgetType) => {
        const newGadget: Gadget = {
            id: crypto.randomUUID(), type,
            position: { x: Math.floor(Math.random() * 200) + 50, y: Math.floor(Math.random() * 200) + 50 },
            ...(type === 'quick_note' && { data: { content: '' } })
        };
        updateUserState('gadgets', [...userState.gadgets, newGadget]);
    };
    const handleRemoveGadget = (gadgetId: string) => updateUserState('gadgets', userState.gadgets.filter((g: Gadget) => g.id !== gadgetId));
    const handleUpdateGadgetPosition = (gadgetId: string, position: { x: number; y: number }) => {
        updateUserState('gadgets', userState.gadgets.map((g: Gadget) => g.id === gadgetId ? { ...g, position } : g));
    };
    const handleUpdateGadgetData = (gadgetId: string, data: GadgetData) => {
        updateUserState('gadgets', userState.gadgets.map((g: Gadget) => g.id === gadgetId ? { ...g, data: { ...g.data, ...data } } : g));
    };
    const handleReplaceGadget = (gadgetId: string, newType: GadgetType) => {
        updateUserState('gadgets', userState.gadgets.map((g: Gadget) => 
            g.id === gadgetId ? { ...g, type: newType, data: newType === 'quick_note' ? { content: '' } : undefined } : g
        ));
    }

    // --- Wallpaper Handlers ---
    const handleSetWallpaper = (imageUrl: string) => {
        if(loggedInUser) {
            localStorage.setItem(`clio-os-wallpaper-${loggedInUser.email}`, imageUrl);
            setWallpaperImage(imageUrl);
        }
    };
    const handleResetWallpaper = () => {
        if(loggedInUser) {
            localStorage.removeItem(`clio-os-wallpaper-${loggedInUser.email}`);
            setWallpaperImage(null);
        }
    };


    // --- App Window Handlers ---
    const handleAppClick = (appName: AppName) => {
        setAppStates(prev => ({ ...prev, [appName]: 'open' }));
        if (isMobile) {
            setActiveMobileApp(appName);
        }
    }
    const handleAppClose = (appName: AppName) => setAppStates(prev => ({ ...prev, [appName]: 'closed' }));
    const handleAppMinimize = (appName: AppName) => setAppStates(prev => ({ ...prev, [appName]: 'minimized' }));

    // --- Modal Control ---
    const openModal = (view: ModalView, data: any = null) => {
        setModalView(view);
        setEditingItem(data);
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
        setModalView(null);
        setEditingItem(null);
    };


    const handleOpenGadgetMenu = (gadgetId: string) => {
        setSelectedGadgetId(gadgetId);
        setIsGadgetMenuOpen(true);
    };

    const handleMobileRemoveGadget = () => {
        if (selectedGadgetId) {
            handleRemoveGadget(selectedGadgetId);
            setIsGadgetMenuOpen(false);
        }
    };

    const handleMobileSwapGadget = (newType: GadgetType) => {
        if (selectedGadgetId) {
            handleReplaceGadget(selectedGadgetId, newType);
            setIsGadgetSelectorOpen(false);
        }
    };
    

    // --- RENDER LOGIC ---
    if (loadingAuth) {
         return <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-white">
            <p className="animate-pulse">Carregando Clio OS...</p>
         </div>
    }

    if (!loggedInUser || !userState) {
        return <LoginScreen onLogin={handleLogin} onSignUp={handleSignUpWrapper} onGuestLogin={handleGuestLogin} loginWallpaper={randomLoginWallpaper} />;
    }

    const { members, artists, tasks, schedule, financialProjects, totalBudget, feedPosts, eventInfo, mediaItems, inventoryItems, gadgets, notebooks, photoAlbums, collectiveDocuments, meetingMinutes, votingTopics, teamStatuses, auditLogs } = userState;
    const recentlyUpdatedTaskId = null; 

    const renderModalContent = () => {
        const handleAndClose = (saveFn: (...args: any[]) => void) => (...args: any[]) => { saveFn(...args); closeModal(); };
        const handleSaveDocWithUploader = (docData: { name: string, file: File, fileDataUrl: string }) => handleSaveCollectiveDocument(docData, loggedInUser.id);
        const handleSaveVoteWithCreator = (topicData: any) => handleSaveVotingTopic(topicData, loggedInUser.id);

        switch(modalView) {
            case 'task': return <TaskForm onSubmit={handleAndClose(handleSaveTask)} task={editingItem} members={members} />;
            case 'schedule': return <ScheduleForm onSubmit={handleAndClose(handleSaveScheduleItem)} item={editingItem} />;
            case 'artist': return <ArtistForm onSubmit={handleAndClose(handleSaveArtist)} artist={editingItem} eventInfo={eventInfo} />;
            case 'info': return <EventInfoForm onSubmit={handleAndClose(handleSaveEventInfo)} info={editingItem} />;
            case 'media': return <MediaForm onSubmit={handleAndClose(handleSaveMediaItem)} artists={artists} />;
            case 'inventory': return <InventoryForm onSubmit={handleAndClose(handleSaveInventoryItem)} item={editingItem} members={members} />;
            case 'member': return <MemberForm onSubmit={handleAndClose(handleSaveMember)} member={editingItem} />;
            case 'profile': return <ProfileApp currentUser={loggedInUser} onSaveProfile={handleSaveProfile} onChangePassword={handleChangePassword} />;
            case 'avatar_viewer': return <AvatarViewer member={editingItem} />;
            case 'photo_album': return <AlbumForm onSubmit={handleAndClose(handleSavePhotoAlbum)} album={editingItem} />;
            case 'photo': return <PhotoUploadForm onSubmit={handleAndClose(handleAddPhotosToAlbum)} albumId={editingItem?.albumId} />;
            case 'collective_document': return <CollectiveDocumentForm onSubmit={handleAndClose(handleSaveDocWithUploader)} />;
            case 'meeting_minute': return <MeetingMinuteForm onSubmit={handleAndClose(handleSaveMeetingMinute)} minute={editingItem} />;
            case 'voting_topic': return <VotingTopicForm onSubmit={handleAndClose(handleSaveVoteWithCreator)} />;
            case 'financial_project': return <FinancialProjectForm onSubmit={handleAndClose((data, id) => handleSaveFinancialProject(data, id || editingItem?.id))} project={editingItem} />;
            case 'transaction': 
                const { projectId, ...transactionData } = editingItem || {};
                const isEditingTransaction = !!transactionData.id;
                return <TransactionForm 
                    onSubmit={handleAndClose((data, id) => handleSaveTransaction(projectId, { ...data, type: editingItem.type }, id))}
                    transaction={isEditingTransaction ? transactionData : null} 
                    type={editingItem.type || 'expense'} 
                />; 
            default: return null;
        }
    };
  
    const getModalTitle = () => {
        if (!modalView) return '';
        const isEditing = !!editingItem?.id;
        switch(modalView) {
            case 'task': return isEditing ? 'Editar Tarefa' : 'Nova Tarefa';
            case 'schedule': return isEditing ? 'Editar Item' : 'Novo Item';
            case 'artist': return isEditing ? 'Editar Artista' : 'Novo Artista';
            case 'info': return 'Editar Informações do Evento';
            case 'media': return 'Adicionar Mídia';
            case 'inventory': return isEditing ? 'Editar Item' : 'Novo Item';
            case 'member': return `Editar Perfil de ${editingItem?.name}`;
            case 'profile': return 'Meu Perfil';
            case 'avatar_viewer': return editingItem?.name;
            case 'photo_album': return isEditing ? 'Editar Álbum' : 'Novo Álbum';
            case 'photo': return 'Adicionar Fotos';
            case 'collective_document': return 'Novo Documento';
            case 'meeting_minute': return isEditing ? 'Editar Ata' : 'Nova Ata';
            case 'voting_topic': return 'Criar Votação';
            case 'financial_project': return isEditing ? 'Editar Projeto Financeiro' : 'Novo Projeto Financeiro';
            case 'transaction': return isEditing ? 'Editar Transação' : `Nova ${editingItem?.type === 'income' ? 'Receita' : 'Despesa'}`;
            default: return 'Clio OS';
        }
    }
    
    const appConfig: { name: AppName, title: string, icon: React.ReactNode, component: React.ReactNode }[] = [
        { name: 'dashboard', title: 'Dashboard', icon: <DockAppIcon bgColorClasses="bg-blue-600"><HomeIcon /></DockAppIcon>, component: <Dashboard onOpenModal={openModal} {...userState} /> },
        { name: 'tasks', title: 'Tarefas', icon: <DockAppIcon bgColorClasses="bg-green-600"><CheckSquareIcon /></DockAppIcon>, component: <KanbanBoard onOpenModal={openModal} tasks={tasks} members={members} recentlyUpdatedTaskId={recentlyUpdatedTaskId} handleDeleteTask={handleDeleteTask} handleUpdateTaskStatus={handleUpdateTaskStatus} /> },
        { name: 'schedule', title: 'Cronograma', icon: <DockAppIcon bgColorClasses="bg-orange-600"><ClockIcon /></DockAppIcon>, component: <Schedule onOpenModal={openModal} schedule={schedule} handleDeleteScheduleItem={handleDeleteScheduleItem} /> },
        { name: 'artists', title: 'Artistas', icon: <DockAppIcon bgColorClasses="bg-purple-600"><BrushIcon /></DockAppIcon>, component: <Artists onOpenModal={openModal} artists={artists} handleDeleteArtist={handleDeleteArtist} /> },
        { name: 'team_hub', title: 'Hub da Equipe', icon: <DockAppIcon bgColorClasses="bg-teal-500"><UsersIcon /></DockAppIcon>, component: <TeamHub onOpenModal={openModal} currentUser={loggedInUser} members={members} feedPosts={feedPosts} handleAddPost={handleAddPost} teamStatuses={teamStatuses} handleUpdateTeamStatus={handleUpdateTeamStatus} /> },
        { name: 'inventory', title: 'Inventário', icon: <DockAppIcon bgColorClasses="bg-slate-600"><BoxIcon /></DockAppIcon>, component: <Inventory onOpenModal={openModal} inventoryItems={inventoryItems} members={members} handleDeleteInventoryItem={handleDeleteInventoryItem} /> },
        { name: 'info', title: 'Informações', icon: <DockAppIcon bgColorClasses="bg-indigo-600"><InfoIcon /></DockAppIcon>, component: <EventInfo onOpenModal={openModal} {...userState} /> },
        { name: 'media', title: 'Mídia', icon: <DockAppIcon bgColorClasses="bg-red-600"><ImageIcon /></DockAppIcon>, component: <MediaHub onOpenModal={() => openModal('media')} mediaItems={mediaItems} artists={artists} handleDeleteMediaItem={handleDeleteMediaItem} /> },
        { name: 'gallery', title: 'Galeria', icon: <DockAppIcon bgColorClasses="bg-pink-500"><ImageIcon /></DockAppIcon>, component: <PhotoGalleryApp onOpenModal={openModal} /> },
        { name: 'reports', title: 'Relatórios', icon: <DockAppIcon bgColorClasses="bg-gray-700"><FileTextIcon /></DockAppIcon>, component: <Reports {...userState} /> },
        { name: 'documentation', title: 'Documentação', icon: <DockAppIcon bgColorClasses="bg-indigo-700"><BookOpenIcon /></DockAppIcon>, component: <Documentation /> },
        { name: 'finances', title: 'Finanças', icon: <DockAppIcon bgColorClasses="bg-emerald-600"><WalletIcon /></DockAppIcon>, component: <FinanceApp onOpenModal={openModal} financialProjects={financialProjects} members={members} handleSaveFinancialProject={handleSaveFinancialProject} handleDeleteFinancialProject={handleDeleteFinancialProject} handleSaveTransaction={handleSaveTransaction} handleDeleteTransaction={handleDeleteTransaction} /> },
        { name: 'notebooks', title: 'Cadernos', icon: <DockAppIcon bgColorClasses="bg-amber-600"><BookMarkedIcon /></DockAppIcon>, component: <NotebooksApp notebooks={notebooks} handleSaveNotebook={handleSaveNotebook} handleDeleteNotebook={handleDeleteNotebook} handleSaveNote={handleSaveNote} handleDeleteNote={handleDeleteNote} /> },
        { name: 'collab_clio', title: 'Collab Clio', icon: <DockAppIcon bgColorClasses="bg-cyan-700"><BriefcaseIcon /></DockAppIcon>, component: <CollabClioApp onOpenModal={openModal} currentUser={loggedInUser} {...userState} handleDeleteCollectiveDocument={handleDeleteCollectiveDocument} handleDeleteMeetingMinute={handleDeleteMeetingMinute} handleCastVote={handleCastVote} handleCloseVoting={handleCloseVoting} /> },
        { name: 'browser', title: 'Navegador', icon: <DockAppIcon bgColorClasses="bg-cyan-600"><GlobeIcon /></DockAppIcon>, component: <BrowserApp /> },
        { name: 'profile', title: 'Meu Perfil', icon: <DockAppIcon bgColorClasses="bg-gray-500"><UserIcon /></DockAppIcon>, component: <ProfileApp currentUser={loggedInUser} onSaveProfile={handleSaveProfile} onChangePassword={handleChangePassword} /> },
        { name: 'personalize', title: 'Personalizar', icon: <DockAppIcon bgColorClasses="bg-gradient-to-br from-rose-500 to-violet-600"><BrushIcon /></DockAppIcon>, component: <PersonalizeApp currentWallpaper={wallpaperImage || sessionRandomWallpaper} onSetWallpaper={handleSetWallpaper} onResetWallpaper={handleResetWallpaper} handleAddGadget={handleAddGadget} wallpapers={wallpapers} mediaItems={mediaItems} photoAlbums={photoAlbums} collectiveDocuments={collectiveDocuments} /> },
    ];
    
    const appComponents = appConfig.reduce((acc, app) => ({ ...acc, [app.name]: app.component }), {} as Record<AppName, React.ReactNode>);

    // FIX: Create context value to be passed to the provider.
    const contextValue = {
        notebooks,
        handleSaveNotebook,
        handleDeleteNotebook,
        handleSaveNote,
        handleDeleteNote,
        eventInfo,
        artists,
        handleSaveMediaItem,
        financialProjects,
        photoAlbums,
        handleDeletePhoto,
        members,
        currentUser: loggedInUser,
        teamStatuses,
        handleUpdateTeamStatus,
        tasks,
        schedule,
        inventoryItems,
        collectiveDocuments,
        auditLogs // Added this
    };

    // Mobile Gadget Rendering Logic
    const gadgetsPerPage = 2;
    const totalMobilePages = Math.ceil(Math.max(gadgets.length, 1) / gadgetsPerPage);
    
    const renderMobileGadget = (gadget: Gadget) => {
        return (
             <MobileGadgetWrapper key={gadget.id} onLongPress={() => handleOpenGadgetMenu(gadget.id)}>
                 <div className="bg-black/20 backdrop-blur-lg p-4 rounded-xl border border-white/10">
                    {gadget.type === 'analog_clock' && <div className="flex justify-center"><AnalogClock /></div>}
                    {gadget.type === 'countdown' && <CountdownGadget />}
                    {gadget.type === 'quick_note' && <QuickNoteGadget content={gadget.data?.content || ''} onContentChange={(content) => handleUpdateGadgetData(gadget.id, { content })} />}
                    {gadget.type === 'financial_summary' && <FinancialSummaryGadget />}
                    {gadget.type === 'team_status' && <TeamStatusGadget />}
                    {gadget.type === 'weather' && <WeatherGadget />}
                 </div>
             </MobileGadgetWrapper>
        )
    }

    // Handler for QuickDock Speed Dial Actions
    const handleQuickAction = (action: 'task' | 'artist' | 'transaction' | 'document') => {
        switch(action) {
            case 'task': openModal('task'); break;
            case 'artist': openModal('artist'); break;
            case 'transaction': 
                // Try to find a default project or open project creation if none
                if (financialProjects.length > 0) {
                     openModal('transaction', { projectId: financialProjects[0].id, type: 'expense' });
                } else {
                     showToast("Crie um projeto financeiro primeiro.", "info");
                     openModal('financial_project');
                }
                break;
            case 'document': openModal('collective_document'); break;
        }
    };

    return (
        <AppContext.Provider value={contextValue}>
            <div 
                className="h-[100dvh] w-screen font-sans bg-cover bg-center overflow-hidden relative"
                style={{ backgroundImage: `url(${wallpaperImage || sessionRandomWallpaper})` }}
            >
                 <div className="absolute inset-0 bg-slate-900/30"></div>
                 
                 {/* Global Search Overlay */}
                 <GlobalSearch 
                    isOpen={isSearchOpen} 
                    onClose={() => setIsSearchOpen(false)} 
                    onOpenModal={openModal} 
                 />
                 
                {/* Global Toast Container */}
                <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2">
                    {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                </div>

                {/* COLLECTIVE SELECTION SCREEN - Shown when logged in but no collective selected */}
                {loggedInUser && !currentCollective && (
                     <div className="absolute inset-0 z-50 flex items-center justify-center">
                         <CollectiveSelection 
                            userName={loggedInUser.name}
                            onCreate={handleCreateCollective}
                            onJoin={handleJoinCollective}
                         />
                     </div>
                )}
                 
                {/* MAIN APP - Only rendered if user has a collective selected */}
                {loggedInUser && currentCollective && (
                    isMobile ? (
                        <div className="h-full w-full overflow-hidden flex flex-col relative z-10">
                            <div className="relative z-10 flex flex-col h-full">
                               {activeMobileApp ? (
                                 <>
                                    <header className="flex-shrink-0 bg-black/30 backdrop-blur-lg h-14 flex items-center justify-between px-4 z-10 border-b border-white/10">
                                        <button onClick={() => setActiveMobileApp(null)} className="flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300">
                                            <ChevronLeftIcon className="w-5 h-5" />
                                            <span>Início</span>
                                        </button>
                                        <h1 className="font-bold text-md text-white truncate max-w-[50%]">{appConfig.find(a => a.name === activeMobileApp)?.title}</h1>
                                        <div className="w-16"></div> {/* Spacer */}
                                    </header>
                                    <main className="flex-1 overflow-y-auto bg-slate-800/90 backdrop-blur-lg relative z-0 pb-24">
                                        {appComponents[activeMobileApp]}
                                    </main>
                                </>
                            ) : (
                                 <>
                                    <MobileTopBar 
                                        user={loggedInUser} 
                                        onToggleControlCenter={() => setIsMobileControlCenterOpen(true)} 
                                        onOpenProfile={() => setActiveMobileApp('profile')} 
                                        onOpenSearch={() => setIsSearchOpen(true)}
                                    />
                                    <main 
                                        className="flex-1 flex flex-col relative overflow-hidden pb-24" 
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleTouchEnd}
                                    >
                                        {/* Mobile Horizontal Pages */}
                                        <div 
                                            className="flex flex-1 transition-transform duration-300 ease-out"
                                            style={{ transform: `translateX(-${mobilePage * 100}%)` }}
                                        >
                                            {Array.from({ length: totalMobilePages }).map((_, pageIndex) => (
                                                <div key={pageIndex} className="w-full h-full flex-shrink-0 p-4 space-y-4 overflow-y-auto">
                                                    {gadgets
                                                        .slice(pageIndex * gadgetsPerPage, (pageIndex + 1) * gadgetsPerPage)
                                                        .map(gadget => renderMobileGadget(gadget))
                                                    }
                                                    {gadgets.length === 0 && pageIndex === 0 && (
                                                        <div className="text-center text-slate-400 mt-10">
                                                            <p>Nenhum gadget adicionado.</p>
                                                            <p className="text-xs">Use o app "Personalizar" para adicionar.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Page Indicator */}
                                        <div className="absolute bottom-28 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-none">
                                            {Array.from({ length: totalMobilePages }).map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`w-2 h-2 rounded-full transition-colors ${i === mobilePage ? 'bg-white' : 'bg-white/30'}`}
                                                />
                                            ))}
                                        </div>
                                    </main>
                                </>
                            )}
                            
                            {/* NEW PERSISTENT DOCK REPLACES FOOTER */}
                            <ClioQuickDock 
                                activeApp={activeMobileApp} 
                                onNavigate={setActiveMobileApp} 
                                onAction={handleQuickAction}
                                onOpenMenu={() => setIsAppDrawerOpen(true)}
                            />

                            </div>
                            <MobileAppDrawer 
                               isOpen={isAppDrawerOpen} 
                               onClose={() => setIsAppDrawerOpen(false)}
                               apps={appConfig}
                               onAppClick={(appName) => {
                                   setIsAppDrawerOpen(false);
                                   setActiveMobileApp(appName);
                               }}
                            />
                            <ControlCenter 
                                isOpen={isMobileControlCenterOpen} 
                                onClose={() => setIsMobileControlCenterOpen(false)}
                                eventInfo={eventInfo}
                                schedule={schedule}
                            />
                            
                            <MobileGadgetMenu 
                                isOpen={isGadgetMenuOpen} 
                                onClose={() => setIsGadgetMenuOpen(false)} 
                                onRemove={handleMobileRemoveGadget}
                                onChange={() => { setIsGadgetMenuOpen(false); setIsGadgetSelectorOpen(true); }}
                            />

                            <GadgetSelectorModal 
                                isOpen={isGadgetSelectorOpen}
                                onClose={() => setIsGadgetSelectorOpen(false)}
                                onSelect={handleMobileSwapGadget}
                            />
                        </div>
                    ) : (
                        <>
                            <ClioOSDesktop 
                                onAppClick={handleAppClick} 
                                user={loggedInUser} 
                                onLogout={handleLogout}
                                appStates={appStates}
                                eventInfo={eventInfo}
                                schedule={schedule}
                                onOpenSearch={() => setIsSearchOpen(true)}
                            />
                            
                            {gadgets.map((gadget: Gadget) => (
                                <GadgetWrapper key={gadget.id} gadget={gadget} onClose={handleRemoveGadget} onPositionChange={handleUpdateGadgetPosition} >
                                    {gadget.type === 'analog_clock' && <AnalogClock />}
                                    {gadget.type === 'countdown' && <CountdownGadget />}
                                    {gadget.type === 'quick_note' && <QuickNoteGadget content={gadget.data?.content || ''} onContentChange={(content) => handleUpdateGadgetData(gadget.id, { content })} />}
                                    {gadget.type === 'financial_summary' && <FinancialSummaryGadget />}
                                    {gadget.type === 'team_status' && <TeamStatusGadget />}
                                    {gadget.type === 'weather' && <WeatherGadget />}
                                </GadgetWrapper>
                            ))}

                            
                            {appConfig.map(({ name, title, component }) => (
                                appStates[name] === 'open' && (
                                    <AppWindow key={name} title={title} isOpen={appStates[name] === 'open'} onClose={() => handleAppClose(name)} onMinimize={() => handleAppMinimize(name)} >
                                        {component}
                                    </AppWindow>
                                )
                            ))}

                            {appStates.clio_company === 'open' && (
                                <AppWindow title="Clio Company" isOpen={appStates.clio_company === 'open'} onClose={() => handleAppClose('clio_company')} onMinimize={() => handleAppMinimize('clio_company')} >
                                    <iframe src="https://edu-cliocompany.odoo.com" title="Clio Company" className="w-full h-full border-none" />
                                </AppWindow>
                            )}
                        </>
                    )
                )}
                
                <Modal isOpen={modalOpen} onClose={closeModal} title={getModalTitle()}>{renderModalContent()}</Modal>
            </div>
        </AppContext.Provider>
    );
};

export default App;
