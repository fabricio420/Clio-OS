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
        // Do not start dragging if clicking an interactive element or an editable area
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

        // Bounding box logic
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
             // We need to read the final position from the state for the callback
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
            className={`fixed top-0 left-0 bg-slate-800/60 backdrop-blur-lg rounded-xl shadow-2xl border border-white/10 text-white transition-all duration-300 ease-out z-10 group ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            onMouseDown={handleMouseDown}
        >
            <button
                onClick={() => onClose(gadget.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
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