
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { Member, Task, ScheduleItem, Artist, ModalView, EventInfoData, MediaItem, InventoryItem, Gadget, PhotoAlbum, Photo, CollectiveDocument, MeetingMinute, VotingTopic, TaskStatus, FinancialProject, Transaction, Notebook, Note, GadgetType, GadgetData, FeedPost, TeamStatus } from './types';
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
                fetchTasks(); // Fetch tasks on load
                fetchArtists(); // Fetch artists on load
            } else {
                setLoadingAuth(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchUserProfile(session.user.id, session.user.email!);
                fetchTasks(); // Fetch tasks on auth change
                fetchArtists(); // Fetch artists on auth change
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
    
    // --- SUPABASE DATA FETCHING (TASKS) ---
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
                    dueDate: t.due_date, // Map from DB snake_case to CamelCase
                    assigneeId: t.assignee_id
                }));
                updateUserState('tasks', mappedTasks);
            }
        } catch (err) {
            console.error('Error fetching tasks:', err);
        }
    };

    // --- SUPABASE DATA FETCHING (ARTISTS) ---
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
        
        // TASKS & ARTISTS ARE NOW HANDLED BY SUPABASE, so we don't overwrite them from local storage if fetched
        // fetchTasks/fetchArtists will overwrite these properties later.
        
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

    // --- SUPABASE TASK HANDLERS ---
    const handleSaveTask = async (taskData: Omit<Task, 'id' | 'status'>, editingId?: string) => {
        try {
            if (editingId) {
                const { error } = await supabase
                    .from('tasks')
                    .update({
                        title: taskData.title,
                        description: taskData.description,
                        due_date: taskData.dueDate,
                        assignee_id: taskData.assigneeId || null
                    })
                    .eq('id', editingId);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('tasks')
                    .insert([{
                        title: taskData.title,
                        description: taskData.description,
                        due_date: taskData.dueDate,
                        assignee_id: taskData.assigneeId || null,
                        status: TaskStatusEnum.ToDo
                    }]);

                if (error) throw error;
            }
            fetchTasks();
        } catch (err) {
            console.error('Error saving task:', err);
            alert('Erro ao salvar tarefa. Tente novamente.');
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            const { error } = await supabase.from('tasks').delete().eq('id', taskId);
            if (error) throw error;
            fetchTasks();
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
        try {
            // Optimistic UI update for speed
            const updatedTasks = userState.tasks.map((t: Task) => t.id === taskId ? { ...t, status: newStatus } : t);
            updateUserState('tasks', updatedTasks);

            const { error } = await supabase
                .from('tasks')
                .update({ status: newStatus })
                .eq('id', taskId);
            
            if (error) {
                throw error;
            }
        } catch (err) {
            console.error('Error updating task status:', err);
            fetchTasks(); // Revert to server state
        }
    };
    
    // --- SUPABASE ARTIST HANDLERS ---
    const handleSaveArtist = async (artistData: Omit<Artist, 'id'>, editingId?: string) => {
        try {
            const payload = {
                name: artistData.name,
                performance_type: artistData.performanceType,
                contact: artistData.contact,
                notes: artistData.notes,
                instagram: artistData.instagram,
                whatsapp: artistData.whatsapp,
                cpf: artistData.cpf,
                rg: artistData.rg,
                document_image: artistData.documentImage
            };

            if (editingId) {
                const { error } = await supabase
                    .from('artists')
                    .update(payload)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('artists')
                    .insert([payload]);
                if (error) throw error;
            }
            fetchArtists();
        } catch (err) {
            console.error('Error saving artist:', err);
            alert('Erro ao salvar artista. Tente novamente.');
        }
    };

    const handleDeleteArtist = async (artistId: string) => {
        try {
            const { error } = await supabase.from('artists').delete().eq('id', artistId);
            if (error) throw error;
            fetchArtists();
        } catch (err) {
            console.error('Error deleting artist:', err);
        }
    };
    
    // --- LOCAL HANDLERS (Legacy) ---
    const handleSaveMember = (memberData: Member) => updateUserState('members', userState.members.map((m: Member) => m.id === memberData.id ? { ...m, ...memberData } : m));
    const handleSaveProfile = (updatedData: Partial<Member>) => {
        if(!loggedInUser) return;
        const updatedUser = { ...loggedInUser, ...updatedData };
        setLoggedInUser(updatedUser);
        handleSaveMember(updatedUser);
    }
    const handleChangePassword = (currentPassword: string, newPassword: string) => {
        // Supabase password change would go here
        // For now, basic alert that it's not implemented fully in this refactor step
        alert('Alteração de senha via Supabase ainda será implementada.');
        return { success: true, message: 'Simulação: Senha alterada!' };
    };

    // Schedule, EventInfo, etc. (still local for this step)
    const handleSaveScheduleItem = (itemData: Omit<ScheduleItem, 'id'>, editingId?: string) => {
        const newSchedule = editingId
            ? userState.schedule.map((s: ScheduleItem) => s.id === editingId ? { ...s, ...itemData, id: editingId } : s)
            : [...userState.schedule, { ...itemData, id: crypto.randomUUID() }];
        updateUserState('schedule', newSchedule);
    };
    const handleDeleteScheduleItem = (itemId: string) => updateUserState('schedule', userState.schedule.filter((s: ScheduleItem) => s.id !== itemId));

    const handleSaveEventInfo = (infoData: EventInfoData) => updateUserState('eventInfo', infoData);
    
    const handleSaveMediaItem = (mediaData: Omit<MediaItem, 'id'>) => updateUserState('mediaItems', [{ ...mediaData, id: crypto.randomUUID()}, ...userState.mediaItems]);
    const handleDeleteMediaItem = (mediaId: string) => updateUserState('mediaItems', userState.mediaItems.filter((m: MediaItem) => m.id !== mediaId));

    const handleSaveInventoryItem = (itemData: Omit<InventoryItem, 'id'>, editingId?: string) => {
        const newItems = editingId
            ? userState.inventoryItems.map((i: InventoryItem) => i.id === editingId ? { ...i, ...itemData, id: editingId } : i)
            : [...userState.inventoryItems, { ...itemData, id: crypto.randomUUID() }];
        updateUserState('inventoryItems', newItems);
    };
    const handleDeleteInventoryItem = (itemId: string) => updateUserState('inventoryItems', userState.inventoryItems.filter((i: InventoryItem) => i.id !== itemId));
    
    const handleAddPost = (content: string, author: Member) => {
        const newPost: FeedPost = { id: crypto.randomUUID(), author, content, timestamp: new Date().toISOString() };
        updateUserState('feedPosts', [newPost, ...userState.feedPosts]);
    };
    // ... all other handlers follow this pattern ...
    // --- Handlers for all other features --- (omitted for brevity, but the pattern is the same)
    const handleSaveFinancialProject = (projectData: Omit<FinancialProject, 'id' | 'transactions'>, editingId?: string) => {
        const newProjects = editingId
            ? userState.financialProjects.map((p: FinancialProject) => p.id === editingId ? { ...p, ...projectData } : p)
            : [{ ...projectData, id: crypto.randomUUID(), transactions: [] }, ...userState.financialProjects];
        updateUserState('financialProjects', newProjects);
    };
    const handleDeleteFinancialProject = (projectId: string) => updateUserState('financialProjects', userState.financialProjects.filter((p: FinancialProject) => p.id !== projectId));
    const handleSaveTransaction = (projectId: string, transactionData: Omit<Transaction, 'id'>, editingId?: string) => {
        const newProjects = userState.financialProjects.map((p: FinancialProject) => {
            if (p.id === projectId) {
                const newTransactions = editingId
                    ? p.transactions.map((t: Transaction) => t.id === editingId ? { ...t, ...transactionData, id: editingId } : t)
                    : [{ ...transactionData, id: crypto.randomUUID() }, ...p.transactions];
                return { ...p, transactions: newTransactions };
            }
            return p;
        });
        updateUserState('financialProjects', newProjects);
    };
    const handleDeleteTransaction = (projectId: string, transactionId: string) => {
        const newProjects = userState.financialProjects.map((p: FinancialProject) => {
            if (p.id === projectId) {
                return { ...p, transactions: p.transactions.filter((t: Transaction) => t.id !== transactionId) };
            }
            return p;
        });
        updateUserState('financialProjects', newProjects);
    };
     const handleSaveNotebook = (name: string, editingId?: string) => {
        const newNotebooks = editingId
            ? userState.notebooks.map((nb: Notebook) => nb.id === editingId ? { ...nb, name } : nb)
            : [{ id: crypto.randomUUID(), name, notes: [] }, ...userState.notebooks];
        updateUserState('notebooks', newNotebooks);
    };
    const handleDeleteNotebook = (notebookId: string) => updateUserState('notebooks', userState.notebooks.filter((nb: Notebook) => nb.id !== notebookId));
    const handleSaveNote = (notebookId: string, noteData: Pick<Note, 'title' | 'content'>, editingId?: string) => {
        const newNotebooks = userState.notebooks.map((nb: Notebook) => {
            if (nb.id === notebookId) {
                const newNotes = editingId
                    ? nb.notes.map((n: Note) => n.id === editingId ? { ...n, ...noteData, updatedAt: new Date().toISOString() } : n)
                    : [{ ...noteData, id: crypto.randomUUID(), updatedAt: new Date().toISOString() }, ...nb.notes];
                newNotes.sort((a: Note, b: Note) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                return { ...nb, notes: newNotes };
            }
            return nb;
        });
        updateUserState('notebooks', newNotebooks);
    };
    const handleDeleteNote = (notebookId: string, noteId: string) => {
        const newNotebooks = userState.notebooks.map((nb: Notebook) => {
            if (nb.id === notebookId) {
                return { ...nb, notes: nb.notes.filter((n: Note) => n.id !== noteId) };
            }
            return nb;
        });
        updateUserState('notebooks', newNotebooks);
    };
    const handleSavePhotoAlbum = (albumData: Omit<PhotoAlbum, 'id' | 'photos'>, editingId?: string) => {
        const newAlbums = editingId
            ? userState.photoAlbums.map((a: PhotoAlbum) => a.id === editingId ? { ...a, ...albumData } : a)
            : [{ ...albumData, id: crypto.randomUUID(), photos: [] }, ...userState.photoAlbums];
        updateUserState('photoAlbums', newAlbums);
    };
    const handleDeletePhotoAlbum = (albumId: string) => updateUserState('photoAlbums', userState.photoAlbums.filter((a: PhotoAlbum) => a.id !== albumId));
    const handleAddPhotosToAlbum = (albumId: string, photos: Omit<Photo, 'id'>[]) => {
        const newAlbums = userState.photoAlbums.map((album: PhotoAlbum) => {
            if (album.id === albumId) {
                const newPhotos = photos.map(p => ({ ...p, id: crypto.randomUUID() }));
                return { ...album, photos: [...album.photos, ...newPhotos] };
            }
            return album;
        });
        updateUserState('photoAlbums', newAlbums);
    };
    const handleDeletePhoto = (albumId: string, photoId: string) => {
        const newAlbums = userState.photoAlbums.map((album: PhotoAlbum) => {
            if (album.id === albumId) {
                return { ...album, photos: album.photos.filter((p: Photo) => p.id !== photoId) };
            }
            return album;
        });
        updateUserState('photoAlbums', newAlbums);
    };
     const handleSaveCollectiveDocument = (docData: { name: string, file: File, fileDataUrl: string }, uploaderId: string) => {
        const newDocument: CollectiveDocument = {
            id: crypto.randomUUID(), name: docData.name, fileDataUrl: docData.fileDataUrl,
            fileName: docData.file.name, fileType: docData.file.type,
            uploadedAt: new Date().toISOString(), uploaderId: uploaderId,
        };
        updateUserState('collectiveDocuments', [newDocument, ...userState.collectiveDocuments]);
    };
    const handleDeleteCollectiveDocument = (docId: string) => {
        if(window.confirm('Tem certeza?')) {
            updateUserState('collectiveDocuments', userState.collectiveDocuments.filter((d: CollectiveDocument) => d.id !== docId));
        }
    };
    const handleSaveMeetingMinute = (minuteData: Omit<MeetingMinute, 'id'>, editingId?: string) => {
        const newMinutes = editingId
            ? userState.meetingMinutes.map((m: MeetingMinute) => m.id === editingId ? { ...m, ...minuteData, id: editingId } : m)
            : [{...minuteData, id: crypto.randomUUID() }, ...userState.meetingMinutes];
        updateUserState('meetingMinutes', newMinutes);
    };
    const handleDeleteMeetingMinute = (minuteId: string) => {
        if(window.confirm('Tem certeza?')) {
            updateUserState('meetingMinutes', userState.meetingMinutes.filter((m: MeetingMinute) => m.id !== minuteId));
        }
    };
    const handleSaveVotingTopic = (topicData: Omit<VotingTopic, 'id' | 'creatorId' | 'createdAt' | 'status'>, creatorId: string) => {
        const newTopic: VotingTopic = {
            ...topicData, id: crypto.randomUUID(), creatorId, createdAt: new Date().toISOString(), status: 'open',
            options: topicData.options.map(o => ({ ...o, id: crypto.randomUUID(), voterIds: [] }))
        };
        updateUserState('votingTopics', [newTopic, ...userState.votingTopics]);
    };
    const handleCastVote = (topicId: string, optionId: string, voterId: string) => {
        const newTopics = userState.votingTopics.map((topic: VotingTopic) => {
            if (topic.id === topicId && topic.status === 'open') {
                const newOptions = topic.options.map(opt => {
                    const newVoterIds = opt.voterIds.filter(id => id !== voterId);
                    if (opt.id === optionId) { newVoterIds.push(voterId); }
                    return { ...opt, voterIds: newVoterIds };
                });
                return { ...topic, options: newOptions };
            }
            return topic;
        });
        updateUserState('votingTopics', newTopics);
    };
    const handleCloseVoting = (topicId: string) => {
        const newTopics = userState.votingTopics.map((topic: VotingTopic) => 
            topic.id === topicId ? { ...topic, status: 'closed' } : topic
        );
        updateUserState('votingTopics', newTopics);
    };
    const handleUpdateTeamStatus = (statusText: string) => {
        if (!loggedInUser) return;

        const existingStatusIndex = userState.teamStatuses.findIndex((s: TeamStatus) => s.memberId === loggedInUser.id);
        let newStatuses;
        if (existingStatusIndex > -1) {
            // Update existing status
            newStatuses = [...userState.teamStatuses];
            newStatuses[existingStatusIndex] = { ...newStatuses[existingStatusIndex], status: statusText };
        } else {
            // Add new status
            const newStatus: TeamStatus = { memberId: loggedInUser.id, status: statusText };
            newStatuses = [...userState.teamStatuses, newStatus];
        }
        updateUserState('teamStatuses', newStatuses);
    };

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
