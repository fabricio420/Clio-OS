import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useCountdown } from '../../hooks/useCountdown';

const CountdownGadget: React.FC = () => {
    const { eventInfo } = useAppContext();
    const countdown = useCountdown(eventInfo.eventDate);

    return (
        <div className="w-full md:w-64 text-center">
            <h3 className="text-sm text-slate-300 font-semibold mb-2 truncate" title={eventInfo.eventName}>
                Contagem para {eventInfo.eventName}
            </h3>
            <div className="flex justify-center items-center space-x-3 text-white">
                {Object.entries(countdown).map(([unit, value]) => (
                    <div key={unit} className="flex flex-col items-center">
                        <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-lime-400 to-sky-400">
                            {String(value).padStart(2, '0')}
                        </span>
                        <span className="text-xs text-slate-400 uppercase tracking-widest">{unit}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CountdownGadget;