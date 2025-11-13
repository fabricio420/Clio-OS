import React from 'react';
import type { Track } from '../types';
import { PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon, MusicIcon, Volume2Icon, VolumeXIcon } from './icons';

interface RadioClioAppProps {
    playlist: Track[];
    currentTrackIndex: number;
    isPlaying: boolean;
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    progress: number;
    duration: number;
    volume: number;
    onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const RadioClioApp: React.FC<RadioClioAppProps> = ({
    playlist = [],
    currentTrackIndex,
    isPlaying,
    onPlayPause,
    onNext,
    onPrev,
    progress,
    duration,
    volume,
    onSeek,
    onVolumeChange,
}) => {
    const currentTrack = playlist[currentTrackIndex];

    return (
        <div className="h-full w-full flex flex-col lg:flex-row text-white bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
            
            {/* Main Player Pane */}
            <main className="w-full lg:w-2/3 flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-sm flex flex-col items-center">
                    {/* Artwork */}
                    <div className="w-64 h-64 lg:w-80 lg:h-80 flex-shrink-0 bg-slate-800 rounded-lg shadow-2xl overflow-hidden flex items-center justify-center mb-6">
                        {currentTrack?.artwork ? (
                            <img src={currentTrack.artwork} alt={currentTrack.name} className="w-full h-full object-cover" />
                        ) : (
                            <MusicIcon className="w-24 h-24 text-slate-500" />
                        )}
                    </div>

                    {/* Track Info */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white truncate" title={currentTrack?.name}>
                            {currentTrack?.name || 'Rádio Clio'}
                        </h2>
                        <p className="text-xl text-slate-300 mt-1">
                            {currentTrack?.artist || 'Silêncio...'}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full mt-6">
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={progress}
                            onChange={onSeek}
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                            disabled={!currentTrack}
                            aria-label="Barra de progresso da música"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                            <span>{formatTime(progress)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex items-center justify-center space-x-8 mt-4">
                        <button onClick={onPrev} disabled={playlist.length === 0} className="text-slate-300 hover:text-white disabled:opacity-50 transition-colors">
                            <SkipBackIcon className="w-8 h-8"/>
                        </button>
                        <button 
                            onClick={onPlayPause} 
                            disabled={playlist.length === 0} 
                            className="w-20 h-20 flex items-center justify-center bg-lime-500 hover:bg-lime-600 rounded-full text-slate-900 disabled:bg-slate-600 disabled:text-slate-400 transition-transform transform hover:scale-105 shadow-lg"
                            aria-label={isPlaying ? 'Pausar' : 'Tocar'}
                        >
                            {isPlaying ? <PauseIcon className="w-10 h-10"/> : <PlayIcon className="w-10 h-10 ml-1"/>}
                        </button>
                        <button onClick={onNext} disabled={playlist.length === 0} className="text-slate-300 hover:text-white disabled:opacity-50 transition-colors">
                            <SkipForwardIcon className="w-8 h-8"/>
                        </button>
                    </div>

                     {/* Volume Control */}
                    <div className="w-full max-w-xs mt-6 flex items-center gap-3">
                        <button onClick={() => onVolumeChange({ target: { value: volume === 0 ? '0.75' : '0' } } as any)} className="text-slate-400 hover:text-white">
                           {volume === 0 ? <VolumeXIcon className="w-5 h-5"/> : <Volume2Icon className="w-5 h-5"/>}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={onVolumeChange}
                            className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                            aria-label="Controle de volume"
                        />
                    </div>
                </div>
            </main>
            
            {/* "Up Next" Pane */}
            <aside className="w-full lg:w-1/3 lg:max-w-sm bg-black/20 backdrop-blur-md border-l-0 lg:border-l border-white/10 flex flex-col h-1/3 lg:h-full">
                <h3 className="flex-shrink-0 p-4 font-semibold text-lg border-b border-white/10">
                    Próximo na Fila
                </h3>
                <ul className="overflow-y-auto flex-1 p-2 space-y-1">
                    {playlist.length > 0 ? (
                        playlist.map((track, index) => (
                            <li 
                                key={index}
                                className={`p-2 rounded-lg flex items-center space-x-4 transition-colors ${index === currentTrackIndex ? 'bg-white/10' : 'bg-transparent'}`}
                            >
                                <img src={track.artwork} alt={track.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0"/>
                                <div className="min-w-0">
                                    <p className={`font-semibold truncate ${index === currentTrackIndex ? 'text-lime-300' : 'text-slate-100'}`}>
                                        {track.name}
                                    </p>
                                    <p className="text-sm text-slate-400 truncate">{track.artist}</p>
                                </div>
                            </li>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            <p>A playlist está vazia.</p>
                        </div>
                    )}
                </ul>
            </aside>
        </div>
    );
};

export default RadioClioApp;