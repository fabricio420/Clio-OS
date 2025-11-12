import React, { useState, useMemo } from 'react';
import type { CollectiveDocument, ModalView, Member, MeetingMinute, VotingTopic, VoteOption } from '../types';
import { PlusIcon, FileTextIcon, DownloadIcon, XIcon, MoreVerticalIcon, ClipboardListIcon, VoteIcon, UsersIcon, ChevronRightIcon } from './icons';
import Header from './Header';

interface CollabClioAppProps {
    onOpenModal: (view: ModalView, data?: any) => void;
    currentUser: Member;
    collectiveDocuments: CollectiveDocument[];
    meetingMinutes: MeetingMinute[];
    votingTopics: VotingTopic[];
    members: Member[];
    handleDeleteCollectiveDocument: (docId: string) => void;
    handleDeleteMeetingMinute: (minuteId: string) => void;
    handleCastVote: (topicId: string, optionId: string, voterId: string) => void;
    handleCloseVoting: (topicId: string) => void;
}

type ActiveTab = 'documents' | 'minutes' | 'voting';

const TabButton: React.FC<{ label: string; icon: React.ReactNode; isActive: boolean; onClick: () => void; }> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-3 text-sm font-semibold transition-colors rounded-t-md ${
            isActive
                ? 'bg-slate-800 text-lime-400 border-b-2 border-lime-400'
                : 'text-slate-400 hover:text-white'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

// --- Documents Tab Components ---
const DocumentRow: React.FC<{ doc: CollectiveDocument; uploaderName: string; onDelete: (docId: string) => void; }> = ({ doc, uploaderName, onDelete }) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = doc.fileDataUrl;
        link.download = doc.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex items-center justify-between p-3 bg-slate-900 rounded-md hover:bg-slate-800/50 group border-t border-slate-700">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
                <FileTextIcon className="w-6 h-6 text-sky-400 flex-shrink-0" />
                <div className="min-w-0">
                    <p className="font-semibold text-slate-100 truncate" title={doc.name}>{doc.name}</p>
                    <p className="text-xs text-slate-400">
                        Enviado por {uploaderName} em {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={handleDownload} className="p-2 text-slate-300 hover:text-white hover:bg-slate-600 rounded-md" title="Baixar">
                    <DownloadIcon className="w-5 h-5"/>
                </button>
                <button onClick={() => onDelete(doc.id)} className="p-2 text-red-400 hover:text-white hover:bg-red-500 rounded-md" title="Excluir">
                    <XIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
    );
};

// --- Meeting Minutes Tab Components ---
const MinuteCard: React.FC<{ minute: MeetingMinute; members: Member[]; onEdit: () => void; onDelete: () => void; }> = ({ minute, members, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const attendees = members.filter(m => minute.attendeeIds.includes(m.id));

    return (
        <div className="bg-slate-900 rounded-lg overflow-hidden border-t border-lime-400">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/50" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center space-x-3">
                    <ClipboardListIcon className="w-6 h-6 text-sky-400" />
                    <div>
                        <h4 className="font-bold text-slate-100">Ata da Reunião</h4>
                        <p className="text-sm text-slate-400">{new Date(minute.date).toLocaleDateString('pt-BR', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                         <button onClick={(e) => { e.stopPropagation(); setMenuOpen(p => !p); }} className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-md">
                            <MoreVerticalIcon className="w-5 h-5"/>
                        </button>
                        {menuOpen && (
                             <div className="absolute right-0 mt-2 w-32 bg-slate-950 border border-slate-700 rounded-md shadow-lg z-10">
                                <button onClick={(e) => { e.stopPropagation(); onEdit(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Editar</button>
                                <button onClick={(e) => { e.stopPropagation(); onDelete(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800">Excluir</button>
                            </div>
                        )}
                    </div>
                    <ChevronRightIcon className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </div>
            </div>
            {isOpen && (
                <div className="p-4 border-t border-slate-700 bg-slate-900/50 text-slate-300 text-sm space-y-4">
                    <div>
                        <h5 className="font-semibold text-lime-400 mb-2">Participantes:</h5>
                        <div className="flex flex-wrap gap-2">
                            {attendees.map(a => <span key={a.id} className="text-xs bg-slate-700 px-2 py-1 rounded-full">{a.name}</span>)}
                        </div>
                    </div>
                     <div>
                        <h5 className="font-semibold text-lime-400 mb-2">Pautas:</h5>
                        <p className="whitespace-pre-wrap p-2 bg-slate-800/50 rounded-md">{minute.agenda}</p>
                    </div>
                     <div>
                        <h5 className="font-semibold text-lime-400 mb-2">Decisões:</h5>
                        <p className="whitespace-pre-wrap p-2 bg-slate-800/50 rounded-md">{minute.decisions}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Voting Tab Components ---
const VotingCard: React.FC<{ topic: VotingTopic; currentUser: Member; members: Member[]; handleCastVote: (topicId: string, optionId: string, voterId: string) => void; handleCloseVoting: (topicId: string) => void; }> = ({ topic, currentUser, members, handleCastVote, handleCloseVoting }) => {
    const creator = members.find(m => m.id === topic.creatorId);
    const totalVotes = topic.options.reduce((sum, opt) => sum + opt.voterIds.length, 0);
    const userVote = topic.options.find(opt => opt.voterIds.includes(currentUser.id));

    return (
         <div className={`bg-slate-900 rounded-lg p-6 shadow-md border-t border-lime-400 ${topic.status === 'closed' ? 'opacity-60' : ''}`}>
             <div className="flex justify-between items-start">
                 <div>
                    <h4 className="text-lg font-bold text-white">{topic.title}</h4>
                    <p className="text-xs text-slate-400 mb-2">Criado por {creator?.name || 'Desconhecido'} em {new Date(topic.createdAt).toLocaleDateString('pt-BR')}</p>
                    <p className="text-sm text-slate-300 mb-4">{topic.description}</p>
                 </div>
                 {topic.status === 'open' && currentUser.id === topic.creatorId && (
                     <button onClick={() => handleCloseVoting(topic.id)} className="text-xs py-1 px-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold">Encerrar</button>
                 )}
                 {topic.status === 'closed' && (
                     <span className="text-xs py-1 px-2 bg-slate-600 rounded-md font-semibold">Encerrada</span>
                 )}
            </div>
            <div className="space-y-3">
                {topic.options.map(option => {
                    const percentage = totalVotes > 0 ? (option.voterIds.length / totalVotes) * 100 : 0;
                    const hasVotedForThis = userVote?.id === option.id;
                    return (
                        <div key={option.id}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-200">{option.text}</span>
                                <span className="font-semibold text-slate-400">{option.voterIds.length} voto(s)</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-6 relative flex items-center">
                                <div className="bg-blue-500 h-6 rounded-full" style={{ width: `${percentage}%` }}></div>
                                <span className="absolute left-2 text-xs font-bold text-white mix-blend-difference">{percentage.toFixed(0)}%</span>
                                {topic.status === 'open' && (
                                     <button 
                                        onClick={() => handleCastVote(topic.id, option.id, currentUser.id)}
                                        className={`absolute right-1 text-xs px-2 py-0.5 rounded-full font-semibold transition ${hasVotedForThis ? 'bg-lime-500 text-slate-900' : 'bg-slate-600 text-white hover:bg-slate-500'}`}
                                     >
                                         {hasVotedForThis ? 'Votado' : 'Votar'}
                                     </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
         </div>
    );
};


const CollabClioApp: React.FC<CollabClioAppProps> = ({ onOpenModal, currentUser, collectiveDocuments, meetingMinutes, votingTopics, members, handleDeleteCollectiveDocument, handleDeleteMeetingMinute, handleCastVote, handleCloseVoting }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('documents');

    const sortedDocs = [...collectiveDocuments].sort((a,b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    const sortedMinutes = [...meetingMinutes].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const openVotingTopics = votingTopics.filter(t => t.status === 'open').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const closedVotingTopics = votingTopics.filter(t => t.status === 'closed').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const TABS: { id: ActiveTab; label: string; icon: React.ReactNode; modal: ModalView; buttonLabel: string }[] = [
        { id: 'documents', label: 'Documentos', icon: <FileTextIcon className="w-5 h-5" />, modal: 'collective_document', buttonLabel: 'Adicionar Documento'},
        { id: 'minutes', label: 'Atas de Reunião', icon: <ClipboardListIcon className="w-5 h-5" />, modal: 'meeting_minute', buttonLabel: 'Nova Ata'},
        { id: 'voting', label: 'Votações', icon: <VoteIcon className="w-5 h-5" />, modal: 'voting_topic', buttonLabel: 'Criar Votação'},
    ];

    const currentTab = TABS.find(t => t.id === activeTab);

    return (
        <div className="h-full flex flex-col">
            <Header
                title="Collab Clio"
                subtitle="Governança e acervo intelectual do coletivo."
                action={
                    <button
                        onClick={() => onOpenModal(currentTab!.modal)}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span>{currentTab?.buttonLabel}</span>
                    </button>
                }
            />
            <div className="px-4 md:px-8 flex-shrink-0">
                <div className="border-b border-slate-700 flex items-center">
                    {TABS.map(tab => (
                        <TabButton
                            key={tab.id}
                            label={tab.label}
                            icon={tab.icon}
                            isActive={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                </div>
            </div>

            <main className="flex-1 overflow-y-auto px-4 md:px-8 pt-6 pb-8">
                {activeTab === 'documents' && (
                     sortedDocs.length > 0 ? (
                        <div className="space-y-3">
                            {sortedDocs.map(doc => {
                                const uploader = members.find(m => m.id === doc.uploaderId);
                                return <DocumentRow key={doc.id} doc={doc} uploaderName={uploader?.name || 'Desconhecido'} onDelete={handleDeleteCollectiveDocument} />;
                            })}
                        </div>
                     ) : (
                        <div className="text-center py-16 bg-slate-900 rounded-lg border-t border-slate-700"><p className="text-slate-400 text-lg">Nenhum documento encontrado.</p><p className="text-sm mt-2">Adicione atas, editais e outros arquivos importantes.</p></div>
                     )
                )}

                {activeTab === 'minutes' && (
                    sortedMinutes.length > 0 ? (
                        <div className="space-y-4">
                            {sortedMinutes.map(minute => (
                                <MinuteCard key={minute.id} minute={minute} members={members} onEdit={() => onOpenModal('meeting_minute', minute)} onDelete={() => handleDeleteMeetingMinute(minute.id)} />
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-16 bg-slate-900 rounded-lg border-t border-slate-700"><p className="text-slate-400 text-lg">Nenhuma ata de reunião registrada.</p><p className="text-sm mt-2">Use o botão "Nova Ata" para criar a primeira.</p></div>
                    )
                )}

                {activeTab === 'voting' && (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold text-lime-400 mb-4">Votações Abertas</h3>
                            {openVotingTopics.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {openVotingTopics.map(topic => <VotingCard key={topic.id} topic={topic} currentUser={currentUser} members={members} handleCastVote={handleCastVote} handleCloseVoting={handleCloseVoting} />)}
                                </div>
                            ) : (
                                <p className="text-slate-400 text-center py-6 bg-slate-900/50 rounded-lg">Nenhuma votação em andamento.</p>
                            )}
                        </div>
                         <div>
                            <h3 className="text-xl font-semibold text-slate-500 mb-4">Votações Encerradas</h3>
                            {closedVotingTopics.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {closedVotingTopics.map(topic => <VotingCard key={topic.id} topic={topic} currentUser={currentUser} members={members} handleCastVote={handleCastVote} handleCloseVoting={handleCloseVoting} />)}
                                </div>
                            ) : (
                                <p className="text-slate-400 text-center py-6 bg-slate-900/50 rounded-lg">Nenhuma votação encerrada ainda.</p>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CollabClioApp;