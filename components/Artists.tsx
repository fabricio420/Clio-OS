import React, { useState, memo } from 'react';
import type { Artist } from '../types';
import { MicIcon, PlusIcon, MoreVerticalIcon, WhatsappIcon, InstagramIcon } from './icons';

interface ArtistsProps {
  onOpenModal: (view: 'artist', data?: Artist) => void;
  artists: Artist[];
  handleDeleteArtist: (artistId: string) => void;
}

const ArtistCard: React.FC<{
  artist: Artist;
  onEdit: (artist: Artist) => void;
  onDelete: (artistId: string) => void;
}> = memo(({ artist, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-slate-800 rounded-lg shadow-md p-6 border-l-4 border-lime-500 relative flex flex-col">
      <div className="absolute top-4 right-4">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-400 hover:text-white">
          <MoreVerticalIcon className="h-5 w-5" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-700 rounded-md shadow-lg z-10">
            <button onClick={() => { onEdit(artist); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">Editar</button>
            <button onClick={() => { onDelete(artist.id); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700">Excluir</button>
          </div>
        )}
      </div>
       <div className="flex-grow">
        <div className="flex items-center space-x-4 mb-4">
          <MicIcon className="h-8 w-8 text-lime-400" />
          <div>
            <h3 className="text-xl font-bold text-white">{artist.name}</h3>
            <p className="text-sm text-lime-300">{artist.performanceType}</p>
          </div>
        </div>
        <p className="text-slate-300 text-sm mb-4">{artist.notes}</p>
      </div>
      <div className="border-t border-slate-700 pt-3 text-xs text-slate-400 space-y-2">
        <div>
          <strong>Email:</strong> {artist.contact}
        </div>
        <div className="flex items-center justify-between">
            {artist.whatsapp && (
                <a href={`https://wa.me/${artist.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:text-lime-400">
                    <WhatsappIcon className="h-4 w-4" />
                    <span>{artist.whatsapp}</span>
                </a>
            )}
            {artist.instagram && (
                <a href={`https://instagram.com/${artist.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:text-lime-400">
                    <InstagramIcon className="h-4 w-4" />
                    <span>{artist.instagram}</span>
                </a>
            )}
        </div>
      </div>
    </div>
  );
});


const Artists: React.FC<ArtistsProps> = ({ onOpenModal, artists, handleDeleteArtist }) => {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Artistas e Participantes</h2>
        <button 
          onClick={() => onOpenModal('artist')}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Novo Artista</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map(artist => (
          <ArtistCard 
            key={artist.id}
            artist={artist}
            onEdit={(artistToEdit) => onOpenModal('artist', artistToEdit)}
            onDelete={handleDeleteArtist}
          />
        ))}
         {artists.length === 0 && (
          <div className="col-span-full bg-slate-800 rounded-lg p-6 text-center text-slate-400">
            Nenhum artista cadastrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default Artists;