
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { Member, Task, ScheduleItem, Artist, ModalView, EventInfoData, MediaItem, InventoryItem, Gadget, PhotoAlbum, Photo, CollectiveDocument, MeetingMinute, VotingTopic, TaskStatus, FinancialProject, Transaction, Notebook, Note, GadgetType, GadgetData, FeedPost, TeamStatus, VoteOption } from './types';
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
import { ChevronLeftIcon, HomeIcon, CheckSquareIcon, ClockIcon, UsersIcon, BoxIcon, InfoIcon, ImageIcon, BookOpenIcon, FileTextIcon, WalletIcon, BookMarkedIcon, BriefcaseIcon, GlobeIcon, UserIcon, BrushIcon, DockAppIcon, MenuIcon, BarChartIcon, StickyNoteIcon, XIcon, SearchIcon } from './components/icons';
import { AppContext } from './contexts/AppContext';
import { supabase } from './supabaseClient';

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
    gadgets: DEFAULT_GADGETS, // Initialize with defaults
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

const GUEST_USER_EMAIL = 'guest@dev.clio';
const GUEST_USER: Member = {
    id: 'guest-dev-id',
    name: 'Deusa Clio',
    email: GUEST_USER_EMAIL,
    avatar: DEFAULT_AVATAR,
    role: 'Musa Inspiradora'
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
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        />
        <div
            className={`fixed bottom-0 left-0 right-0 z-50 bg-slate-800/90 backdrop-blur-xl rounded-t-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
            style={{ maxHeight: '85dvh' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="w-12 h-1.5 bg-slate-500/50 rounded-full mx-auto my-3" onClick={onClose}></div>
            <div className="overflow-y-auto p-4 pb-12" style={{ maxHeight: 'calc(85dvh - 40px)' }}>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-2 gap-y-6">
                    {apps.map(({ name, title, icon }) => (
                        <button key={name} onClick={() => onAppClick(name)} className="flex flex-col items-center justify-start p-1 space-y-2 rounded-lg active:bg-white/10 transition-colors">
                            <div className="w-14 h-14">{icon}</div>
                            <span className="text-xs text-center text-slate-200 leading-tight">{title}</span>
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
        if (isAppDrawerOpen || isMobileControlCenterOpen || isSearchOpen) {
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
             if (yDiff > minSwipeDistance) {
                 setIsAppDrawerOpen(true);
             } else if (yDiff < -minSwipeDistance) {
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
            } else {
                setLoadingAuth(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchUserProfile(session.user.id, session.user.email!);
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
            } else {
                setLoggedInUser(null);
                setUserState(MOCK_INITIAL_DATA); // Reset to defaults
                setLoadingAuth(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (userId: string, email: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
            }

            if (data) {
                const user: Member = {
                    id: data.id,
                    email: email,
                    name: data.name || 'Usuário',
                    role: data.role || 'Membro',
                    avatar: data.avatar || DEFAULT_AVATAR
                };
                setLoggedInUser(user);
                // Load generic local data for other components (legacy support)
                loadUserData(email);
                // Fetch all profiles to populate members list
                fetchAllProfiles();
            } else {
                 // Profile doesn't exist, create one based on Auth user
                 const newUser: Member = {
                    id: userId,
                    email: email,
                    name: email.split('@')[0], // Default name
                    role: 'Membro',
                    avatar: DEFAULT_AVATAR
                };
                 setLoggedInUser(newUser);
                 loadUserData(email);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingAuth(false);
        }
    };
    
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

    // --- SUPABASE DATA FETCHING (CORE) ---
    const fetchTasks = async () => {
        try {
            const { data, error } = await supabase.from('tasks').select('*');
            if (error) throw error;
            
            if (data) {
                const mappedTasks: Task[] = data.map((t: any) => ({
                    id: t.id,
                    title: t.title,
                    description: t.description,
                    status: t.status as TaskStatusEnum,
                    dueDate: t.due_date,
                    assigneeId: t.assignee_id
                }));
                updateUserState('tasks', mappedTasks);
            }
        } catch (err) {
            console.error('Error fetching tasks:', err);
        }
    };

    const fetchArtists = async () => {
        try {
            const { data, error } = await supabase.from('artists').select('*');
            if (error) throw error;
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
                    documentImage: a.document_image
                }));
                updateUserState('artists', mappedArtists);
            }
        } catch (err) {
            console.error('Error fetching artists:', err);
        }
    };

    const fetchSchedule = async () => {
        try {
            const { data, error } = await supabase.from('schedule_items').select('*');
            if (error) throw error;
            if (data) {
                updateUserState('schedule', data);
            }
        } catch (err) {
            console.error('Error fetching schedule:', err);
        }
    };

    const fetchInventory = async () => {
        try {
            const { data, error } = await supabase.from('inventory_items').select('*');
            if (error) throw error;
            if (data) {
                const mappedInventory = data.map((i: any) => ({
                    id: i.id,
                    name: i.name,
                    quantity: i.quantity,
                    status: i.status,
                    responsibleId: i.responsible_id
                }));
                updateUserState('inventoryItems', mappedInventory);
            }
        } catch (err) {
            console.error('Error fetching inventory:', err);
        }
    };

    const fetchFinancialData = async () => {
        try {
            const { data, error } = await supabase
                .from('financial_projects')
                .select(`*, transactions (*)`);
            
            if (error) throw error;

            if (data) {
                const mappedProjects: FinancialProject[] = data.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    description: p.description,
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
        } catch (err) {
            console.error('Error fetching financial data:', err);
        }
    };

    // --- SUPABASE FEED & COLLAB FETCHING ---
    const fetchFeedPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('team_feed_posts')
                .select(`
                    *,
                    author:profiles(*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const mappedPosts: FeedPost[] = data.map((p: any) => ({
                    id: p.id,
                    content: p.content,
                    timestamp: p.created_at,
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
        } catch (err) {
            console.error('Error fetching feed:', err);
        }
    };

    const fetchTeamStatuses = async () => {
        try {
            const { data } = await supabase.from('team_statuses').select('*');
            if (data) {
                const mappedStatuses = data.map((s: any) => ({
                    memberId: s.member_id,
                    status: s.status
                }));
                updateUserState('teamStatuses', mappedStatuses);
            }
        } catch (err) {
            console.error('Error fetching statuses:', err);
        }
    };

    const fetchCollabData = async () => {
        // Documents
        try {
            const { data: docs } = await supabase.from('collective_documents').select('*');
            if (docs) {
                const mappedDocs = docs.map((d: any) => ({
                    id: d.id,
                    name: d.name,
                    fileDataUrl: d.file_data_url,
                    fileName: d.file_name,
                    fileType: d.file_type,
                    uploadedAt: d.created_at,
                    uploaderId: d.uploader_id
                }));
                updateUserState('collectiveDocuments', mappedDocs);
            }
        } catch (e) { console.error(e); }

        // Meeting Minutes
        try {
             const { data: minutes } = await supabase.from('meeting_minutes').select('*');
             if (minutes) {
                 const mappedMinutes = minutes.map((m: any) => ({
                     id: m.id,
                     date: m.date,
                     attendeeIds: m.attendee_ids || [],
                     agenda: m.agenda,
                     decisions: m.decisions
                 }));
                 updateUserState('meetingMinutes', mappedMinutes);
             }
        } catch (e) { console.error(e); }

        // Voting Topics & Options
        try {
            const { data: topics } = await supabase
                .from('voting_topics')
                .select(`*, options:voting_options(*)`);
            
            if (topics) {
                const mappedTopics: VotingTopic[] = topics.map((t: any) => ({
                    id: t.id,
                    title: t.title,
                    description: t.description,
                    creatorId: t.creator_id,
                    createdAt: t.created_at,
                    status: t.status,
                    options: (t.options || []).map((o: any) => ({
                        id: o.id,
                        text: o.text,
                        voterIds: o.voter_ids || []
                    }))
                }));
                updateUserState('votingTopics', mappedTopics);
            }
        } catch (e) { console.error(e); }
    };
    
    // --- SUPABASE NOTEBOOKS, MEDIA, GALLERY ---
    const fetchNotebooks = async () => {
        try {
            const { data } = await supabase.from('notebooks').select('*, notes(*)');
            if(data) {
                const mapped = data.map((nb: any) => ({
                    id: nb.id,
                    name: nb.name,
                    notes: (nb.notes || []).map((n: any) => ({
                        id: n.id,
                        title: n.title,
                        content: n.content,
                        updatedAt: n.updated_at
                    }))
                }));
                updateUserState('notebooks', mapped);
            }
        } catch (err) { console.error(err); }
    };

    const fetchMedia = async () => {
         try {
            const { data } = await supabase.from('media_items').select('*');
            if(data) {
                const mapped = data.map((m: any) => ({
                    id: m.id,
                    title: m.title,
                    category: m.category,
                    fileDataUrl: m.file_data_url,
                    fileName: m.file_name,
                    artistId: m.artist_id
                }));
                updateUserState('mediaItems', mapped);
            }
        } catch (err) { console.error(err); }
    }

    const fetchAlbums = async () => {
         try {
            const { data } = await supabase.from('photo_albums').select('*, photos(*)');
            if(data) {
                const mapped = data.map((a: any) => ({
                    id: a.id,
                    name: a.name,
                    description: a.description,
                    photos: (a.photos || []).map((p: any) => ({
                        id: p.id,
                        dataUrl: p.data_url,
                        caption: p.caption,
                        fileName: p.file_name
                    }))
                }));
                updateUserState('photoAlbums', mapped);
            }
        } catch (err) { console.error(err); }
    }


    // --- SUPABASE HANDLERS (CRUD) ---

    // Tasks
    const handleSaveTask = async (taskData: Omit<Task, 'id' | 'status'>, editingId?: string) => {
        try {
            if (editingId) {
                await supabase.from('tasks').update({ title: taskData.title, description: taskData.description, due_date: taskData.dueDate, assignee_id: taskData.assigneeId || null }).eq('id', editingId);
            } else {
                await supabase.from('tasks').insert([{ title: taskData.title, description: taskData.description, due_date: taskData.dueDate, assignee_id: taskData.assigneeId || null, status: TaskStatusEnum.ToDo }]);
            }
            fetchTasks();
        } catch (err) { console.error(err); }
    };
    const handleDeleteTask = async (id: string) => { await supabase.from('tasks').delete().eq('id', id); fetchTasks(); };
    const handleUpdateTaskStatus = async (id: string, status: TaskStatus) => { await supabase.from('tasks').update({ status }).eq('id', id); fetchTasks(); };

    // Artists
    const handleSaveArtist = async (data: any, id?: string) => {
        const payload = { name: data.name, performance_type: data.performanceType, contact: data.contact, notes: data.notes, instagram: data.instagram, whatsapp: data.whatsapp, cpf: data.cpf, rg: data.rg, document_image: data.documentImage };
        if(id) await supabase.from('artists').update(payload).eq('id', id);
        else await supabase.from('artists').insert([payload]);
        fetchArtists();
    };
    const handleDeleteArtist = async (id: string) => { await supabase.from('artists').delete().eq('id', id); fetchArtists(); };

    // Schedule
    const handleSaveScheduleItem = async (data: any, id?: string) => {
        if(id) await supabase.from('schedule_items').update(data).eq('id', id);
        else await supabase.from('schedule_items').insert([data]);
        fetchSchedule();
    };
    const handleDeleteScheduleItem = async (id: string) => { await supabase.from('schedule_items').delete().eq('id', id); fetchSchedule(); };

    // Inventory
    const handleSaveInventoryItem = async (data: any, id?: string) => {
        const payload = { name: data.name, quantity: data.quantity, status: data.status, responsible_id: data.responsibleId };
        if(id) await supabase.from('inventory_items').update(payload).eq('id', id);
        else await supabase.from('inventory_items').insert([payload]);
        fetchInventory();
    };
    const handleDeleteInventoryItem = async (id: string) => { await supabase.from('inventory_items').delete().eq('id', id); fetchInventory(); };

    // Finances
    const handleSaveFinancialProject = async (data: any, id?: string) => {
        if(id) await supabase.from('financial_projects').update({ name: data.name, description: data.description }).eq('id', id);
        else await supabase.from('financial_projects').insert([{ name: data.name, description: data.description }]);
        fetchFinancialData();
    };
    const handleDeleteFinancialProject = async (id: string) => { await supabase.from('financial_projects').delete().eq('id', id); fetchFinancialData(); };
    const handleSaveTransaction = async (projId: string, data: any, id?: string) => {
        const payload = { project_id: projId, description: data.description, amount: data.amount, type: data.type, date: data.date, category: data.category };
        if(id) await supabase.from('transactions').update(payload).eq('id', id);
        else await supabase.from('transactions').insert([payload]);
        fetchFinancialData();
    };
    const handleDeleteTransaction = async (pid: string, id: string) => { await supabase.from('transactions').delete().eq('id', id); fetchFinancialData(); };

    // Team Hub (Feed & Status)
    const handleAddPost = async (content: string, author: Member) => {
        if (!loggedInUser) return;
        await supabase.from('team_feed_posts').insert([{ content, author_id: loggedInUser.id }]);
        fetchFeedPosts();
    };
    const handleUpdateTeamStatus = async (statusText: string) => {
        if (!loggedInUser) return;
        await supabase.from('team_statuses').upsert({ member_id: loggedInUser.id, status: statusText });
        fetchTeamStatuses();
    };

    // Collab Clio (Docs, Minutes, Voting)
    const handleSaveCollectiveDocument = async (docData: any, uploaderId: string) => {
        await supabase.from('collective_documents').insert([{
            name: docData.name,
            file_data_url: docData.fileDataUrl, // Note: Storing Base64 in DB is not ideal for prod (use Storage)
            file_name: docData.file.name,
            file_type: docData.file.type,
            uploader_id: uploaderId
        }]);
        fetchCollabData();
    };
    const handleDeleteCollectiveDocument = async (id: string) => {
        if(window.confirm('Tem certeza?')) {
            await supabase.from('collective_documents').delete().eq('id', id);
            fetchCollabData();
        }
    };

    const handleSaveMeetingMinute = async (data: any, id?: string) => {
        const payload = { date: data.date, attendee_ids: data.attendeeIds, agenda: data.agenda, decisions: data.decisions };
        if(id) await supabase.from('meeting_minutes').update(payload).eq('id', id);
        else await supabase.from('meeting_minutes').insert([payload]);
        fetchCollabData();
    };
    const handleDeleteMeetingMinute = async (id: string) => {
        if(window.confirm('Tem certeza?')) {
            await supabase.from('meeting_minutes').delete().eq('id', id);
            fetchCollabData();
        }
    };

    const handleSaveVotingTopic = async (data: any, creatorId: string) => {
        const { data: topic, error } = await supabase
            .from('voting_topics')
            .insert([{ title: data.title, description: data.description, creator_id: creatorId }])
            .select()
            .single();
        
        if (topic && !error) {
            const optionsPayload = data.options.map((o: any) => ({
                topic_id: topic.id,
                text: o.text
            }));
            await supabase.from('voting_options').insert(optionsPayload);
            fetchCollabData();
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
        fetchCollabData();
    };

    const handleCloseVoting = async (topicId: string) => {
        await supabase.from('voting_topics').update({ status: 'closed' }).eq('id', topicId);
        fetchCollabData();
    };
    
    // --- Notebooks Handlers ---
    const handleSaveNotebook = async (name: string, editingId?: string) => {
        if (!loggedInUser) return;
        if(editingId) {
             await supabase.from('notebooks').update({ name }).eq('id', editingId);
        } else {
             await supabase.from('notebooks').insert([{ name, owner_id: loggedInUser.id }]);
        }
        fetchNotebooks();
    };
    
    const handleDeleteNotebook = async (notebookId: string) => {
        await supabase.from('notebooks').delete().eq('id', notebookId);
        fetchNotebooks();
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
        } else {
             await supabase.from('notes').insert([payload]);
        }
        fetchNotebooks();
    };

    const handleDeleteNote = async (notebookId: string, noteId: string) => {
        await supabase.from('notes').delete().eq('id', noteId);
        fetchNotebooks();
    };
    
    // --- Media Handlers ---
    const handleSaveMediaItem = async (mediaData: Omit<MediaItem, 'id'>) => {
        await supabase.from('media_items').insert([{
            title: mediaData.title,
            category: mediaData.category,
            file_data_url: mediaData.fileDataUrl,
            file_name: mediaData.fileName,
            artist_id: mediaData.artistId
        }]);
        fetchMedia();
    };
    
    const handleDeleteMediaItem = async (mediaId: string) => {
        await supabase.from('media_items').delete().eq('id', mediaId);
        fetchMedia();
    }
    
    // --- Gallery Handlers ---
    const handleSavePhotoAlbum = async (albumData: Omit<PhotoAlbum, 'id' | 'photos'>, editingId?: string) => {
        if(editingId) {
            await supabase.from('photo_albums').update(albumData).eq('id', editingId);
        } else {
            await supabase.from('photo_albums').insert([albumData]);
        }
        fetchAlbums();
    };
    
    const handleDeletePhotoAlbum = async (albumId: string) => {
        await supabase.from('photo_albums').delete().eq('id', albumId);
        fetchAlbums();
    }
    
    const handleAddPhotosToAlbum = async (albumId: string, photos: Omit<Photo, 'id'>[]) => {
        const payload = photos.map(p => ({
            album_id: albumId,
            data_url: p.dataUrl,
            caption: p.caption,
            file_name: p.fileName
        }));
        await supabase.from('photos').insert(payload);
        fetchAlbums();
    };
    
    const handleDeletePhoto = async (albumId: string, photoId: string) => {
        await supabase.from('photos').delete().eq('id', photoId);
        fetchAlbums();
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
        // Guest login remains local for now
        const guestDataString = localStorage.getItem(`collab-clio-data-${GUEST_USER_EMAIL}`);
        if (guestDataString) {
            const guestData = JSON.parse(guestDataString);
            guestData.members = guestData.members.map((m: Member) => m.id === GUEST_USER.id ? GUEST_USER : m);
            if(!guestData.members.find((m:Member) => m.id === GUEST_USER.id)) {
                 guestData.members.push(GUEST_USER);
            }
            if (!guestData.gadgets || guestData.gadgets.length === 0) {
                guestData.gadgets = DEFAULT_GADGETS;
            }
            setUserState(guestData);
        } else {
            const guestData = { ...MOCK_INITIAL_DATA, members: [GUEST_USER] };
            localStorage.setItem(`collab-clio-data-${GUEST_USER_EMAIL}`, JSON.stringify(guestData));
            setUserState(guestData);
        }
        setLoggedInUser(GUEST_USER);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setLoggedInUser(null);
        setUserState(MOCK_INITIAL_DATA);
        setAppStates(initialAppStates);
        setActiveMobileApp(null);
    };

    const randomLoginWallpaper = useMemo(() => {
        if (loggedInUser) return null; // Don't calculate if logged in
        const randomIndex = Math.floor(Math.random() * wallpapers.length);
        return wallpapers[randomIndex].url;
    }, [loggedInUser]);

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

    const { members, artists, tasks, schedule, financialProjects, totalBudget, feedPosts, eventInfo, mediaItems, inventoryItems, gadgets, notebooks, photoAlbums, collectiveDocuments, meetingMinutes, votingTopics, teamStatuses } = userState;
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
            case 'financial_project': return <div />; // Handled inside FinanceApp logic, but referenced here for type safety
            case 'transaction': return <TransactionForm onSubmit={handleAndClose((data, id) => handleSaveTransaction(editingItem?.projectId || selectedGadgetId, {...data, type: editingItem?.type || 'expense' }, id))} transaction={editingItem} type={editingItem?.type || 'expense'} />; 
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
        { name: 'finances', title: 'Finanças', icon: <DockAppIcon bgColorClasses="bg-emerald-600"><WalletIcon /></DockAppIcon>, component: <FinanceApp financialProjects={financialProjects} members={members} handleSaveFinancialProject={handleSaveFinancialProject} handleDeleteFinancialProject={handleDeleteFinancialProject} handleSaveTransaction={handleSaveTransaction} handleDeleteTransaction={handleDeleteTransaction} /> },
        { name: 'notebooks', title: 'Cadernos', icon: <DockAppIcon bgColorClasses="bg-amber-600"><BookMarkedIcon /></DockAppIcon>, component: <NotebooksApp notebooks={notebooks} handleSaveNotebook={handleSaveNotebook} handleDeleteNotebook={handleDeleteNotebook} handleSaveNote={handleSaveNote} handleDeleteNote={handleDeleteNote} /> },
        { name: 'collab_clio', title: 'Collab Clio', icon: <DockAppIcon bgColorClasses="bg-cyan-700"><BriefcaseIcon /></DockAppIcon>, component: <CollabClioApp onOpenModal={openModal} currentUser={loggedInUser} {...userState} handleDeleteCollectiveDocument={handleDeleteCollectiveDocument} handleDeleteMeetingMinute={handleDeleteMeetingMinute} handleCastVote={handleCastVote} handleCloseVoting={handleCloseVoting} /> },
        { name: 'browser', title: 'Navegador', icon: <DockAppIcon bgColorClasses="bg-cyan-600"><GlobeIcon /></DockAppIcon>, component: <BrowserApp /> },
        { name: 'profile', title: 'Meu Perfil', icon: <DockAppIcon bgColorClasses="bg-gray-500"><UserIcon /></DockAppIcon>, component: <ProfileApp currentUser={loggedInUser} onSaveProfile={handleSaveProfile} onChangePassword={handleChangePassword} /> },
        { name: 'personalize', title: 'Personalizar', icon: <DockAppIcon bgColorClasses="bg-gradient-to-br from-rose-500 to-violet-600"><BrushIcon /></DockAppIcon>, component: <PersonalizeApp currentWallpaper={wallpaperImage || DEFAULT_WALLPAPER} onSetWallpaper={handleSetWallpaper} onResetWallpaper={handleResetWallpaper} handleAddGadget={handleAddGadget} wallpapers={wallpapers} /> },
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
        collectiveDocuments
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
                 </div>
             </MobileGadgetWrapper>
        )
    }

    return (
        <AppContext.Provider value={contextValue}>
            <div 
                className="h-[100dvh] w-screen font-sans bg-cover bg-center overflow-hidden"
                style={{ backgroundImage: `url(${wallpaperImage || DEFAULT_WALLPAPER})` }}
            >
                 <div className="absolute inset-0 bg-slate-900/30"></div>
                 
                 {/* Global Search Overlay */}
                 <GlobalSearch 
                    isOpen={isSearchOpen} 
                    onClose={() => setIsSearchOpen(false)} 
                    onOpenModal={openModal} 
                 />
                 
                {isMobile ? (
                    <div className="h-full w-full overflow-hidden flex flex-col relative bg-slate-900">
                        {/* Static Background for Mobile */}
                        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${wallpaperImage || DEFAULT_WALLPAPER})` }}></div>

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
                                <main className="flex-1 overflow-y-auto bg-slate-800/70 backdrop-blur-lg pb-safe">
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
                                    className="flex-1 flex flex-col relative overflow-hidden pb-28" // Added pb-28 to avoid overlap with dock
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
                                        {/* Empty State Page if user wipes to empty page? No, logic restricts pages */}
                                    </div>

                                    {/* Page Indicator */}
                                    <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-none">
                                        {Array.from({ length: totalMobilePages }).map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={`w-2 h-2 rounded-full transition-colors ${i === mobilePage ? 'bg-white' : 'bg-white/30'}`}
                                            />
                                        ))}
                                    </div>

                                </main>
                                <footer className="absolute bottom-4 left-0 right-0 flex justify-center z-20 px-4">
                                     <div className="bg-black/40 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-2 md:gap-4 max-w-full overflow-x-auto no-scrollbar">
                                        {['dashboard', 'tasks', 'team_hub', 'finances'].map(appName => {
                                            const app = appConfig.find(a => a.name === appName)!;
                                            return (
                                                <button key={app.name} onClick={() => setActiveMobileApp(app.name)} className="flex flex-col items-center p-2 space-y-1 rounded-xl active:bg-white/10 transition-colors">
                                                    <div className="w-10 h-10">{app.icon}</div>
                                                </button>
                                            )
                                        })}
                                        <div className="w-px h-8 bg-white/20 mx-1"></div>
                                        <button onClick={() => setIsAppDrawerOpen(true)} className="flex flex-col items-center p-2 space-y-1 rounded-xl active:bg-white/10 transition-colors">
                                            <div className="w-10 h-10 rounded-[14px] flex items-center justify-center text-white bg-slate-600/80"><MenuIcon className="w-6 h-6"/></div>
                                        </button>
                                     </div>
                                </footer>
                            </>
                        )}
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
                )}
                <Modal isOpen={modalOpen} onClose={closeModal} title={getModalTitle()}>{renderModalContent()}</Modal>
            </div>
        </AppContext.Provider>
    );
};

export default App;
