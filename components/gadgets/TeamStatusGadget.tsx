import React from 'react';
import { useAppContext } from '../../contexts/AppContext';

const TeamStatusGadget: React.FC = () => {
    const { members, teamStatuses } = useAppContext();

    return (
        <div className="w-64 text-left p-2">
            <h3 className="text-sm text-slate-300 font-semibold mb-3">Status da Equipe</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {members.map(member => {
                    const status = teamStatuses.find(s => s.memberId === member.id)?.status;
                    return (
                        <div key={member.id} className="flex items-center space-x-2">
                            <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{member.name}</p>
                                <p className="text-xs text-lime-300 italic truncate" title={status || 'Sem status'}>
                                    {status || 'Sem status'}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamStatusGadget;