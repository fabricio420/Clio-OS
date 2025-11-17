
import React, { createContext, useContext } from 'react';
import type {
    Artist,
    CollectiveDocument,
    EventInfoData,
    FinancialProject,
    InventoryItem,
    MediaItem,
    Member,
    Note,
    Notebook,
    PhotoAlbum,
    ScheduleItem,
    Task,
    TeamStatus
} from '../types';

export interface AppContextType {
    notebooks: Notebook[];
    handleSaveNotebook: (name: string, editingId?: string) => void;
    handleDeleteNotebook: (notebookId: string) => void;
    handleSaveNote: (notebookId: string, noteData: Pick<Note, 'title' | 'content'>, editingId?: string) => void;
    handleDeleteNote: (notebookId: string, noteId: string) => void;
    eventInfo: EventInfoData;
    artists: Artist[];
    handleSaveMediaItem: (mediaData: Omit<MediaItem, 'id'>) => void;
    financialProjects: FinancialProject[];
    photoAlbums: PhotoAlbum[];
    handleDeletePhoto: (albumId: string, photoId: string) => void;
    members: Member[];
    currentUser: Member | null;
    teamStatuses: TeamStatus[];
    handleUpdateTeamStatus: (statusText: string) => void;
    tasks: Task[];
    schedule: ScheduleItem[];
    inventoryItems: InventoryItem[];
    collectiveDocuments: CollectiveDocument[];
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContext.Provider');
    }
    return context;
};
