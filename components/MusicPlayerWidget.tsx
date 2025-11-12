import React from 'react';
import type { Track } from '../types';
import { PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon, Volume2Icon, VolumeXIcon, PlusIcon } from './icons';

interface MusicPlayerWidgetProps {
    isOpen: boolean;
    onClose: () => void;
    playlist: Track[];
    currentTrackIndex: number;
    isPlaying: boolean;
    volume: number;
    progress: number;
    duration: number;
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    onSelectTrack: (index: number) => void;
    onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onLoadFile: () => void;
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const MusicPlayerWidget: React.FC<MusicPlayerWidgetProps> = (props) => {
    const { isOpen, playlist, currentTrackIndex, isPlaying, volume, progress, duration, onPlayPause, onNext, onPrev, onSelectTrack, onSeek, onVolumeChange, onLoadFile } = props;
    const currentTrack = playlist[currentTrackIndex];
    const isMuted = volume === 0;

    if (!isOpen) return null;

    return (
        <div 
            className="fixed top-9 right-4 z-40 w-80 max-w-[90vw] bg-slate-800/60 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 text-white transition-all duration-300 ease-out"
            role="dialog"
            aria-modal="true"
            aria-label="Music Player"
        >
            <div className="p-4">
                <div className="text-center mb-4">
                    <h3 className="font-bold text-lg truncate">{currentTrack?.name || 'Nenhuma música'}</h3>
                    <p className="text-sm text-slate-400">{currentTrack?.artist || 'Carregue um arquivo MP3'}</p>
                </div>

                <div className="space-y-2 mb-4">
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={progress}
                        onChange={onSeek}
                        className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-lime-400 [&::-webkit-slider-thumb]:rounded-full"
                        disabled={!currentTrack}
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
                
                <div className="flex items-center justify-center space-x-6 mb-4">
                    <button onClick={onPrev} disabled={!currentTrack} className="text-slate-300 hover:text-white disabled:opacity-50"><SkipBackIcon className="w-6 h-6"/></button>
                    <button onClick={onPlayPause} disabled={!currentTrack} className="w-14 h-14 flex items-center justify-center bg-lime-500 hover:bg-lime-600 rounded-full text-slate-900 disabled:bg-slate-600 disabled:text-slate-400">
                        {isPlaying ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8"/>}
                    </button>
                    <button onClick={onNext} disabled={!currentTrack} className="text-slate-300 hover:text-white disabled:opacity-50"><SkipForwardIcon className="w-6 h-6"/></button>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={() => onVolumeChange({ target: { value: isMuted ? '0.75' : '0' } } as any)} className="text-slate-400 hover:text-white">
                        {isMuted ? <VolumeXIcon className="w-5 h-5"/> : <Volume2Icon className="w-5 h-5"/>}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={onVolumeChange}
                        className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    />
                </div>
            </div>

            <div className="border-t border-slate-700/50 max-h-48 overflow-y-auto">
                {playlist.length > 0 ? (
                    <ul className="p-2 space-y-1">
                        {playlist.map((track, index) => (
                            <li key={index}>
                                <button 
                                    onClick={() => onSelectTrack(index)}
                                    className={`w-full text-left p-2 rounded-md transition-colors text-sm ${index === currentTrackIndex ? 'bg-blue-600' : 'hover:bg-slate-700'}`}
                                >
                                    <p className="font-semibold truncate">{track.name}</p>
                                    <p className={`truncate ${index === currentTrackIndex ? 'text-slate-200' : 'text-slate-400'}`}>{track.artist}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-4 text-center text-slate-400 text-sm">A playlist está vazia.</div>
                )}
            </div>

            <div className="border-t border-slate-700/50 p-2">
                 <button 
                    onClick={onLoadFile}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-md transition text-sm">
                    <PlusIcon className="w-4 h-4" />
                    <span>Carregar MP3</span>
                </button>
            </div>
        </div>
    );
};

export default MusicPlayerWidget;