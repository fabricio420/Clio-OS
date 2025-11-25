
import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { GlobeIcon, InstagramIcon, CalendarIcon, SearchIcon, ActivityIcon, ZapIcon, XIcon, PlusIcon } from './icons';
import Header from './Header';
import type { Collective, NetworkPost } from '../types';
import { useAppContext } from '../contexts/AppContext';

// --- TYPES & INTERFACES ---
interface NetworkCollective extends Collective {
    next_event_date?: string;
    tags?: string[];
    instagram?: string;
    cover_image?: string;
}

// --- SUB-COMPONENTS ---

const TabButton: React.FC<{ label: string; icon: React.ReactNode; isActive: boolean; onClick: () => void }> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 relative ${
            isActive
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
        }`}
    >
        {icon}
        <span>{label}</span>
        {isActive && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-lime-400 to-sky-400 shadow-[0_0_10px_rgba(132,204,22,0.5)]"></div>
        )}
    </button>
);

const PostCard: React.FC<{ post: NetworkPost, currentUserId?: string, onDelete: (id: string) => void, onLike: (id: string) => void }> = ({ post, currentUserId, onDelete, onLike }) => {
    const [liked, setLiked] = useState(post.isLikedByMe);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleLike = () => {
        if (liked) return; // Prevent spam for now locally
        setLiked(true);
        setLikesCount(c => c + 1);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
        onLike(post.id);
    };

    // Prioritize Vulgo if available
    const displayName = post.author.vulgo || post.author.name;

    return (
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg relative overflow-hidden group">
            {/* Decorative gradient background for "elevation" feel */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sky-500/5 to-transparent rounded-bl-full pointer-events-none"></div>
            
            {/* Header */}
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src={post.author.avatar} alt={displayName} className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
                        <div className="absolute -bottom-1 -right-1 bg-slate-800 rounded-full p-0.5 border border-slate-700" title={post.collective.name}>
                            <GlobeIcon className="w-3 h-3 text-lime-400" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">{displayName}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <span className="text-sky-400">{post.collective.name}</span>
                            <span>•</span>
                            <span>{new Date(post.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                    </div>
                </div>
                {currentUserId === post.author.id && (
                    <button onClick={() => onDelete(post.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                        <XIcon className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Content - The Poetry Core */}
            <div className="mb-6 relative z-10 pl-4 border-l-2 border-slate-800">
                <p className="text-lg text-slate-200 font-serif leading-relaxed whitespace-pre-wrap italic opacity-90 selection:bg-lime-500/30 selection:text-lime-200">
                    {post.content}
                </p>
            </div>

            {/* Footer / Actions */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4 relative z-10">
                <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors group/btn ${liked ? 'text-pink-500' : 'text-slate-500 hover:text-pink-400'}`}
                >
                    <div className={`relative ${isAnimating ? 'animate-bounce' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                    </div>
                    <span>{likesCount}</span>
                </button>
                
                <div className="flex gap-2">
                    {/* Placeholder for sharing/comments in future */}
                </div>
            </div>
        </div>
    );
};

const CollectiveCard: React.FC<{ collective: NetworkCollective, isCurrent: boolean }> = ({ collective, isCurrent }) => {
    return (
        <div className={`group relative bg-slate-900 rounded-xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isCurrent ? 'border-lime-500/50 ring-1 ring-lime-500/20' : 'border-slate-700 hover:border-sky-500/50'}`}>
            {/* Cover Image */}
            <div className="h-32 w-full bg-slate-800 relative overflow-hidden">
                {collective.cover_image ? (
                    <img src={collective.cover_image} alt={collective.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                        <GlobeIcon className="w-12 h-12 text-slate-700" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                
                {isCurrent && (
                    <div className="absolute top-2 right-2 bg-lime-500 text-slate-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                        SEU COLETIVO
                    </div>
                )}
            </div>

            <div className="p-5 relative">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white leading-tight">{collective.name}</h3>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2 mb-4 min-h-[2.5rem]">
                    {collective.description || "Sem descrição pública."}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {collective.tags && collective.tags.length > 0 ? (
                        collective.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-[10px] uppercase tracking-wider font-semibold bg-slate-800 text-sky-300 px-2 py-1 rounded-md border border-slate-700">
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span className="text-[10px] text-slate-600 italic">Sem tags</span>
                    )}
                </div>
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    {collective.next_event_date ? (
                        <div className="flex items-center gap-2 text-xs text-lime-400">
                            <CalendarIcon className="w-3 h-3" />
                            <span>{new Date(collective.next_event_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                    ) : (
                        <span className="text-xs text-slate-500">Sem eventos previstos</span>
                    )}
                    <div className="flex items-center gap-2">
                        {collective.instagram && (
                            <a 
                                href={`https://instagram.com/${collective.instagram.replace('@', '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-1.5 bg-slate-800 rounded-full text-slate-400 hover:text-pink-400 hover:bg-slate-700 transition-colors"
                                title="Instagram"
                            >
                                <InstagramIcon className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- MAIN COMPONENT ---

const CulturalNetworkApp: React.FC<{ currentCollectiveId?: string }> = ({ currentCollectiveId }) => {
    const { currentUser } = useAppContext();
    const [activeTab, setActiveTab] = useState<'feed' | 'directory'>('feed');
    const [posts, setPosts] = useState<NetworkPost[]>([]);
    const [collectives, setCollectives] = useState<NetworkCollective[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Post Creation State
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    // FETCH DATA
    const fetchCollectives = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('collectives')
            .select('*')
            .eq('is_public', true)
            .order('name');

        if (data) {
            setCollectives(data as NetworkCollective[]);
        } else if (error) {
            console.error("Error fetching network:", error);
        }
        setLoading(false);
    }, []);

    const fetchPosts = useCallback(async () => {
        if (!currentUser) return;
        setLoading(true);
        
        // Join query: Posts -> Author (Profile) & Posts -> Collective
        // Include 'vulgo' in author select
        const { data, error } = await supabase
            .from('network_posts')
            .select(`
                id,
                content,
                created_at,
                likes_count,
                author:profiles!author_id (id, name, vulgo, avatar, role),
                collective:collectives!collective_id (id, name)
            `)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error("Error fetching posts:", error);
        } else if (data) {
            // Check user likes
            const { data: userLikes } = await supabase
                .from('network_likes')
                .select('post_id')
                .eq('user_id', currentUser.id);
            
            const likedPostIds = new Set(userLikes?.map(l => l.post_id) || []);

            const formattedPosts: NetworkPost[] = data.map((p: any) => ({
                id: p.id,
                content: p.content,
                created_at: p.created_at,
                likes_count: p.likes_count,
                author: p.author,
                collective: p.collective,
                isLikedByMe: likedPostIds.has(p.id)
            }));
            setPosts(formattedPosts);
        }
        setLoading(false);
    }, [currentUser]);

    useEffect(() => {
        if (activeTab === 'directory') {
            fetchCollectives();
        } else {
            fetchPosts();
        }
    }, [activeTab, fetchCollectives, fetchPosts]);

    // HANDLERS
    const handleCreatePost = async () => {
        if (!newPostContent.trim() || !currentUser || !currentCollectiveId) return;
        setIsPosting(true);

        const { error } = await supabase
            .from('network_posts')
            .insert({
                content: newPostContent,
                author_id: currentUser.id,
                collective_id: currentCollectiveId
            });

        if (error) {
            alert("Erro ao publicar. Tente novamente.");
            console.error(error);
        } else {
            setNewPostContent('');
            fetchPosts(); // Refresh
        }
        setIsPosting(false);
    };

    const handleDeletePost = async (postId: string) => {
        if(window.confirm("Tem certeza que deseja apagar esta publicação?")) {
            await supabase.from('network_posts').delete().eq('id', postId);
            setPosts(prev => prev.filter(p => p.id !== postId));
        }
    };

    const handleLikePost = async (postId: string) => {
        if (!currentUser) return;
        
        // Optimistic update is handled in card, this sends to DB
        const { error } = await supabase
            .from('network_likes')
            .insert({ post_id: postId, user_id: currentUser.id });
            
        if (!error) {
            // Increment counter on post
            await supabase.rpc('increment_post_likes', { row_id: postId });
        }
    };

    // FILTERING
    const filteredCollectives = collectives.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="h-full flex flex-col bg-slate-950">
            <Header 
                title="Rede Cultural" 
                subtitle="A Ágora digital dos coletivos: arte, conexão e visibilidade."
                action={
                    activeTab === 'directory' ? (
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Buscar coletivos..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-full text-sm text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none w-64 transition-all focus:w-80"
                            />
                        </div>
                    ) : null
                }
            />

            {/* Navigation Tabs */}
            <div className="px-4 md:px-8 flex-shrink-0 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-20">
                <div className="flex items-center gap-2">
                    <TabButton 
                        label="Mural Poético" 
                        icon={<ActivityIcon className="w-4 h-4" />} 
                        isActive={activeTab === 'feed'} 
                        onClick={() => setActiveTab('feed')} 
                    />
                    <TabButton 
                        label="Diretório de Coletivos" 
                        icon={<GlobeIcon className="w-4 h-4" />} 
                        isActive={activeTab === 'directory'} 
                        onClick={() => setActiveTab('directory')} 
                    />
                </div>
            </div>

            <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 pt-6">
                
                {/* --- FEED TAB --- */}
                {activeTab === 'feed' && (
                    <div className="max-w-3xl mx-auto">
                        {/* Compose Box */}
                        <div className="bg-slate-900 rounded-xl p-4 mb-8 border border-slate-800 shadow-lg transition-all focus-within:ring-2 focus-within:ring-lime-500/50">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <img src={currentUser?.avatar} className="w-12 h-12 rounded-full border-2 border-slate-700" alt="Me" />
                                </div>
                                <div className="flex-grow">
                                    <textarea
                                        value={newPostContent}
                                        onChange={(e) => setNewPostContent(e.target.value)}
                                        placeholder="Compartilhe sua poesia, pensamento ou arte com a rede..."
                                        className="w-full bg-transparent text-lg text-slate-200 placeholder:text-slate-500 border-none outline-none resize-none font-serif min-h-[100px]"
                                    />
                                    <div className="flex justify-between items-center mt-2 border-t border-slate-800 pt-2">
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <ZapIcon className="w-3 h-3" /> 
                                            Publicando como <span className="text-sky-400 font-bold">{currentUser?.vulgo || currentUser?.name}</span>
                                        </span>
                                        <button 
                                            onClick={handleCreatePost}
                                            disabled={!newPostContent.trim() || isPosting}
                                            className="px-4 py-2 bg-lime-600 hover:bg-lime-500 text-white font-bold rounded-full text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isPosting ? 'Publicando...' : <><PlusIcon className="w-4 h-4" /> Publicar</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-6">
                            {loading ? (
                                <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500 mx-auto"></div></div>
                            ) : posts.length > 0 ? (
                                posts.map(post => (
                                    <PostCard 
                                        key={post.id} 
                                        post={post} 
                                        currentUserId={currentUser?.id}
                                        onDelete={handleDeletePost}
                                        onLike={handleLikePost}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-16 text-slate-500">
                                    <p>A rede está silenciosa...</p>
                                    <p className="text-sm mt-2">Seja a primeira voz a ecoar por aqui!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- DIRECTORY TAB --- */}
                {activeTab === 'directory' && (
                    <>
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                            </div>
                        ) : filteredCollectives.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredCollectives.map(collective => (
                                    <CollectiveCard 
                                        key={collective.id} 
                                        collective={collective} 
                                        isCurrent={collective.id === currentCollectiveId}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                                <GlobeIcon className="w-16 h-16 mb-4 opacity-20" />
                                <p className="text-lg">Nenhum coletivo encontrado.</p>
                                <p className="text-sm">Seja o primeiro a publicar seu perfil na rede!</p>
                            </div>
                        )}
                        
                        <div className="mt-12 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">Quer aparecer aqui?</h4>
                                <p className="text-sm text-slate-400">Vá em <strong>Informações</strong>, ative o "Perfil Público" e configure sua vitrine.</p>
                            </div>
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900"></div>
                                <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-900"></div>
                                <div className="w-8 h-8 rounded-full bg-slate-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white font-bold">+</div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default CulturalNetworkApp;