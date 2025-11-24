
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ClioNotification, NotificationType, NotificationAction } from '../types';

interface NotificationContextType {
    notifications: ClioNotification[];
    history: ClioNotification[];
    addNotification: (title: string, type?: NotificationType, message?: string, action?: NotificationAction, duration?: number) => void;
    removeNotification: (id: string) => void;
    markAllAsRead: () => void;
    clearHistory: () => void;
    isHistoryOpen: boolean;
    toggleHistory: () => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<ClioNotification[]>([]);
    const [history, setHistory] = useState<ClioNotification[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const addNotification = useCallback((
        title: string, 
        type: NotificationType = 'info', 
        message?: string, 
        action?: NotificationAction, 
        duration = 5000
    ) => {
        const newNote: ClioNotification = {
            id: crypto.randomUUID(),
            title,
            message,
            type,
            timestamp: Date.now(),
            duration,
            action,
            read: false
        };

        // Add to active stack
        setNotifications(prev => [newNote, ...prev]);
        
        // Add to history (limit to last 50)
        setHistory(prev => {
            const newHistory = [newNote, ...prev];
            return newHistory.slice(0, 50);
        });

        // Haptic feedback on mobile if supported
        if (typeof navigator !== 'undefined' && navigator.vibrate && type === 'success') {
            navigator.vibrate(50);
        }
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const markAllAsRead = useCallback(() => {
        setHistory(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
    }, []);

    const toggleHistory = useCallback(() => {
        setIsHistoryOpen(prev => !prev);
        if (!isHistoryOpen) {
            markAllAsRead(); // Mark read when opening
        }
    }, [isHistoryOpen, markAllAsRead]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            history,
            addNotification,
            removeNotification,
            markAllAsRead,
            clearHistory,
            isHistoryOpen,
            toggleHistory
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
