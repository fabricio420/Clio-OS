
import React, { memo, useState, useEffect } from 'react';
import type { Member, FeedPost, TeamStatus } from '../types';
import TeamFeed from './TeamFeed';
import Header from './Header';
import { RefreshCwIcon, ClipboardListIcon } from './icons';

interface TeamHubProps {
    currentUser: Member;
    onOpenModal: (view: 'member', data: Member) => void;
    members: Member[];
    feedPosts: FeedPost[];
    handleAddPost: (content: string, author: Member) => void;
    teamStatuses: TeamStatus[];
    handleUpdateTeamStatus: (statusText: string) => void;
    currentCollectiveId: string; // New Prop
}

const MemberProfileCard: React.FC<{ member: Member; onEdit: () => void }> = memo(({ member, onEdit }) => (
    <button
        onClick={onEdit}
        className="bg-slate-900 rounded-lg shadow-md p-4 text-center w-full hover:bg-slate-800 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 border-t border-lime-400"
    >
        <img
            src={member.avatar}
            alt={member.name}
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-700"
        />
        <h3 className="text-lg font-bold text-white">{member.name}</h3>
        <p className="text-sm text-sky-400">{member.role}</p>
    </button>
));


const TeamHub: React.FC<TeamHubProps> = ({ currentUser, onOpenModal, members, feedPosts, handleAddPost, teamStatuses, handleUpdateTeamStatus, currentCollectiveId }) => {
    const [myStatusText, setMyStatusText] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (currentUser && teamStatuses) {
            const currentStatus = teamStatuses.find(s => s.memberId === currentUser.id)?.status || '';
            setMyStatusText(currentStatus);
        }
    }, [currentUser, teamStatuses]);

    const handleUpdateClick = () => {
        handleUpdateTeamStatus(myStatusText);
        setStatusMessage('Status atualizado!');
        setTimeout(() => setStatusMessage(''), 2000); // Clear message after 2 seconds
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(currentCollectiveId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="h-full flex flex-col">
            <Header
                title="Hub da Equipe"
                subtitle="Central de comunicação e perfis da equipe de organização."
                action={
                    <button 
                        onClick={handleCopyId}
                        className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm py-2 px-4 rounded-md transition border border-slate-600"
                    >
                        <ClipboardListIcon className="w-4 h-4" />
                        <span>{copied ? 'Copiado!' : 'Copiar Código de Convite'}</span>
                    </button>
                }
            />
            <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 space-y-8">
                <section>
                    <h3 className="text-xl font-semibold text-lime-400 mb-4 pb-2 border-b border-slate-700">Meu Status</h3>
                    <div className="bg-slate-900 rounded-lg shadow-md p-6 border-t border-lime-400 max-w-4xl mx-auto">
                        <div className="flex items-start space-x-4">
                            <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full" />
                            <div className="flex-grow">
                                <label htmlFor="status-input" className="block text-sm font-medium text-slate-300 mb-1">
                                    O que você está fazendo agora?
                                </label>
                                <textarea
                                    id="status-input"
                                    value={myStatusText}
                                    onChange={(e) => setMyStatusText(e.target.value)}
                                    placeholder="Ex: Focando nos flyers, disponível para ajudar..."
                                    className="w-full bg-slate-800 text-white p-3 rounded-md border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    rows={2}
                                />
                                <div className="flex items-center justify-between mt-2">
                                    <button 
                                        onClick={handleUpdateClick}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition flex items-center space-x-2"
                                    >
                                        <RefreshCwIcon className="w-4 h-4" />
                                        <span>Atualizar Status</span>
                                    </button>
                                    {statusMessage && <p className="text-sm text-lime-400 animate-pulse">{statusMessage}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <h3 className="text-xl font-semibold text-lime-400 mb-4 pb-2 border-b border-slate-700">Perfis da Equipe</h3>
                    <p className="text-sm text-slate-400 mb-4 -mt-2">Clique em um perfil para editar nome, função ou foto.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {members.map(member => (
                            <MemberProfileCard 
                                key={member.id} 
                                member={member} 
                                onEdit={() => onOpenModal('member', member)}
                            />
                        ))}
                    </div>
                </section>
                
                <section>
                    <h3 className="text-xl font-semibold text-lime-400 mb-4 pb-2 border-b border-slate-700">Mural de Comunicação</h3>
                    <div className="max-w-4xl mx-auto">
                        <TeamFeed 
                            posts={feedPosts} 
                            currentUser={currentUser} 
                            onAddPost={(content) => handleAddPost(content, currentUser)} 
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TeamHub;
