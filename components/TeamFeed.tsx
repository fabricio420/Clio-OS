import React, { useState } from 'react';
import type { FeedPost, Member } from '../types';

interface TeamFeedProps {
  posts: FeedPost[];
  currentUser?: Member;
  onAddPost?: (content: string) => void;
  isReadOnly?: boolean;
}

const TeamFeed: React.FC<TeamFeedProps> = ({ posts, currentUser, onAddPost, isReadOnly = false }) => {
  const [newPostContent, setNewPostContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent.trim() && onAddPost) {
      onAddPost(newPostContent.trim());
      setNewPostContent('');
    }
  };
  
  const sortedPosts = [...posts].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <>
      {!isReadOnly && currentUser && onAddPost && (
        <div className="bg-slate-800 rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex items-start space-x-4">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full" />
            <div className="flex-grow">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Compartilhe uma atualização com a equipe..."
                className="w-full bg-slate-700 text-white p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                rows={3}
              ></textarea>
              <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">
                Publicar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {sortedPosts.map(post => (
          <div key={post.id} className="bg-slate-800 rounded-lg shadow-md p-6 flex items-start space-x-4">
            <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full" />
            <div className="flex-grow">
              <div className="flex items-baseline space-x-2">
                <p className="font-bold text-lime-400">{post.author.name}</p>
                <p className="text-xs text-slate-400">
                  {new Date(post.timestamp).toLocaleString('pt-BR')}
                </p>
              </div>
              <p className="text-slate-200 mt-2">{post.content}</p>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-center text-slate-400">Nenhuma publicação ainda.</p>}
      </div>
    </>
  );
};

export default TeamFeed;