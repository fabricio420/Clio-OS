import React, { useRef, useCallback, useEffect } from 'react';

const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
    const timeoutRef = useRef<number | null>(null);
    return (...args: any[]) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
            callback(...args);
        }, delay);
    };
};

interface QuickNoteGadgetProps {
    content: string;
    onContentChange: (newContent: string) => void;
}

const QuickNoteGadget: React.FC<QuickNoteGadgetProps> = ({ content, onContentChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    
    const debouncedSave = useCallback(useDebounce((newContent: string) => {
        onContentChange(newContent);
    }, 1000), [onContentChange]);

    const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
        debouncedSave(e.currentTarget.innerHTML);
    };
    
    useEffect(() => {
        // Sync content from state if it changes externally
        if (editorRef.current && editorRef.current.innerHTML !== content) {
            editorRef.current.innerHTML = content;
        }
    }, [content]);

    return (
        <div 
            ref={editorRef}
            onInput={handleContentChange}
            contentEditable
            suppressContentEditableWarning={true}
            className="w-64 h-48 min-h-[12rem] bg-yellow-200/10 text-slate-200 p-3 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 quick-note-editor overflow-y-auto"
            style={{ 
                fontFamily: "'Inter', sans-serif",
                lineHeight: '1.5',
            }}
        >
        </div>
    );
};

export default QuickNoteGadget;