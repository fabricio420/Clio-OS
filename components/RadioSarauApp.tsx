import React, { useState } from 'react';
import type { Track } from '../types';
import Header from './Header';
import { PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon, PlusIcon, XIcon } from './icons';
import { FormInput } from './forms/FormElements';

interface RadioSarauAppProps {
    playlist: Track[];
    currentTrackIndex: number;
    isPlaying: boolean;
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    onAddTrack: (track: Track) => void;
    onRemoveTrack: (index: number) => void;
}

const RadioSarauApp: React.FC<RadioSarauAppProps> = ({
    playlist = [],
    currentTrackIndex,
    isPlaying,
    onPlayPause,
    onNext,
    onPrev,
    onAddTrack,
    onRemoveTrack
}) => {
    const [newTrack, setNewTrack] = useState({ name: '', artist: '', url: '' });
    const currentTrack = playlist[currentTrackIndex];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTrack({ ...newTrack, [e.target.name]: e.target.value });
    };

    const handleAddTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTrack.name && newTrack.artist && newTrack.url) {
            onAddTrack(newTrack);
            setNewTrack({ name: '', artist: '', url: '' });
        }
    };
    
    return (
        <div className="h-full flex flex-col text-white">
            <Header
                title="Rádio Sarau"
                subtitle="A playlist colaborativa do coletivo."
            />
            <div className="flex-1 flex flex-col lg:flex-row gap-6 px-4 md:px-8 pb-8 overflow-hidden">
                {/* Player and Add Form */}
                <div className="lg:w-1/3 flex flex-col gap-6">
                    <div className="bg-slate-900 rounded-lg p-6 text-center border-t border-lime-400">
                        <h3 className="text-lg font-semibold text-slate-400 mb-2">Tocando Agora</h3>
                        <p className="text-2xl font-bold text-white truncate h-8" title={currentTrack?.name}>{currentTrack?.name || 'Silêncio'}</p>
                        <p className="text-lime-300 h-6">{currentTrack?.artist || 'Adicione uma música para começar'}</p>
                        <div className="flex items-center justify-center space-x-6 my-6">
                            <button onClick={onPrev} disabled={!currentTrack} className="text-slate-300 hover:text-white disabled:opacity-50"><SkipBackIcon className="w-6 h-6"/></button>
                            <button onClick={onPlayPause} disabled={!currentTrack} className="w-16 h-16 flex items-center justify-center bg-lime-500 hover:bg-lime-600 rounded-full text-slate-900 disabled:bg-slate-600 disabled:text-slate-400 transition-transform transform hover:scale-110">
                                {isPlaying ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8"/>}
                            </button>
                            <button onClick={onNext} disabled={!currentTrack} className="text-slate-300 hover:text-white disabled:opacity-50"><SkipForwardIcon className="w-6 h-6"/></button>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-lg p-6 border-t border-sky-400">
                         <h3 className="text-xl font-semibold text-sky-400 mb-4">Adicionar Música</h3>
                         <form onSubmit={handleAddTrack} className="space-y-4">
                            <FormInput label="Nome da Música" name="name" value={newTrack.name} onChange={handleInputChange} required />
                            <FormInput label="Artista" name="artist" value={newTrack.artist} onChange={handleInputChange} required />
                            <FormInput label="URL do MP3" name="url" type="url" value={newTrack.url} onChange={handleInputChange} required />
                             <button type="submit" className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">
                                <PlusIcon className="w-5 h-5" />
                                <span>Adicionar à Playlist</span>
                            </button>
                         </form>
                    </div>
                </div>

                {/* Playlist */}
                <div className="lg:w-2/3 bg-slate-900 rounded-lg p-6 border-t border-lime-400 flex flex-col">
                    <h3 className="text-xl font-semibold text-lime-400 mb-4 flex-shrink-0">Fila de Reprodução</h3>
                    <div className="flex-1 overflow-y-auto pr-2">
                        {playlist.length > 0 ? (
                            <ul className="space-y-2">
                                {playlist.map((track, index) => (
                                    <li 
                                        key={index}
                                        className={`p-3 rounded-md flex justify-between items-center group transition-colors ${index === currentTrackIndex ? 'bg-blue-600/50' : 'hover:bg-slate-800'}`}
                                    >
                                        <div>
                                            <p className={`font-semibold ${index === currentTrackIndex ? 'text-lime-300' : 'text-slate-100'}`}>{track.name}</p>
                                            <p className="text-sm text-slate-400">{track.artist}</p>
                                        </div>
                                        <button onClick={() => onRemoveTrack(index)} className="p-1 text-red-400 hover:bg-slate-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                            <XIcon className="w-5 h-5" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">
                                <p>A playlist está vazia. Adicione a primeira música!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RadioSarauApp;
