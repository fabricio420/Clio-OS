import React from 'react';
import type { Member } from '../types';

export const AvatarViewer: React.FC<{ member: Member | null }> = ({ member }) => {
    if (!member) return null;
    return (
        <div className="flex flex-col items-center text-center">
            <img
                src={member.avatar}
                alt={member.name}
                className="w-48 h-48 rounded-full object-cover border-4 border-slate-600 mb-4"
            />
            <h3 className="text-2xl font-bold text-white">{member.name}</h3>
            <p className="text-md text-sky-400">{member.role}</p>
        </div>
    );
};

export default AvatarViewer;