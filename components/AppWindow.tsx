import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from 'react';

interface AppWindowProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  children: React.ReactNode;
}

const AppWindow: React.FC<AppWindowProps> = ({ title, isOpen, onClose, onMinimize, children }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [hasBeenPositioned, setHasBeenPositioned] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const windowRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (isOpen && !hasBeenPositioned && windowRef.current) {
            const { innerWidth, innerHeight } = window;
            const { offsetWidth, offsetHeight } = windowRef.current;
            
            if (offsetWidth > 0 && offsetHeight > 0) {
                 setPosition({
                    x: Math.max(0, (innerWidth - offsetWidth) / 2),
                    y: Math.max(40, (innerHeight - offsetHeight) / 2),
                });
                setHasBeenPositioned(true);
            }
        }
    }, [isOpen, hasBeenPositioned]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
    }, [position.x, position.y]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        e.preventDefault();
        setPosition({
            x: e.clientX - dragOffset.current.x,
            y: e.clientY - dragOffset.current.y,
        });
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);
    
    useEffect(() => {
        if (!isOpen) {
            setHasBeenPositioned(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            ref={windowRef}
            className={`fixed top-0 left-0 w-[95vw] h-[90vh] max-w-7xl bg-slate-800 rounded-lg shadow-2xl flex flex-col border border-white/10 z-20 transition-opacity duration-200 ${hasBeenPositioned ? 'opacity-100' : 'opacity-0'}`}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        >
            <div
                className={`h-9 bg-slate-700/80 backdrop-blur-sm flex-shrink-0 flex items-center justify-between px-3 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center gap-2">
                    <button onClick={onClose} className="w-3.5 h-3.5 bg-red-500 rounded-full hover:bg-red-600 focus:outline-none"></button>
                    <button onClick={onMinimize} className="w-3.5 h-3.5 bg-yellow-500 rounded-full hover:bg-yellow-600 focus:outline-none"></button>
                    <div className="w-3.5 h-3.5 bg-green-500 rounded-full opacity-50 cursor-not-allowed"></div>
                </div>
                <span className="text-sm text-white/80 font-medium select-none">{title}</span>
                <div className="w-16"></div>
            </div>

            <div className="flex-grow bg-slate-900 relative overflow-y-auto">
                 {children}
            </div>
        </div>
    );
};

export default AppWindow;