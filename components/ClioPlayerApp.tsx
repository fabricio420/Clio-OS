
import React from 'react';
import type { Track } from '../types';
import { MusicIcon, PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon } from './icons';

interface ClioPlayerAppProps {
    playlist: Track[];
    currentTrackIndex: number;
    isPlaying: boolean;
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    progress: number;
    duration: number;
    onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSeekMouseDown: () => void;
    onSeekMouseUp: () => void;
    onSelectTrack: (index: number) => void;
}

const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const ClioPlayerApp: React.FC<ClioPlayerAppProps> = ({
    playlist = [],
    currentTrackIndex,
    isPlaying,
    onPlayPause,
    onNext,
    onPrev,
    progress,
    duration,
    onSeek,
    onSeekMouseDown,
    onSeekMouseUp,
    onSelectTrack
}) => {
    const currentTrack = playlist[currentTrackIndex];

    return (
        <div className="h-full w-full flex flex-col lg:flex-row text-white bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
            
            {/* Main Player Pane */}
            <main className="flex-shrink-0 lg:flex-1 lg:h-full flex flex-col items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-md flex flex-col items-center">
                    {/* Artwork */}
                    <div className="w-64 h-64 lg:w-80 lg:h-80 flex-shrink-0 bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center mb-8 border border-white/10">
                        {currentTrack?.artwork ? (
                            <img src={currentTrack.artwork} alt={currentTrack.name} className="w-full h-full object-cover" />
                        ) : (
                            <MusicIcon className="w-24 h-24 text-slate-500" />
                        )}
                    </div>

                    {/* Track Info */}
                    <div className="text-center w-full px-4 mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-white truncate" title={currentTrack?.name}>
                            {currentTrack?.name || 'Player Clio'}
                        </h2>
                        <p className="text-lg text-slate-400 mt-2 truncate">
                            {currentTrack?.artist || 'Nenhuma faixa selecionada'}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full mb-6 px-4">
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={progress}
                            onInput={onSeek} // More responsive for visual feedback
                            onChange={onSeek} // Final value on release
                            onMouseDown={onSeekMouseDown}
                            onTouchStart={onSeekMouseDown}
                            onMouseUp={onSeekMouseUp}
                            onTouchEnd={onSeekMouseUp}
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-lime-400 [&::-webkit-slider-thumb]:rounded-full transition-all hover:[&::-webkit-slider-thumb]:scale-125"
                            style={{ touchAction: 'none' }} // Prevents page scroll on mobile
                            aria-label="Barra de progresso da música"
                            disabled={!currentTrack}
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                            <span>{formatTime(progress)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex items-center justify-center space-x-10">
                         <button onClick={onPrev} disabled={playlist.length === 0} className="p-2 text-slate-300 hover:text-white disabled:opacity-30 transition-transform hover:scale-110"><SkipBackIcon className="w-8 h-8"/></button>
                        <button 
                            onClick={onPlayPause} 
                            disabled={playlist.length === 0} 
                            className="w-16 h-16 flex items-center justify-center bg-lime-500 hover:bg-lime-400 rounded-full text-slate-900 disabled:bg-slate-600 disabled:text-slate-400 transition-all transform hover:scale-105 shadow-lg shadow-lime-500/20"
                            aria-label={isPlaying ? 'Pausar' : 'Tocar'}
                        >
                            {isPlaying ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8 ml-1"/>}
                        </button>
                        <button onClick={onNext} disabled={playlist.length === 0} className="p-2 text-slate-300 hover:text-white disabled:opacity-30 transition-transform hover:scale-110"><SkipForwardIcon className="w-8 h-8"/></button>
                    </div>
                </div>
            </main>
            
            {/* Playlist Pane */}
            <aside className="flex-1 lg:flex-none lg:w-96 bg-black/20 backdrop-blur-md border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col h-full min-h-0 overflow-hidden">
                <h3 className="flex-shrink-0 p-5 font-bold text-lg border-b border-white/10 text-white/90 flex items-center gap-2">
                    <span className="w-1 h-5 bg-lime-500 rounded-full"></span>
                    Fila de Reprodução
                </h3>
                <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                    {playlist.length > 0 ? (
                        playlist.map((track, index) => {
                            const isActive = index === currentTrackIndex;
                            return (
                                <button
                                    key={index}
                                    onClick={() => onSelectTrack(index)}
                                    className={`w-full text-left p-3 rounded-xl flex items-center space-x-4 transition-all group ${isActive ? 'bg-white/10 border border-white/5 shadow-inner' : 'bg-transparent hover:bg-white/5 border border-transparent'}`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <img src={track.artwork} alt={track.name} className={`w-12 h-12 rounded-lg object-cover ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}/>
                                        {isActive && isPlaying && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                                                <div className="w-3 h-3 bg-lime-400 rounded-full animate-pulse"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className={`font-semibold truncate text-sm ${isActive ? 'text-lime-400' : 'text-slate-200'}`}>
                                            {track.name}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate mt-0.5">{track.artist}</p>
                                    </div>
                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-lime-500 mr-2"></div>}
                                </button>
                            )
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-500 space-y-2">
                            <MusicIcon className="w-8 h-8 opacity-50"/>
                            <p className="text-sm">A playlist está vazia.</p>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
};

export default ClioPlayerApp;
