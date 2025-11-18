


import React, { useState, useEffect, useRef } from 'react';
import type { Task, Member, TaskComment } from '../../types';
import { FormInput } from './FormElements';
import { MessageSquareIcon, CheckSquareIcon, SendIcon } from '../icons';
import { supabase } from '../../supabaseClient';

interface TaskFormProps {
    onSubmit: (data: any, id?: string) => void;
    task: Task | null;
    members: Member[];
    currentUser?: Member | null; // Added to handle comment authorship
}

const TabButton: React.FC<{ label: string; icon: React.ReactNode; isActive: boolean; onClick: () => void; }> = ({ label, icon, isActive, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
            isActive
                ? 'border-lime-400 text-lime-400 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/30'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const CommentBubble: React.FC<{ comment: TaskComment; isMine: boolean }> = ({ comment, isMine }) => (
    <div className={`flex gap-3 mb-4 ${isMine ? 'flex-row-reverse' : ''}`}>
        <div className="flex-shrink-0">
            <img 
                src={comment.author?.avatar || 'https://i.pravatar.cc/150?u=default'} 
                alt={comment.author?.name} 
                className="w-8 h-8 rounded-full border border-slate-600"
            />
        </div>
        <div className={`flex flex-col max-w-[80%] ${isMine ? 'items-end' : 'items-start'}`}>
            <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs font-bold text-slate-300">{comment.author?.name || 'Usuário'}</span>
                <span className="text-[10px] text-slate-500">{new Date(comment.createdAt).toLocaleString('pt-BR', { hour: '2-digit', minute:'2-digit' })}</span>
            </div>
            <div className={`px-3 py-2 rounded-lg text-sm ${isMine ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-700 text-slate-200 rounded-tl-none'}`}>
                {comment.content}
            </div>
        </div>
    </div>
);

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, task, members, currentUser }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');
    const [formData, setFormData] = useState({ title: '', description: '', assigneeId: '', dueDate: '' });
    
    // Comments State
    const [comments, setComments] = useState<TaskComment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { 
        if (task) {
            setFormData({ title: task.title, description: task.description, assigneeId: task.assigneeId || '', dueDate: task.dueDate });
            fetchComments();
        }
    }, [task]);

    // Realtime subscription for comments
    useEffect(() => {
        if (!task) return;

        const channel = supabase.channel(`comments-${task.id}`)
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'task_comments',
                filter: `task_id=eq.${task.id}`
            }, (payload) => {
                const newComment = payload.new as any;
                // Fetch author details for the new comment to display correctly
                supabase.from('profiles').select('*').eq('id', newComment.user_id).single()
                    .then(({ data: authorData }) => {
                         const commentWithAuthor: TaskComment = {
                            id: newComment.id,
                            taskId: newComment.task_id,
                            userId: newComment.user_id,
                            content: newComment.content,
                            createdAt: newComment.created_at,
                            author: authorData ? {
                                id: authorData.id,
                                name: authorData.name,
                                avatar: authorData.avatar,
                                role: authorData.role,
                                email: authorData.email
                            } : undefined
                        };
                        setComments(prev => [...prev, commentWithAuthor]);
                        scrollToBottom();
                    });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [task]);

    const fetchComments = async () => {
        if (!task) return;
        setIsLoadingComments(true);
        const { data, error } = await supabase
            .from('task_comments')
            .select(`
                *,
                author:profiles(*)
            `)
            .eq('task_id', task.id)
            .order('created_at', { ascending: true });

        if (data) {
             const mappedComments: TaskComment[] = data.map((c: any) => ({
                id: c.id,
                taskId: c.task_id,
                userId: c.user_id,
                content: c.content,
                createdAt: c.created_at,
                author: c.author ? {
                    id: c.author.id,
                    name: c.author.name,
                    avatar: c.author.avatar,
                    role: c.author.role,
                    email: c.author.email
                } : undefined
            }));
            setComments(mappedComments);
            setTimeout(scrollToBottom, 100);
        }
        setIsLoadingComments(false);
    };

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !task || !currentUser) return;

        const content = newComment.trim();
        setNewComment(''); // Optimistic clear

        await supabase.from('task_comments').insert({
            task_id: task.id,
            user_id: currentUser.id,
            content: content
        });
        // Realtime will handle the list update
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setFormData({...formData, [e.target.name]: e.target.value});
    
    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        onSubmit(formData, task?.id); 
    };

    return (
        <div>
             {/* Tabs Header */}
            <div className="flex border-b border-slate-700 mb-4 -mt-2">
                <TabButton 
                    label="Detalhes" 
                    icon={<CheckSquareIcon className="w-4 h-4" />} 
                    isActive={activeTab === 'details'} 
                    onClick={() => setActiveTab('details')} 
                />
                {task && (
                    <TabButton 
                        label={`Atividade (${comments.length})`} 
                        icon={<MessageSquareIcon className="w-4 h-4" />} 
                        isActive={activeTab === 'comments'} 
                        onClick={() => setActiveTab('comments')} 
                    />
                )}
            </div>

            {activeTab === 'details' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput label="Título" name="title" value={formData.title} onChange={handleChange} required />
                    <FormInput label="Descrição" name="description" as="textarea" value={formData.description} onChange={handleChange} rows={3} />
                    <FormInput label="Responsável" name="assigneeId" as="select" value={formData.assigneeId} onChange={handleChange}>
                        <option value="">Ninguém</option>
                        {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </FormInput>
                    <FormInput label="Prazo" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} required />
                    <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">Salvar Tarefa</button>
                </form>
            )}

            {activeTab === 'comments' && task && (
                <div className="flex flex-col h-[400px]">
                    <div className="flex-1 overflow-y-auto pr-2 mb-4 custom-scrollbar">
                        {isLoadingComments ? (
                            <p className="text-center text-slate-500 mt-4">Carregando histórico...</p>
                        ) : comments.length === 0 ? (
                            <div className="text-center text-slate-500 mt-10">
                                <MessageSquareIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                <p>Nenhum comentário ainda.</p>
                                <p className="text-xs">Inicie a conversa sobre esta tarefa.</p>
                            </div>
                        ) : (
                            comments.map(comment => (
                                <CommentBubble 
                                    key={comment.id} 
                                    comment={comment} 
                                    isMine={comment.userId === currentUser?.id} 
                                />
                            ))
                        )}
                        <div ref={commentsEndRef} />
                    </div>
                    
                    <form onSubmit={handleSendComment} className="relative flex items-center gap-2 border-t border-slate-700 pt-4">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escreva um comentário..."
                            className="flex-1 bg-slate-900 text-white p-3 rounded-full border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pl-4"
                        />
                        <button 
                            type="submit" 
                            disabled={!newComment.trim()}
                            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                        >
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
