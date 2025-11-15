
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// FIX: Added FeedPost to the type imports.
import type { Member, Task, ScheduleItem, Artist, ModalView, EventInfoData, MediaItem, InventoryItem, Track, Gadget, PhotoAlbum, Photo, CollectiveDocument, MeetingMinute, VotingTopic, TaskStatus, FinancialProject, Transaction, Notebook, Note, GadgetType, GadgetData, FeedPost, TeamStatus } from './types';
import { TaskStatus as TaskStatusEnum, InventoryStatus } from './types';
import LoginScreen from './components/LoginScreen';
import ClioOSDesktop from './components/ClioOSDesktop';
import AppWindow from './components/AppWindow';
import PersonalizeApp from './components/PersonalizeApp';
import FinanceApp from './components/FinanceApp';
import NotebooksApp from './components/NotebooksApp';
import PhotoGalleryApp from './components/PhotoGalleryApp';
import MusicPlayerWidget from './components/MusicPlayerWidget';
import BrowserApp from './components/BrowserApp';
import CollabClioApp from './components/CollabClioApp';
import ClioPlayerApp from './components/ClioPlayerApp';
import GadgetWrapper from './components/gadgets/GadgetWrapper';
import AnalogClock from './components/gadgets/AnalogClock';
import CountdownGadget from './components/gadgets/CountdownGadget';
import QuickNoteGadget from './components/gadgets/QuickNoteGadget';
import FinancialSummaryGadget from './components/gadgets/FinancialSummaryGadget';
import TeamStatusGadget from './components/gadgets/TeamStatusGadget';
import RadioClioGadget from './components/gadgets/RadioClioGadget';
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
import { ChevronLeftIcon, PowerIcon, HomeIcon, CheckSquareIcon, ClockIcon, UsersIcon, BoxIcon, InfoIcon, ImageIcon, BookOpenIcon, FileTextIcon, WalletIcon, BookMarkedIcon, RadioIcon, BriefcaseIcon, GlobeIcon, UserIcon, BrushIcon, DockAppIcon, WhatsappIcon, MusicIcon, SkipBackIcon, SkipForwardIcon, PlayIcon, PauseIcon, MenuIcon } from './components/icons';
// FIX: Import AppContext to provide context to children components.
import { AppContext } from './contexts/AppContext';

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
defaultEventDate.setMonth(defaultEventDate.getMonth() + 1);

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
    gadgets: [] as Gadget[],
    totalBudget: 0,
};

const CURATED_RADIO_PLAYLIST: Track[] = [
    {
        name: 'Super Hero',
        artist: 'Ébanos Black',
        url: 'https://files.catbox.moe/49tch7.mp3',
        artwork: 'https://i.postimg.cc/8PqFhf7p/ebanosblacksuperhero.png',
        duration: 202,
    },
    {
        name: 'A milhão',
        artist: 'Ébanos Black',
        url: 'https://files.catbox.moe/08cne1.mp3',
        artwork: 'https://i.postimg.cc/jSthz1wd/ebanosblackamilhao.png',
        duration: 184,
    },
    {
        name: 'Abraços Cronometrados',
        artist: 'Molotov das Ruas',
        url: 'https://files.catbox.moe/srxd8a.mp3',
        artwork: 'https://i.postimg.cc/xCChGWSb/molotovdasruasabracos.png',
        duration: 192,
    },
    {
        name: 'Flores desabrocharão',
        artist: 'Molotov das Ruas',
        url: 'https://files.catbox.moe/kkfycl.mp3',
        artwork: 'https://i.postimg.cc/L5hqp6FK/molotovdasruasflores.png',
        duration: 218,
    }
];

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
    | 'personalize' | 'finances' | 'notebooks' | 'gallery' | 'browser' | 'collab_clio' | 'profile' | 'clio_player' | 'whatsapp';

export type AppStatus = 'open' | 'minimized' | 'closed';
export type AppStates = Record<AppName, AppStatus>;

const initialAppStates: AppStates = {
    dashboard: 'closed', info: 'closed', tasks: 'closed', schedule: 'closed',
    artists: 'closed', team_hub: 'closed', media: 'closed', inventory: 'closed',
    reports: 'closed', documentation: 'closed', clio_company: 'closed',
    personalize: 'closed', finances: 'closed', notebooks: 'closed', gallery: 'closed',
    browser: 'closed', collab_clio: 'closed', profile: 'closed', clio_player: 'closed',
    whatsapp: 'closed'
};

const DEFAULT_WALLPAPER = 'https://i.postimg.cc/0NYRtj9R/clio-rebelde-editada-0-6.jpg';

const GUEST_USER_EMAIL = 'guest@dev.clio';
const GUEST_USER: Member = {
    id: 'guest-dev-id',
    name: 'Visitante Dev',
    email: GUEST_USER_EMAIL,
    avatar: `https://i.pravatar.cc/150?u=${GUEST_USER_EMAIL}`,
    role: 'Desenvolvedor'
};

// --- MOBILE-SPECIFIC COMPONENTS ---
const MobileTopBar: React.FC<{ user: Member, onToggleControlCenter: () => void, onOpenProfile: () => void }> = ({ user, onToggleControlCenter, onOpenProfile }) => {
    const [time, setTime] = useState(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        }, 1000 * 60);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="flex-shrink-0 bg-black/30 backdrop-blur-lg h-12 flex items-center justify-between px-3 z-30 border-b border-white/10">
            <button onClick={onOpenProfile} className="flex items-center gap-2 active:opacity-70">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
            </button>
            <span className="font-semibold text-sm text-white">{time}</span>
            <button onClick={onToggleControlCenter} className="p-2 -mr-2 active:opacity-70">
                <MenuIcon className="w-6 h-6 text-white" />
            </button>
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


// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [users, setUsers] = useState<Member[]>(() => JSON.parse(localStorage.getItem('clio-os-users') || '[]'));
    const [loggedInUser, setLoggedInUser] = useState<Member | null>(null);

    // This state will hold all data for the currently logged-in user
    const [userState, setUserState] = useState<any>(null);

    const [wallpaperImage, setWallpaperImage] = useState<string | null>(null);
    const [appStates, setAppStates] = useState<AppStates>(initialAppStates);

    // Mobile state
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [activeMobileApp, setActiveMobileApp] = useState<AppName | null>(null);
    const [isMobileControlCenterOpen, setIsMobileControlCenterOpen] = useState(false);
    const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);

    // Mobile gesture handling
    const touchStartY = useRef<number | null>(null);
    const touchEndY = useRef<number | null>(null);
    const minSwipeDistance = 50;

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.targetTouches[0].clientY;
        touchEndY.current = null; // reset end position on new touch
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndY.current = e.targetTouches[0].clientY;
    };

    const handleTouchEnd = () => {
        if (!touchStartY.current || !touchEndY.current) return;

        const distance = touchStartY.current - touchEndY.current;
        const isSwipeUp = distance > minSwipeDistance;
        const isSwipeDown = distance < -minSwipeDistance;
        
        // Don't trigger if a panel is already open
        if (isAppDrawerOpen || isMobileControlCenterOpen) return;

        if (isSwipeUp) {
            setIsAppDrawerOpen(true);
        } else if (isSwipeDown) {
            setIsMobileControlCenterOpen(true);
        }
        
        // Reset refs
        touchStartY.current = null;
        touchEndY.current = null;
    };


    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalView, setModalView] = useState<ModalView | null>(null);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Personal Music Player State
    const [isMusicPlayerOpen, setIsMusicPlayerOpen] = useState(false);
    const [playlist, setPlaylist] = useState<Track[]>([]);
    const playlistRef = useRef(playlist);
    playlistRef.current = playlist;
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.75);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const musicFileInputRef = useRef<HTMLInputElement>(null);

    // Clio Player State
    const [clioPlaylist] = useState<Track[]>(CURATED_RADIO_PLAYLIST);
    const [currentClioTrackIndex, setCurrentClioTrackIndex] = useState(0);
    const [isClioPlaying, setIsClioPlaying] = useState(false);
    const [clioProgress, setClioProgress] = useState(0);
    const [isClioSeeking, setIsClioSeeking] = useState(false);
    const clioAudioRef = useRef<HTMLAudioElement>(null);

    
    // --- USER & DATA MANAGEMENT ---
    useEffect(() => {
        // Persist users list whenever it changes
        localStorage.setItem('clio-os-users', JSON.stringify(users));
    }, [users]);
    
    useEffect(() => {
        // This effect will run only once, on mount, and its cleanup will run on unmount.
        return () => {
            // Revoke any blob URLs from the music player playlist to prevent memory leaks
            playlistRef.current.forEach(track => {
                if (track.url.startsWith('blob:')) {
                    URL.revokeObjectURL(track.url);
                }
            });
        };
    }, []);


    const loadUserData = (email: string) => {
        const userDataString = localStorage.getItem(`collab-clio-data-${email}`);
        if(userDataString) {
            setUserState(JSON.parse(userDataString));
        }
        const userWallpaper = localStorage.getItem(`clio-os-wallpaper-${email}`);
        setWallpaperImage(userWallpaper);
    };

    const saveUserData = useCallback(() => {
        if (loggedInUser && userState) {
            localStorage.setItem(`collab-clio-data-${loggedInUser.email}`, JSON.stringify(userState));
        }
    }, [loggedInUser, userState]);

    useEffect(() => {
        saveUserData();
    }, [userState, saveUserData]);

    const handleLogin = (email: string, password: string): boolean => {
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (user) {
            setLoggedInUser(user);
            loadUserData(user.email);
            return true;
        }
        return false;
    };

    const handleSignUp = (name: string, email: string, password: string): { success: boolean, message: string } => {
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, message: 'Este e-mail já está em uso.' };
        }
        const newUser: Member = {
            id: crypto.randomUUID(),
            name,
            email,
            password,
            avatar: `https://i.pravatar.cc/150?u=${email}`,
            role: 'Membro'
        };
        const newUserData = { ...MOCK_INITIAL_DATA, members: [newUser] };
        localStorage.setItem(`collab-clio-data-${email}`, JSON.stringify(newUserData));
        setUsers(current => [...current, newUser]);
        setLoggedInUser(newUser);
        setUserState(newUserData);
        return { success: true, message: 'Cadastro realizado!' };
    };

    const handleGuestLogin = () => {
        const guestDataString = localStorage.getItem(`collab-clio-data-${GUEST_USER_EMAIL}`);
        if (guestDataString) {
            // Guest user data exists, load it
            setUserState(JSON.parse(guestDataString));
        } else {
            // First time guest login, create mock data
            const guestData = { ...MOCK_INITIAL_DATA, members: [GUEST_USER] };
            localStorage.setItem(`collab-clio-data-${GUEST_USER_EMAIL}`, JSON.stringify(guestData));
            setUserState(guestData);
        }
        setLoggedInUser(GUEST_USER);
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        setUserState(null);
        setAppStates(initialAppStates);
        setActiveMobileApp(null);
    };

    const randomLoginWallpaper = useMemo(() => {
        if (loggedInUser) return null; // Don't calculate if logged in
        const randomIndex = Math.floor(Math.random() * wallpapers.length);
        return wallpapers[randomIndex].url;
    }, [loggedInUser]);

    // --- GENERIC STATE UPDATE HANDLER ---
    const updateUserState = (key: keyof typeof MOCK_INITIAL_DATA, value: any) => {
        setUserState((current: any) => ({ ...current, [key]: value }));
    };

    // --- SPECIFIC HANDLERS (delegating to updateUserState) ---
    const handleSaveTask = (taskData: Omit<Task, 'id' | 'status'>, editingId?: string) => {
        const newTasks = editingId 
            ? userState.tasks.map((t: Task) => t.id === editingId ? { ...t, ...taskData } : t)
            : [{ ...taskData, id: crypto.randomUUID(), status: TaskStatusEnum.ToDo }, ...userState.tasks];
        updateUserState('tasks', newTasks);
    };
    const handleDeleteTask = (taskId: string) => updateUserState('tasks', userState.tasks.filter((t: Task) => t.id !== taskId));
    const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => updateUserState('tasks', userState.tasks.map((t: Task) => t.id === taskId ? { ...t, status: newStatus } : t));
    
    // Member handlers
    const handleSaveMember = (memberData: Member) => updateUserState('members', userState.members.map((m: Member) => m.id === memberData.id ? { ...m, ...memberData } : m));
    const handleSaveProfile = (updatedData: Partial<Member>) => {
        if(!loggedInUser) return;
        const updatedUser = { ...loggedInUser, ...updatedData };
        setLoggedInUser(updatedUser);
        handleSaveMember(updatedUser);
    }
    const handleChangePassword = (currentPassword: string, newPassword: string) => {
        if(!loggedInUser || loggedInUser.password !== currentPassword) {
            return { success: false, message: 'Senha atual incorreta.' };
        }
        const updatedUser = { ...loggedInUser, password: newPassword };
        setLoggedInUser(updatedUser); // Update state in App
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u)); // Update persisted users list
        return { success: true, message: 'Senha alterada com sucesso!' };
    };

    // Schedule, Artist, EventInfo, etc. (similar pattern)
    const handleSaveScheduleItem = (itemData: Omit<ScheduleItem, 'id'>, editingId?: string) => {
        const newSchedule = editingId
            ? userState.schedule.map((s: ScheduleItem) => s.id === editingId ? { ...s, ...itemData, id: editingId } : s)
            : [...userState.schedule, { ...itemData, id: crypto.randomUUID() }];
        updateUserState('schedule', newSchedule);
    };
    const handleDeleteScheduleItem = (itemId: string) => updateUserState('schedule', userState.schedule.filter((s: ScheduleItem) => s.id !== itemId));

    const handleSaveArtist = (artistData: Omit<Artist, 'id'>, editingId?: string) => {
        const newArtists = editingId
            ? userState.artists.map((a: Artist) => a.id === editingId ? { ...a, ...artistData, id: editingId } : a)
            : [...userState.artists, { ...artistData, id: crypto.randomUUID() }];
        updateUserState('artists', newArtists);
    };
    const handleDeleteArtist = (artistId: string) => updateUserState('artists', userState.artists.filter((a: Artist) => a.id !== artistId));

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
    const handleAppClick = (appName: AppName) => setAppStates(prev => ({ ...prev, [appName]: 'open' }));
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

    // --- Music Player Handlers ---
    const handlePlayPause = useCallback(() => { if (playlist.length > 0) setIsPlaying(!isPlaying); }, [playlist.length, isPlaying]);
    const handleNextTrack = useCallback(() => {
        if (playlist.length > 0) {
            setCurrentTrackIndex(p => (p + 1) % playlist.length);
            setIsPlaying(true);
        }
    }, [playlist.length]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const setAudioData = () => setDuration(audio.duration);
        const setAudioTime = () => setProgress(audio.currentTime);
        const handleAudioEnd = () => handleNextTrack();
        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', handleAudioEnd);
        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', handleAudioEnd);
        };
    }, [playlist, currentTrackIndex, handleNextTrack]);
    useEffect(() => { if (audioRef.current) { isPlaying ? audioRef.current.play().catch(console.error) : audioRef.current.pause(); } }, [isPlaying, currentTrackIndex]);
    useEffect(() => { if (audioRef.current) { audioRef.current.volume = volume; } }, [volume]);

    const handlePrevTrack = useCallback(() => { 
        if(playlist.length > 0) {
            setCurrentTrackIndex(p => (p - 1 + playlist.length) % playlist.length); 
            setIsPlaying(true); 
        }
    }, [playlist.length]);

    const handleSelectTrack = useCallback((index: number) => { 
        setCurrentTrackIndex(index); 
        setIsPlaying(true); 
    }, []);

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value); };
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => setVolume(Number(e.target.value));
    const handleMusicFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const track: Omit<Track, 'duration'> & { duration?: number } = { name: file.name.replace('.mp3', ''), artist: 'Desconhecido', url: URL.createObjectURL(file), artwork: '' };
            const audioForDuration = new Audio(track.url);
            audioForDuration.onloadedmetadata = () => {
                const fullTrack: Track = {...track, duration: audioForDuration.duration };
                setPlaylist(p => [...p, fullTrack]);
                if (!isPlaying) { setCurrentTrackIndex(playlist.length); setIsPlaying(true); }
            };
        }
    };
    const triggerMusicFileInput = () => musicFileInputRef.current?.click();

    // --- Clio Player Handlers ---
    const handleClioPlayPause = useCallback(() => {
        if (clioPlaylist.length > 0) {
            const audio = clioAudioRef.current;
            if (audio) {
                if (isClioPlaying) {
                    audio.pause();
                } else {
                    audio.play().catch(e => {
                        console.error("Audio play failed:", e);
                        setIsClioPlaying(false); // Revert state if play fails
                    });
                }
                setIsClioPlaying(!isClioPlaying);
            }
        }
    }, [clioPlaylist.length, isClioPlaying]);

    const handleClioNext = useCallback(() => {
        if (clioPlaylist.length > 0) {
            setCurrentClioTrackIndex(p => (p + 1) % clioPlaylist.length);
        }
    }, [clioPlaylist]);

    const handleClioPrev = useCallback(() => {
        if (clioPlaylist.length > 0) {
            setCurrentClioTrackIndex(p => (p - 1 + clioPlaylist.length) % clioPlaylist.length);
        }
    }, [clioPlaylist]);
    
    useEffect(() => {
        if (clioAudioRef.current) {
             setIsClioPlaying(true);
             clioAudioRef.current.play().catch(e => {
                 console.log("Audio couldn't auto-play, requires user interaction.");
                 setIsClioPlaying(false);
             });
        }
    }, [currentClioTrackIndex]);

    const handleClioTimeUpdate = () => {
        if (clioAudioRef.current && !isClioSeeking) {
            setClioProgress(clioAudioRef.current.currentTime);
        }
    };

    const handleClioSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (clioAudioRef.current) {
            clioAudioRef.current.currentTime = Number(e.target.value);
            setClioProgress(Number(e.target.value));
        }
    };

    const handleClioSeekMouseDown = () => setIsClioSeeking(true);
    const handleClioSeekMouseUp = () => setIsClioSeeking(false);
    
    const handleClioSelectTrack = (index: number) => {
        setCurrentClioTrackIndex(index);
    };

    // --- RENDER LOGIC ---
    if (!loggedInUser || !userState) {
        return <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} onGuestLogin={handleGuestLogin} loginWallpaper={randomLoginWallpaper} />;
    }

    const { members, artists, tasks, schedule, financialProjects, totalBudget, feedPosts, eventInfo, mediaItems, inventoryItems, gadgets, notebooks, photoAlbums, collectiveDocuments, meetingMinutes, votingTopics, teamStatuses } = userState;
    const recentlyUpdatedTaskId = null; // This feature can be re-implemented if needed

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
        { name: 'finances', title: 'Finanças', icon: <DockAppIcon bgColorClasses="bg-emerald-600"><WalletIcon /></DockAppIcon>, component: <FinanceApp financialProjects={financialProjects} handleSaveFinancialProject={handleSaveFinancialProject} handleDeleteFinancialProject={handleDeleteFinancialProject} handleSaveTransaction={handleSaveTransaction} handleDeleteTransaction={handleDeleteTransaction} /> },
        { name: 'notebooks', title: 'Cadernos', icon: <DockAppIcon bgColorClasses="bg-amber-600"><BookMarkedIcon /></DockAppIcon>, component: <NotebooksApp notebooks={notebooks} handleSaveNotebook={handleSaveNotebook} handleDeleteNotebook={handleDeleteNotebook} handleSaveNote={handleSaveNote} handleDeleteNote={handleDeleteNote} /> },
        { name: 'clio_player', title: 'Player Clio', icon: <DockAppIcon bgColorClasses="bg-rose-600"><MusicIcon /></DockAppIcon>, component: <ClioPlayerApp playlist={clioPlaylist} currentTrackIndex={currentClioTrackIndex} isPlaying={isClioPlaying} onPlayPause={handleClioPlayPause} onNext={handleClioNext} onPrev={handleClioPrev} progress={clioProgress} duration={clioAudioRef.current?.duration || 0} onSeek={handleClioSeek} onSeekMouseDown={handleClioSeekMouseDown} onSeekMouseUp={handleClioSeekMouseUp} onSelectTrack={handleClioSelectTrack} /> },
        { name: 'collab_clio', title: 'Collab Clio', icon: <DockAppIcon bgColorClasses="bg-cyan-700"><BriefcaseIcon /></DockAppIcon>, component: <CollabClioApp onOpenModal={openModal} currentUser={loggedInUser} {...userState} handleDeleteCollectiveDocument={handleDeleteCollectiveDocument} handleDeleteMeetingMinute={handleDeleteMeetingMinute} handleCastVote={handleCastVote} handleCloseVoting={handleCloseVoting} /> },
        { name: 'browser', title: 'Navegador', icon: <DockAppIcon bgColorClasses="bg-cyan-600"><GlobeIcon /></DockAppIcon>, component: <BrowserApp /> },
        {
            name: 'whatsapp',
            title: 'WhatsApp',
            icon: <DockAppIcon bgColorClasses="bg-green-500"><WhatsappIcon /></DockAppIcon>,
            component: (
                <div className="w-full h-full bg-slate-900 flex flex-col">
                    <div className="p-2 bg-yellow-900/50 text-yellow-300 text-xs text-center flex-shrink-0">
                        Nota: O WhatsApp pode não carregar corretamente devido a restrições de segurança.
                    </div>
                    <iframe
                        src="https://web.whatsapp.com/"
                        title="WhatsApp Web"
                        className="w-full h-full border-none flex-grow"
                        sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
                    />
                </div>
            )
        },
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
    };

    return (
        <AppContext.Provider value={contextValue}>
            <div 
                className="h-[100dvh] w-screen font-sans bg-cover bg-center overflow-hidden"
                style={{ backgroundImage: `url(${wallpaperImage || DEFAULT_WALLPAPER})` }}
            >
                 <div className="absolute inset-0 bg-slate-900/30"></div>
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
                                <MobileTopBar user={loggedInUser} onToggleControlCenter={() => setIsMobileControlCenterOpen(true)} onOpenProfile={() => setActiveMobileApp('profile')} />
                                <main 
                                    className="flex-1 overflow-y-auto p-4 space-y-4 pb-32"
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    {/* Mobile Home Screen Widgets */}
                                    <div className="bg-black/20 backdrop-blur-lg p-4 rounded-xl border border-white/10">
                                       <CountdownGadget />
                                    </div>
                                    <div className="bg-black/20 backdrop-blur-lg p-4 rounded-xl border border-white/10">
                                       <TeamStatusGadget />
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
                            playlist={clioPlaylist}
                            currentTrackIndex={currentClioTrackIndex}
                            isPlaying={isClioPlaying}
                            onPlayPause={handleClioPlayPause}
                        />
                    </div>
                ) : (
                    <>
                        <audio ref={audioRef} src={playlist[currentTrackIndex]?.url} />
                        <audio 
                            ref={clioAudioRef} 
                            src={clioPlaylist?.[currentClioTrackIndex]?.url} 
                            onTimeUpdate={handleClioTimeUpdate}
                            onEnded={handleClioNext}
                            onLoadedMetadata={() => clioAudioRef.current && setClioProgress(clioAudioRef.current.currentTime)}
                         />
                        <input type="file" ref={musicFileInputRef} onChange={handleMusicFileChange} accept=".mp3" className="hidden" />

                        <ClioOSDesktop 
                            onAppClick={handleAppClick} 
                            user={loggedInUser} 
                            onLogout={handleLogout}
                            appStates={appStates}
                            isMusicPlayerOpen={isMusicPlayerOpen}
                            onToggleMusicPlayer={() => setIsMusicPlayerOpen(!isMusicPlayerOpen)}
                            eventInfo={eventInfo}
                            schedule={schedule}
                            clioPlaylist={clioPlaylist}
                            currentClioTrackIndex={currentClioTrackIndex}
                            isClioPlaying={isClioPlaying}
                            handleClioPlayPause={handleClioPlayPause}
                        />

                        {gadgets.map((gadget: Gadget) => (
                            <GadgetWrapper key={gadget.id} gadget={gadget} onClose={handleRemoveGadget} onPositionChange={handleUpdateGadgetPosition} >
                                {gadget.type === 'analog_clock' && <AnalogClock />}
                                {gadget.type === 'countdown' && <CountdownGadget />}
                                {gadget.type === 'quick_note' && <QuickNoteGadget content={gadget.data?.content || ''} onContentChange={(content) => handleUpdateGadgetData(gadget.id, { content })} />}
                                {gadget.type === 'financial_summary' && <FinancialSummaryGadget />}
                                {gadget.type === 'team_status' && <TeamStatusGadget />}
                                {gadget.type === 'radio_clio' && (
                                    <RadioClioGadget
                                        playlist={clioPlaylist}
                                        currentTrackIndex={currentClioTrackIndex}
                                        isPlaying={isClioPlaying}
                                        onPlayPause={handleClioPlayPause}
                                    />
                                )}
                            </GadgetWrapper>
                        ))}

                        <MusicPlayerWidget isOpen={isMusicPlayerOpen} onClose={() => setIsMusicPlayerOpen(false)} playlist={playlist} currentTrackIndex={currentTrackIndex} isPlaying={isPlaying} volume={volume} progress={progress} duration={duration} onPlayPause={handlePlayPause} onNext={handleNextTrack} onPrev={handlePrevTrack} onSelectTrack={handleSelectTrack} onSeek={handleSeek} onVolumeChange={handleVolumeChange} onLoadFile={triggerMusicFileInput} />
                        
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
