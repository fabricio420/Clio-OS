import React, { useState, useEffect, useRef, useCallback } from 'react';
// FIX: Added FeedPost to the type imports.
import type { Member, Task, ScheduleItem, Artist, ModalView, EventInfoData, MediaItem, InventoryItem, Track, Gadget, PhotoAlbum, Photo, CollectiveDocument, MeetingMinute, VotingTopic, TaskStatus, FinancialProject, Transaction, Notebook, Note, GadgetType, GadgetData, FeedPost } from './types';
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
import GadgetWrapper from './components/gadgets/GadgetWrapper';
import AnalogClock from './components/gadgets/AnalogClock';
import CountdownGadget from './components/gadgets/CountdownGadget';
import QuickNoteGadget from './components/gadgets/QuickNoteGadget';
import MediaUploaderGadget from './components/gadgets/MediaUploaderGadget';
import FinancialSummaryGadget from './components/gadgets/FinancialSummaryGadget';
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
// FIX: Import AppContext to provide context to children components.
import { AppContext } from './contexts/AppContext';

// --- MOCK DATA FOR NEW USERS ---
const defaultDueDate = new Date();
defaultDueDate.setDate(defaultDueDate.getDate() + 10);
const dueDateString = defaultDueDate.toISOString().split('T')[0];
const defaultEventDate = new Date();
defaultEventDate.setMonth(defaultEventDate.getMonth() + 1);

const MOCK_EVENT_INFO: EventInfoData = {
    eventName: 'Sarau das Vozes Urbanas',
    collectiveName: 'Coletivo Poiesis', isCollab: false, collabDescription: '',
    description: 'Uma noite de celebração da palavra...',
    venueName: 'Centro Cultural da Juventude', venueAddress: 'Av. Dep. Emílio Carlos, 3641',
    eventDate: defaultEventDate.toISOString().slice(0, 16),
    artistGoal: 15, artTypes: ['Poesia', 'Música', 'Performance'], hasAwards: false, awardsDescription: '',
};

const MOCK_INITIAL_DATA = {
    // FIX: Added 'members' to the mock data structure to allow its state to be managed correctly.
    members: [] as Member[],
    tasks: [{ id: 't1', title: 'Definir local e data', description: 'Pesquisar e reservar o local.', status: TaskStatusEnum.ToDo, assigneeId: '1', dueDate: dueDateString }],
    schedule: [{ id: 's1', time: '18:00', title: 'Abertura e Recepção', description: 'Início do evento.', responsible: 'Equipe' }],
    artists: [{ id: 'a1', name: 'Juliana Rima', performanceType: 'Poesia', contact: 'juliana.rima@email.com', notes: 'Confirmada.' }],
    eventInfo: MOCK_EVENT_INFO,
    mediaItems: [], inventoryItems: [], feedPosts: [],
    financialProjects: [{ id: 'fp1', name: 'Orçamento Principal', description: 'Controle financeiro do evento.', transactions: [] }],
    notebooks: [{ id: 'nb1', name: 'Ideias', notes: [{ id: 'n1', title: 'Brainstorm', content: '<p>Ideias iniciais...</p>', updatedAt: new Date().toISOString() }] }],
    photoAlbums: [], collectiveDocuments: [], meetingMinutes: [], votingTopics: [],
    gadgets: [], totalBudget: 2000,
};

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
    browser: 'closed', collab_clio: 'closed', profile: 'closed',
};

const DEFAULT_WALLPAPER = 'https://i.postimg.cc/bwZhCxbX/clios-canvas.png';

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [users, setUsers] = useState<Member[]>(() => JSON.parse(localStorage.getItem('clio-os-users') || '[]'));
    const [loggedInUser, setLoggedInUser] = useState<Member | null>(null);

    // This state will hold all data for the currently logged-in user
    const [userState, setUserState] = useState<any>(null);

    const [wallpaperImage, setWallpaperImage] = useState<string | null>(null);
    const [loginWallpaper, setLoginWallpaper] = useState<string | null>(() => localStorage.getItem('clio-os-login-wallpaper'));
    const [appStates, setAppStates] = useState<AppStates>(initialAppStates);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalView, setModalView] = useState<ModalView | null>(null);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Music Player State
    const [isMusicPlayerOpen, setIsMusicPlayerOpen] = useState(false);
    const [playlist, setPlaylist] = useState<Track[]>([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.75);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const musicFileInputRef = useRef<HTMLInputElement>(null);
    
    // --- USER & DATA MANAGEMENT ---
    useEffect(() => {
        // Persist users list whenever it changes
        localStorage.setItem('clio-os-users', JSON.stringify(users));
    }, [users]);

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

    const handleLogout = () => {
        setLoggedInUser(null);
        setUserState(null);
        setAppStates(initialAppStates);
    };

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
    const handleSetLoginWallpaper = (imageUrl: string) => {
        localStorage.setItem('clio-os-login-wallpaper', imageUrl);
        setLoginWallpaper(imageUrl);
    };

    const handleResetLoginWallpaper = () => {
        localStorage.removeItem('clio-os-login-wallpaper');
        setLoginWallpaper(null);
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

    // --- Music Player Handlers --- (unchanged, can be collapsed for brevity)
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
    }, [playlist, currentTrackIndex]);
    useEffect(() => { if (audioRef.current) { isPlaying ? audioRef.current.play().catch(console.error) : audioRef.current.pause(); } }, [isPlaying, currentTrackIndex]);
    useEffect(() => { if (audioRef.current) { audioRef.current.volume = volume; } }, [volume]);
    const handlePlayPause = () => { if (playlist.length > 0) setIsPlaying(!isPlaying); };
    const handleNextTrack = () => { setCurrentTrackIndex(p => (p + 1) % playlist.length); setIsPlaying(true); };
    const handlePrevTrack = () => { setCurrentTrackIndex(p => (p - 1 + playlist.length) % playlist.length); setIsPlaying(true); };
    const handleSelectTrack = (index: number) => { setCurrentTrackIndex(index); setIsPlaying(true); };
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value); };
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => setVolume(Number(e.target.value));
    const handleMusicFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const track: Track = { name: file.name.replace('.mp3', ''), artist: 'Desconhecido', url: URL.createObjectURL(file) };
            setPlaylist(p => [...p, track]);
            if (!isPlaying) { setCurrentTrackIndex(playlist.length); setIsPlaying(true); }
        }
    };
    const triggerMusicFileInput = () => musicFileInputRef.current?.click();

    // --- RENDER LOGIC ---
    if (!loggedInUser || !userState) {
        return <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} loginWallpaper={loginWallpaper} />;
    }

    const { members, artists, tasks, schedule, financialProjects, totalBudget, feedPosts, eventInfo, mediaItems, inventoryItems, gadgets, notebooks, photoAlbums, collectiveDocuments, meetingMinutes, votingTopics } = userState;
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
            case 'meeting_minute': return <MeetingMinuteForm onSubmit={handleAndClose(handleSaveMeetingMinute)} minute={editingItem} members={members} />;
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
    
    const appWindows: { name: AppName, title: string, component: React.ReactNode }[] = [
        { name: 'dashboard', title: 'Dashboard', component: <Dashboard onOpenModal={openModal} {...userState} /> },
        { name: 'info', title: 'Informações do Evento', component: <EventInfo onOpenModal={openModal} {...userState} /> },
        { name: 'tasks', title: 'Quadro de Tarefas', component: <KanbanBoard onOpenModal={openModal} tasks={tasks} members={members} recentlyUpdatedTaskId={recentlyUpdatedTaskId} handleDeleteTask={handleDeleteTask} handleUpdateTaskStatus={handleUpdateTaskStatus} /> },
        { name: 'schedule', title: 'Cronograma', component: <Schedule onOpenModal={openModal} schedule={schedule} handleDeleteScheduleItem={handleDeleteScheduleItem} /> },
        { name: 'artists', title: 'Artistas', component: <Artists onOpenModal={openModal} artists={artists} handleDeleteArtist={handleDeleteArtist} /> },
        { name: 'team_hub', title: 'Hub da Equipe', component: <TeamHub onOpenModal={openModal} currentUser={loggedInUser} members={members} feedPosts={feedPosts} handleAddPost={handleAddPost} /> },
        { name: 'media', title: 'Hub de Mídia', component: <MediaHub onOpenModal={() => openModal('media')} mediaItems={mediaItems} artists={artists} handleDeleteMediaItem={handleDeleteMediaItem} /> },
        { name: 'inventory', title: 'Inventário', component: <Inventory onOpenModal={openModal} inventoryItems={inventoryItems} members={members} handleDeleteInventoryItem={handleDeleteInventoryItem} /> },
        { name: 'reports', title: 'Relatórios', component: <Reports {...userState} /> },
        { name: 'documentation', title: 'Documentação', component: <Documentation /> },
        { name: 'profile', title: 'Meu Perfil', component: <ProfileApp currentUser={loggedInUser} onSaveProfile={handleSaveProfile} onChangePassword={handleChangePassword} /> },
        { name: 'personalize', title: 'Personalizar', component: <PersonalizeApp currentWallpaper={wallpaperImage || DEFAULT_WALLPAPER} onSetWallpaper={handleSetWallpaper} onResetWallpaper={handleResetWallpaper} handleAddGadget={handleAddGadget} loginWallpaper={loginWallpaper} onSetLoginWallpaper={handleSetLoginWallpaper} onResetLoginWallpaper={handleResetLoginWallpaper} /> },
        { name: 'finances', title: 'Finanças', component: <FinanceApp financialProjects={financialProjects} handleSaveFinancialProject={handleSaveFinancialProject} handleDeleteFinancialProject={handleDeleteFinancialProject} handleSaveTransaction={handleSaveTransaction} handleDeleteTransaction={handleDeleteTransaction} /> },
        { name: 'notebooks', title: 'Cadernos', component: <NotebooksApp notebooks={notebooks} handleSaveNotebook={handleSaveNotebook} handleDeleteNotebook={handleDeleteNotebook} handleSaveNote={handleSaveNote} handleDeleteNote={handleDeleteNote} /> },
        { name: 'gallery', title: 'Galeria', component: <PhotoGalleryApp onOpenModal={openModal} photoAlbums={photoAlbums} handleDeletePhoto={handleDeletePhoto} /> },
        { name: 'browser', title: 'Navegador', component: <BrowserApp /> },
        { name: 'collab_clio', title: 'Collab Clio', component: <CollabClioApp onOpenModal={openModal} currentUser={loggedInUser} {...userState} handleDeleteCollectiveDocument={handleDeleteCollectiveDocument} handleDeleteMeetingMinute={handleDeleteMeetingMinute} handleCastVote={handleCastVote} handleCloseVoting={handleCloseVoting} /> },
    ];

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
    };

    return (
        <AppContext.Provider value={contextValue}>
            <div 
                className="h-screen w-screen font-sans bg-cover bg-center"
                style={{ backgroundImage: `url(${wallpaperImage || DEFAULT_WALLPAPER})` }}
            >
                <audio ref={audioRef} src={playlist[currentTrackIndex]?.url} />
                <input type="file" ref={musicFileInputRef} onChange={handleMusicFileChange} accept=".mp3" className="hidden" />

                <ClioOSDesktop 
                    onAppClick={handleAppClick} 
                    user={loggedInUser} 
                    onLogout={handleLogout}
                    appStates={appStates}
                    isMusicPlayerOpen={isMusicPlayerOpen}
                    onToggleMusicPlayer={() => setIsMusicPlayerOpen(!isMusicPlayerOpen)}
                />

                {gadgets.map((gadget: Gadget) => (
                    <GadgetWrapper key={gadget.id} gadget={gadget} onClose={handleRemoveGadget} onPositionChange={handleUpdateGadgetPosition} >
                        {gadget.type === 'analog_clock' && <AnalogClock />}
                        {gadget.type === 'countdown' && <CountdownGadget />}
                        {gadget.type === 'quick_note' && <QuickNoteGadget content={gadget.data?.content || ''} onContentChange={(content) => handleUpdateGadgetData(gadget.id, { content })} />}
                        {gadget.type === 'media_uploader' && <MediaUploaderGadget />}
                        {gadget.type === 'financial_summary' && <FinancialSummaryGadget />}
                    </GadgetWrapper>
                ))}

                <MusicPlayerWidget isOpen={isMusicPlayerOpen} onClose={() => setIsMusicPlayerOpen(false)} playlist={playlist} currentTrackIndex={currentTrackIndex} isPlaying={isPlaying} volume={volume} progress={progress} duration={duration} onPlayPause={handlePlayPause} onNext={handleNextTrack} onPrev={handlePrevTrack} onSelectTrack={handleSelectTrack} onSeek={handleSeek} onVolumeChange={handleVolumeChange} onLoadFile={triggerMusicFileInput} />

                {appWindows.map(({ name, title, component }) => (
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

                <Modal isOpen={modalOpen} onClose={closeModal} title={getModalTitle()}>{renderModalContent()}</Modal>
            </div>
        </AppContext.Provider>
    );
};

export default App;
