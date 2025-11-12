import React, { useState, memo } from 'react';
import type { Artist, MediaItem } from '../types';
import { PlusIcon, MoreVerticalIcon, WhatsappIcon, InstagramIcon } from './icons';
import Header from './Header';

interface MediaHubProps {
  onOpenModal: () => void;
  mediaItems: MediaItem[];
  artists: Artist[];
  handleDeleteMediaItem: (mediaId: string) => void;
}

const MediaCard: React.FC<{
  item: MediaItem;
  artist?: Artist;
  onDelete: (mediaId: string) => void;
}> = memo(({ item, artist, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = item.fileDataUrl;
    link.download = item.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cardTitle = artist ? artist.name : item.title;
  const cardSubtitle = artist ? artist.performanceType : item.fileName;

  return (
    <div className="bg-slate-900 rounded-lg shadow-md overflow-hidden group flex flex-col border-t border-lime-400">
      <div className="aspect-w-16 aspect-h-9 bg-slate-800">
        <img src={item.fileDataUrl} alt={cardTitle} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex justify-between items-start flex-grow">
        <div>
          <h4 className="font-bold text-slate-100 truncate">{cardTitle}</h4>
          <p className="text-xs text-slate-400">{cardSubtitle}</p>
        </div>
        <div className="relative flex-shrink-0">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-400 hover:text-white p-1">
            <MoreVerticalIcon className="h-5 w-5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-slate-950 border border-slate-700 rounded-md shadow-lg z-10">
              <button onClick={handleDownload} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Baixar</button>
              <button onClick={() => { onDelete(item.id); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800">Excluir</button>
            </div>
          )}
        </div>
      </div>
       {artist && (artist.whatsapp || artist.instagram) && (
        <div className="px-4 pb-3 border-t border-slate-700 flex items-center justify-end space-x-4">
            {artist.whatsapp && (
                <a href={`https://wa.me/${artist.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" title={artist.whatsapp} className="flex items-center space-x-1 text-slate-400 hover:text-lime-400">
                    <WhatsappIcon className="h-4 w-4" />
                </a>
            )}
            {artist.instagram && (
                <a href={`https://instagram.com/${artist.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" title={artist.instagram} className="flex items-center space-x-1 text-slate-400 hover:text-lime-400">
                    <InstagramIcon className="h-4 w-4" />
                </a>
            )}
        </div>
      )}
    </div>
  );
});


const MediaHub: React.FC<MediaHubProps> = ({ onOpenModal, mediaItems, artists, handleDeleteMediaItem }) => {
  const [filter, setFilter] = useState<'all' | 'general' | 'artist'>('all');

  const generalItems = mediaItems.filter(item => item.category === 'general');
  const artistItems = mediaItems.filter(item => item.category === 'artist');
  
  const FilterButton: React.FC<{label: string, value: 'all' | 'general' | 'artist', currentFilter: string, setFilter: (value: 'all' | 'general' | 'artist') => void}> = ({ label, value, currentFilter, setFilter }) => (
      <button
          onClick={() => setFilter(value)}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
              currentFilter === value 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
      >
          {label}
      </button>
  );

  return (
    <div className="h-full flex flex-col">
      <Header
        title="Hub de Mídia"
        subtitle="Gerencie todo o material de arte e divulgação do evento."
        action={
          <button
            onClick={onOpenModal}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Adicionar Mídia</span>
          </button>
        }
      />
      <div className="px-4 md:px-8 flex-shrink-0">
          <div className="flex items-center space-x-2 border-b border-slate-700 pb-4">
            <FilterButton label="Todos" value="all" currentFilter={filter} setFilter={setFilter} />
            <FilterButton label="Divulgação Geral" value="general" currentFilter={filter} setFilter={setFilter} />
            <FilterButton label="Mídia de Artista" value="artist" currentFilter={filter} setFilter={setFilter} />
          </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-8 pb-8 space-y-8">
        {(filter === 'all' || filter === 'general') && (
          <div>
            <h3 className="text-xl font-semibold text-lime-400 mb-4">Material de Divulgação Geral</h3>
            {generalItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {generalItems.map(item => (
                  <MediaCard key={item.id} item={item} onDelete={handleDeleteMediaItem} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-900 rounded-lg border-t border-slate-700">
                <p className="text-slate-400">Nenhum material de divulgação geral adicionado.</p>
              </div>
            )}
          </div>
        )}

        {(filter === 'all' || filter === 'artist') && (
          <div>
            <h3 className="text-xl font-semibold text-sky-400 mb-4">Mídia dos Artistas</h3>
            {artistItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {artistItems.map(item => {
                    const artist = artists.find(a => a.id === item.artistId);
                    return <MediaCard key={item.id} item={item} artist={artist} onDelete={handleDeleteMediaItem} />
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-900 rounded-lg border-t border-slate-700">
                <p className="text-slate-400">Nenhuma mídia de artista adicionada.</p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default MediaHub;