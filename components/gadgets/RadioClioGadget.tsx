
import React from 'react';
import type { Track } from '../../types';
import { MusicIcon, PlayIcon, PauseIcon } from '../icons';

interface RadioClioGadgetProps {
    playlist: Track[];
    currentTrackIndex: number;
    isPlaying: boolean;
    onPlayPause: () => void;
}

const RadioClioGadget: React.FC<RadioClioGadgetProps> = ({
    playlist,
    currentTrackIndex,
    isPlaying,
    onPlayPause,
}) => {
    const currentTrack = playlist[currentTrackIndex];

    return (
        <div className="w-full max-w-[240px] text-center mx-auto">
            <div className="w-32 h-32 mx-auto bg-slate-800 rounded-xl shadow-lg overflow-hidden flex items-center justify-center mb-3 relative group">
                {currentTrack?.artwork ? (
                    <img src={currentTrack.artwork} alt={currentTrack.name} className="w-full h-full object-cover" />
                ) : (
                    <MusicIcon className="w-12 h-12 text-slate-500" />
                )}
                {/* Touch overlay for quick play/pause on cover */}
                <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/0 active:bg-black/20 transition-colors cursor-pointer"
                    onClick={onPlayPause}
                >
                </div>
            </div>
            <div className="px-2">
                <h3 className="font-bold text-white truncate text-sm leading-tight" title={currentTrack?.name}>
                    {currentTrack?.name || 'Player Clio'}
                </h3>
                <p className="text-xs text-slate-400 truncate mt-1">{currentTrack?.artist || '...'}</p>
            </div>
            <div className="flex items-center justify-center mt-3 pb-1">
                <button
                    onClick={onPlayPause}
                    disabled={playlist.length === 0}
                    className="w-12 h-12 flex items-center justify-center bg-lime-500 active:bg-lime-600 rounded-full text-slate-900 disabled:bg-slate-600 disabled:text-slate-400 transition-transform active:scale-95 shadow-lg"
                    aria-label={isPlaying ? 'Pausar' : 'Tocar'}
                >
                    {isPlaying ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6 ml-1"/>}
                </button>
            </div>
        </div>
    );
};

export default RadioClioGadget;
