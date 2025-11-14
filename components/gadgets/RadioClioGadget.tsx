import React from 'react';
import type { Track } from '../../types';
import { MusicIcon, Volume2Icon, VolumeXIcon } from '../icons';

interface RadioClioGadgetProps {
    playlist: Track[];
    currentTrackIndex: number;
    isMuted: boolean;
    onMuteToggle: () => void;
}

const RadioClioGadget: React.FC<RadioClioGadgetProps> = ({
    playlist,
    currentTrackIndex,
    isMuted,
    onMuteToggle,
}) => {
    const currentTrack = playlist[currentTrackIndex];

    return (
        <div className="w-56 text-center">
            <div className="w-40 h-40 mx-auto bg-slate-800 rounded-lg shadow-lg overflow-hidden flex items-center justify-center mb-3">
                {currentTrack?.artwork ? (
                    <img src={currentTrack.artwork} alt={currentTrack.name} className="w-full h-full object-cover" />
                ) : (
                    <MusicIcon className="w-16 h-16 text-slate-500" />
                )}
            </div>
            <div>
                <h3 className="font-bold text-white truncate text-sm" title={currentTrack?.name}>
                    {currentTrack?.name || 'Rádio Clio'}
                </h3>
                <p className="text-xs text-slate-400 truncate">{currentTrack?.artist || '...'}</p>
            </div>
            <div className="flex items-center justify-center space-x-4 mt-3">
                <button
                    onClick={onMuteToggle}
                    disabled={playlist.length === 0}
                    className="w-10 h-10 flex items-center justify-center bg-lime-500 hover:bg-lime-600 rounded-full text-slate-900 disabled:bg-slate-600 disabled:text-slate-400 transition-transform transform hover:scale-105"
                    aria-label={isMuted ? 'Ativar Som' : 'Desativar Som'}
                >
                    {isMuted ? <VolumeXIcon className="w-6 h-6"/> : <Volume2Icon className="w-6 h-6"/>}
                </button>
            </div>
        </div>
    );
};

export default RadioClioGadget;