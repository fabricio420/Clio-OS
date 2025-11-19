import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Gadget } from '../../types';
import { XIcon } from '../icons';

interface GadgetWrapperProps {
    gadget: Gadget;
    children: React.ReactNode;
    onClose: (id: string) => void;
    onPositionChange: (id: string, position: { x: number; y: number }) => void;
}

const GadgetWrapper: React.FC<GadgetWrapperProps> = ({ gadget, children, onClose, onPositionChange }) => {
    const [position, setPosition] = useState(gadget.position);
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        const ignoredTags = ['INPUT', 'TEXTAREA', 'SELECT'];
        if (ignoredTags.includes(target.tagName) || target.closest('button') || target.isContentEditable) {
            return;
        }
        e.preventDefault();
        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
    }, [position.x, position.y]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!wrapperRef.current) return;
        
        const newX = e.clientX - dragOffset.current.x;
        const newY = e.clientY - dragOffset.current.y;

        const parentRect = wrapperRef.current.parentElement?.getBoundingClientRect();
        if (parentRect) {
            const elRect = wrapperRef.current.getBoundingClientRect();
            const boundedX = Math.max(0, Math.min(newX, parentRect.width - elRect.width));
            const boundedY = Math.max(0, Math.min(newY, parentRect.height - elRect.height));
            setPosition({ x: boundedX, y: boundedY });
        } else {
             setPosition({ x: newX, y: newY });
        }
    }, []);

    const handleMouseUp = useCallback(() => {
        if (isDragging) {
            setPosition(currentPosition => {
                onPositionChange(gadget.id, currentPosition);
                return currentPosition;
            });
            setIsDragging(false);
        }
    }, [gadget.id, onPositionChange, isDragging]);

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
        setPosition(gadget.position);
    }, [gadget.position]);

    return (
        <div
            ref={wrapperRef}
            className={`fixed top-0 left-0 bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 text-white transition-all duration-200 ease-out z-10 group ring-1 ring-black/20 ${isDragging ? 'cursor-grabbing scale-[1.02]' : 'cursor-grab'}`}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            onMouseDown={handleMouseDown}
        >
            <button
                onClick={() => onClose(gadget.id)}
                className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:bg-red-600 z-20 hover:scale-110"
                aria-label="Fechar gadget"
            >
                <XIcon className="w-4 h-4" />
            </button>
            <div className="p-4">
                {children}
            </div>
        </div>
    );
};

export default GadgetWrapper;