import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { EventInfoData, ScheduleItem } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, MoonIcon, BellIcon, ClockIcon } from './icons';

interface ControlCenterProps {
    isOpen: boolean;
    onClose: () => void;
    eventInfo?: EventInfoData;
    schedule?: ScheduleItem[];
}

const getBrazilDate = () => {
    const now = new Date();
    return new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
};

const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

const ControlButton: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <div className="flex flex-col items-center space-y-2">
        <button
            onClick={onClick}
            className={`w-14 h-14 flex items-center justify-center rounded-full transition-colors duration-200 ease-in-out ${active ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            aria-pressed={active}
            aria-label={label}
        >
            {icon}
        </button>
        <span className="text-xs text-slate-300 font-medium">{label}</span>
    </div>
);

const ControlCenter: React.FC<ControlCenterProps> = ({ 
    isOpen, 
    onClose, 
    eventInfo, 
    schedule = [],
}) => {
    const eventDateObj = useMemo(() => eventInfo?.eventDate ? new Date(eventInfo.eventDate) : null, [eventInfo?.eventDate]);

    const [currentDate, setCurrentDate] = useState(getBrazilDate());
    const [selectedDate, setSelectedDate] = useState(eventDateObj || getBrazilDate());
    const [doNotDisturb, setDoNotDisturb] = useState(false);
    const [notificationsActive, setNotificationsActive] = useState(true);

    const touchStartY = useRef<number | null>(null);
    const touchEndY = useRef<number | null>(null);
    const minSwipeDistance = 50;

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.targetTouches[0].clientY;
        touchEndY.current = null;
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndY.current = e.targetTouches[0].clientY;
    };
    const handleTouchEnd = () => {
        if (!touchStartY.current || !touchEndY.current) return;
        const distance = touchStartY.current - touchEndY.current;
        const isSwipeUp = distance > minSwipeDistance;

        if (isSwipeUp) {
            onClose();
        }
        touchStartY.current = null;
        touchEndY.current = null;
    };

    useEffect(() => {
        if (isOpen) {
            const nowBrazil = getBrazilDate();
            const initialDate = eventDateObj || nowBrazil;
            setCurrentDate(initialDate);
            setSelectedDate(initialDate);
        }
    }, [isOpen, eventDateObj]);

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    const calendarDays = useMemo(() => {
        const days = [];
        const startingDay = firstDayOfMonth.getDay(); // 0 for Sunday
        for (let i = 0; i < startingDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
        }
        
        const todayBrazil = getBrazilDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            
            const isToday = isSameDay(date, todayBrazil);
            const isSelected = isSameDay(date, selectedDate);
            const isEventDay = eventDateObj && isSameDay(date, eventDateObj);

            let dayClasses = "w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors text-sm relative ";
            if (isSelected) {
                dayClasses += "bg-lime-500 text-slate-900 font-bold";
            } else if (isToday) {
                dayClasses += "bg-blue-500 text-white";
            } else {
                dayClasses += "hover:bg-slate-600 text-slate-200";
            }
            days.push(
                <button key={day} onClick={() => setSelectedDate(date)} className={dayClasses} aria-label={`Select date ${day}`}>
                    {day}
                    {isEventDay && <span className="absolute bottom-1 w-1.5 h-1.5 bg-lime-400 rounded-full"></span>}
                </button>
            );
        }
        return days;
    }, [currentDate, selectedDate, eventDateObj]);
    
    const selectedDaySchedule = useMemo(() => {
        if (!eventDateObj || !isSameDay(selectedDate, eventDateObj)) return [];
        return [...schedule].sort((a,b) => a.time.localeCompare(b.time));
    }, [selectedDate, eventDateObj, schedule]);


    const handleMonthChange = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    return (
        <div 
            className={`fixed inset-0 z-40 pt-9 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Centro de Controle"
        >
            <div 
                 className={`relative max-w-sm w-full mx-auto bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 ease-out ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
                 onClick={(e) => e.stopPropagation()}
                 onTouchStart={handleTouchStart}
                 onTouchMove={handleTouchMove}
                 onTouchEnd={handleTouchEnd}
            >
                <div className="p-4 flex justify-around items-start border-b border-slate-700/50">
                    <ControlButton icon={<MoonIcon className="w-6 h-6"/>} label="Não Perturbar" active={doNotDisturb} onClick={() => setDoNotDisturb(p => !p)} />
                    <ControlButton icon={<BellIcon className="w-6 h-6"/>} label="Notificações" active={notificationsActive} onClick={() => setNotificationsActive(p => !p)} />
                </div>

                
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => handleMonthChange(-1)} className="p-2 rounded-full hover:bg-slate-700"><ChevronLeftIcon className="w-5 h-5" /></button>
                        <h3 className="font-semibold text-white capitalize">{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h3>
                        <button onClick={() => handleMonthChange(1)} className="p-2 rounded-full hover:bg-slate-700"><ChevronRightIcon className="w-5 h-5" /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-y-2 text-center text-xs text-slate-400 mb-2">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <div key={d}>{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-y-2 place-items-center">
                        {calendarDays}
                    </div>
                </div>
                
                <div className="border-t border-slate-700/50 p-4 max-h-52 overflow-y-auto">
                    <h4 className="font-semibold mb-3 text-white">
                        Agenda para {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                    </h4>
                    {selectedDaySchedule.length > 0 ? (
                        <ul className="space-y-3">
                            {selectedDaySchedule.map(item => (
                                <li key={item.id} className="flex items-start space-x-3 text-sm">
                                    <ClockIcon className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-slate-200"><span className="font-semibold">{item.time}</span> - {item.title}</p>
                                        <p className="text-xs text-slate-400">Resp: {item.responsible}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-slate-400 text-center py-4">Nenhum evento para esta data.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ControlCenter;