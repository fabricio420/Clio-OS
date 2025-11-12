import React, { memo } from 'react';
import type { Member, FeedPost } from '../types';
import TeamFeed from './TeamFeed';

interface TeamHubProps {
    currentUser: Member;
    onOpenModal: (view: 'member', data: Member) => void;
    members: Member[];
    feedPosts: FeedPost[];
    handleAddPost: (content: string, author: Member) => void;
}

const MemberProfileCard: React.FC<{ member: Member; onEdit: () => void }> = memo(({ member, onEdit }) => (
    <button
        onClick={onEdit}
        className="bg-slate-800 rounded-lg shadow-md p-4 text-center w-full hover:bg-slate-700 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
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


const TeamHub: React.FC<TeamHubProps> = ({ currentUser, onOpenModal, members, feedPosts, handleAddPost }) => {
    return (
        <div className="p-4 md:p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white">Hub da Equipe</h2>
                <p className="text-slate-400 mt-1">Central de comunicação e perfis da equipe de organização.</p>
            </div>

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
    );
};

export default TeamHub;