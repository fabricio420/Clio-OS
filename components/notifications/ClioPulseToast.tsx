
import React, { useEffect, useState } from 'react';
import type { ClioNotification } from '../../types';
import { CheckSquareIcon, InfoIcon, XIcon, SparklesIcon, ShieldCheckIcon } from '../icons';

interface ClioPulseToastProps {
    notification: ClioNotification;
    onClose: (id: string) => void;
    index: number;
}

const ClioPulseToast: React.FC<ClioPulseToastProps> = ({ notification, onClose, index }) => {
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(100);

    // Styles based on type
    const styles = {
        success: {
            border: 'border-lime-500/50',
            bg: 'bg-slate-900/80',
            shadow: 'shadow-[0_0_20px_rgba(132,204,22,0.15)]',
            icon: <SparklesIcon className="w-5 h-5 text-lime-400" />,
            bar: 'bg-lime-500'
        },
        error: {
            border: 'border-red-500/50',
            bg: 'bg-slate-900/80',
            shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
            icon: <ShieldCheckIcon className="w-5 h-5 text-red-400" />,
            bar: 'bg-red-500'
        },
        warning: {
            border: 'border-yellow-500/50',
            bg: 'bg-slate-900/80',
            shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.15)]',
            icon: <InfoIcon className="w-5 h-5 text-yellow-400" />,
            bar: 'bg-yellow-500'
        },
        info: {
            border: 'border-sky-500/50',
            bg: 'bg-slate-900/80',
            shadow: 'shadow-[0_0_20px_rgba(14,165,233,0.15)]',
            icon: <InfoIcon className="w-5 h-5 text-sky-400" />,
            bar: 'bg-sky-500'
        }
    };

    const style = styles[notification.type];

    useEffect(() => {
        if (!notification.duration || isPaused) return;

        const interval = 100; // update every 100ms
        const step = 100 / (notification.duration / interval);

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev - step;
                if (next <= 0) {
                    clearInterval(timer);
                    onClose(notification.id);
                    return 0;
                }
                return next;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [notification.id, notification.duration, onClose, isPaused]);

    // Stacking logic (visual offset)
    const stackStyle = {
        transform: `translateY(${index * 10}px) scale(${1 - index * 0.05})`,
        zIndex: 50 - index,
        opacity: index > 2 ? 0 : 1 - index * 0.2,
        pointerEvents: index > 0 ? 'none' : 'auto'
    } as React.CSSProperties;

    return (
        <div
            className={`absolute bottom-0 right-0 w-full max-w-sm mb-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${index === 0 ? 'translate-y-0 opacity-100' : ''}`}
            style={stackStyle}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className={`relative backdrop-blur-xl rounded-2xl border p-4 overflow-hidden ${style.bg} ${style.border} ${style.shadow}`}>
                <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                        {style.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm">{notification.title}</h4>
                        {notification.message && (
                            <p className="text-slate-400 text-xs mt-1 leading-relaxed">{notification.message}</p>
                        )}
                        {notification.action && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    notification.action?.onClick();
                                    onClose(notification.id);
                                }}
                                className="mt-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors border border-white/10"
                            >
                                {notification.action.label}
                            </button>
                        )}
                    </div>
                    <button onClick={() => onClose(notification.id)} className="text-slate-500 hover:text-white transition-colors">
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Progress Bar */}
                {notification.duration && (
                    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-white/10">
                        <div 
                            className={`h-full ${style.bar} transition-all duration-100 ease-linear`} 
                            style={{ width: `${progress}%` }} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClioPulseToast;
