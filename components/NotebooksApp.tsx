import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import type { Notebook, Note } from '../types';
import { PlusIcon, BoldIcon, ItalicIcon, UnderlineIcon, XIcon, AlignJustifyIcon } from './icons';
import Modal from './Modal';
import { NotebookForm } from './forms/NotebookForm';

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

const EditorToolbar: React.FC<{ editorRef: React.RefObject<HTMLDivElement> }> = ({ editorRef }) => {
    const applyFormat = (command: string, value?: string) => {
        if (editorRef.current) {
            editorRef.current.focus();
            document.execCommand(command, false, value);
        }
    };

    const ToolButton = ({ icon, onClick, title }: { icon: React.ReactNode, onClick: () => void, title: string }) => (
        <button
            type="button"
            onMouseDown={(e) => {
                e.preventDefault();
                onClick();
            }}
            title={title}
            className="p-2 text-slate-300 hover:bg-slate-600 hover:text-white rounded-md"
        >
            {icon}
        </button>
    );

    return (
        <div className="flex items-center space-x-1 p-2 bg-slate-800 border-b border-slate-700">
            <ToolButton icon={<BoldIcon className="w-5 h-5" />} onClick={() => applyFormat('bold')} title="Negrito" />
            <ToolButton icon={<ItalicIcon className="w-5 h-5" />} onClick={() => applyFormat('italic')} title="Itálico" />
            <ToolButton icon={<UnderlineIcon className="w-5 h-5" />} onClick={() => applyFormat('underline')} title="Sublinhado" />
            <div className="h-5 w-px bg-slate-700 mx-2"></div>
            <ToolButton icon={<AlignJustifyIcon className="w-5 h-5" />} onClick={() => applyFormat('justifyFull')} title="Justificar" />
        </div>
    );
};

interface NotebooksAppProps {
    notebooks: Notebook[];
    handleSaveNotebook: (name: string, editingId?: string) => void;
    handleDeleteNotebook: (notebookId: string) => void;
    handleSaveNote: (notebookId: string, noteData: Pick<Note, 'title' | 'content'>, editingId?: string) => void;
    handleDeleteNote: (notebookId: string, noteId: string) => void;
}


const NotebooksApp: React.FC<NotebooksAppProps> = ({ notebooks, handleSaveNotebook, handleDeleteNotebook, handleSaveNote, handleDeleteNote }) => {
    const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(null);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingNotebook, setEditingNotebook] = useState<Pick<Notebook, 'id' | 'name'> | null>(null);
    
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!selectedNotebookId && notebooks.length > 0) {
            setSelectedNotebookId(notebooks[0].id);
        }
    }, [notebooks, selectedNotebookId]);

    const selectedNotebook = useMemo(() => notebooks.find(nb => nb.id === selectedNotebookId), [notebooks, selectedNotebookId]);
    
    useEffect(() => {
        if (selectedNotebook && selectedNotebook.notes.length > 0 && (!selectedNoteId || !selectedNotebook.notes.find(n => n.id === selectedNoteId))) {
            setSelectedNoteId(selectedNotebook.notes[0].id);
        } else if (selectedNotebook && selectedNotebook.notes.length === 0) {
            setSelectedNoteId(null);
        }
    }, [selectedNotebook, selectedNoteId]);

    const selectedNote = useMemo(() => selectedNotebook?.notes.find(n => n.id === selectedNoteId), [selectedNotebook, selectedNoteId]);
    
    const [noteTitle, setNoteTitle] = useState('');
    
    useEffect(() => {
        if (selectedNote) {
            setNoteTitle(selectedNote.title);
            if (editorRef.current && editorRef.current.innerHTML !== selectedNote.content) {
                editorRef.current.innerHTML = selectedNote.content;
            }
        } else {
             setNoteTitle('');
             if(editorRef.current) {
                editorRef.current.innerHTML = '';
             }
        }
    }, [selectedNote]);
    
    const debouncedSave = useCallback(useDebounce((notebookId: string, noteId: string, title: string, content: string) => {
        handleSaveNote(notebookId, { title, content }, noteId);
    }, 1500), [handleSaveNote]);
    
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setNoteTitle(newTitle);
        if(selectedNotebookId && selectedNoteId && editorRef.current) {
            debouncedSave(selectedNotebookId, selectedNoteId, newTitle, editorRef.current.innerHTML);
        }
    };
    
    const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
        const newContent = e.currentTarget.innerHTML;
        if(selectedNotebookId && selectedNoteId) {
            debouncedSave(selectedNotebookId, selectedNoteId, noteTitle, newContent);
        }
    };

    const handleAddNewNote = () => {
        if (!selectedNotebookId) return;
        const newNote = { title: 'Nova Nota', content: '<p><br></p>' };
        handleSaveNote(selectedNotebookId, newNote);
    };

    const handleDeleteSelectedNote = () => {
        if (selectedNotebookId && selectedNoteId) {
            handleDeleteNote(selectedNotebookId, selectedNoteId);
        }
    };

    const openNotebookModal = (notebook: Pick<Notebook, 'id' | 'name'> | null = null) => {
        setEditingNotebook(notebook);
        setModalOpen(true);
    };

    const handleNotebookSubmit = (name: string, id?: string) => {
        handleSaveNotebook(name, id);
        setModalOpen(false);
    };
    
    const handleNotebookDelete = (e: React.MouseEvent, notebookId: string) => {
        e.stopPropagation();
        if(window.confirm('Tem certeza que deseja excluir este caderno e todas as suas notas?')) {
            handleDeleteNotebook(notebookId);
            if(selectedNotebookId === notebookId) {
                setSelectedNotebookId(null);
            }
        }
    };

    return (
        <div className="flex h-full w-full bg-slate-900 text-white">
            {/* Column 1: Notebooks */}
            <div className="w-1/4 max-w-xs bg-slate-800 border-r border-slate-700 flex flex-col">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Cadernos</h2>
                    <button onClick={() => openNotebookModal()} className="p-1 text-slate-300 hover:bg-slate-700 rounded-md"><PlusIcon className="w-5 h-5"/></button>
                </div>
                <ul className="overflow-y-auto flex-1 p-2 space-y-1">
                    {notebooks.map(nb => (
                         <li key={nb.id}
                            className={`w-full text-left p-2 rounded-md transition-colors group flex justify-between items-center ${selectedNotebookId === nb.id ? 'bg-blue-600' : 'hover:bg-slate-700'}`}
                        >
                            <span onClick={() => setSelectedNotebookId(nb.id)} className="truncate flex-grow cursor-pointer">{nb.name}</span>
                            <button onClick={(e) => handleNotebookDelete(e, nb.id)} className="p-1 opacity-0 group-hover:opacity-100 text-red-400 hover:bg-slate-600 rounded-md flex-shrink-0 z-10"><XIcon className="w-4 h-4" /></button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Column 2: Notes */}
            <div className="w-1/3 max-w-sm bg-slate-850 border-r border-slate-700 flex flex-col">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold truncate">{selectedNotebook?.name || 'Notas'}</h2>
                    <button onClick={handleAddNewNote} className="p-1 text-slate-300 hover:bg-slate-700 rounded-md" disabled={!selectedNotebookId}><PlusIcon className="w-5 h-5"/></button>
                </div>
                <ul className="overflow-y-auto flex-1 p-2 space-y-1">
                    {selectedNotebook?.notes.map(note => (
                        <li key={note.id}>
                            <button 
                                onClick={() => setSelectedNoteId(note.id)}
                                className={`w-full text-left p-2 rounded-md transition-colors ${selectedNoteId === note.id ? 'bg-slate-700' : 'hover:bg-slate-700/50'}`}
                            >
                                <p className="font-semibold truncate">{note.title || 'Nota sem título'}</p>
                                <p className="text-xs text-slate-400 truncate" dangerouslySetInnerHTML={{ __html: note.content.replace(/<[^>]+>/g, '') || 'Nenhum conteúdo adicional' }}></p>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Column 3: Editor */}
            <div className="flex-1 flex flex-col">
                {selectedNote ? (
                    <>
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                            <input
                                type="text"
                                value={noteTitle}
                                onChange={handleTitleChange}
                                placeholder="Título da Nota"
                                className="w-full bg-transparent text-xl font-bold focus:outline-none"
                            />
                            <button onClick={handleDeleteSelectedNote} className="p-1 text-red-400 hover:bg-slate-700 rounded-md">
                                <XIcon className="w-5 h-5"/>
                            </button>
                        </div>
                        <EditorToolbar editorRef={editorRef} />
                        <div
                            ref={editorRef}
                            onInput={handleContentChange}
                            contentEditable
                            className="flex-1 overflow-y-auto focus:outline-none abnt-editor"
                        >
                        </div>
                         <div className="p-2 border-t border-slate-700 text-xs text-slate-500 text-right">
                           Última atualização: {new Date(selectedNote.updatedAt).toLocaleString('pt-BR')}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500">
                        <p>{selectedNotebook ? 'Selecione uma nota ou crie uma nova.' : 'Selecione ou crie um caderno para começar.'}</p>
                    </div>
                )}
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingNotebook ? 'Editar Caderno' : 'Novo Caderno'}>
                <NotebookForm onSubmit={handleNotebookSubmit} notebook={editingNotebook} />
            </Modal>
        </div>
    );
};

export default NotebooksApp;