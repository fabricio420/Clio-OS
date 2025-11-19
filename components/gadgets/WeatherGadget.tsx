
import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { SunIcon, CloudIcon, CloudRainIcon, WindIcon } from '../icons';

const WeatherGadget: React.FC = () => {
    const { eventInfo } = useAppContext();
    
    // Mock weather state
    const [currentTemp, setCurrentTemp] = useState(24);
    const [condition, setCondition] = useState<'sunny' | 'cloudy' | 'rainy'>('sunny');
    
    useEffect(() => {
        // Simulate data fetching on mount
        const randomTemp = Math.floor(Math.random() * (32 - 18 + 1)) + 18;
        setCurrentTemp(randomTemp);
        const conditions: ('sunny' | 'cloudy' | 'rainy')[] = ['sunny', 'sunny', 'cloudy', 'rainy'];
        setCondition(conditions[Math.floor(Math.random() * conditions.length)]);
    }, []);

    const eventForecast = useMemo(() => {
        if (!eventInfo.eventDate) return null;
        
        const today = new Date();
        const eventDate = new Date(eventInfo.eventDate);
        const diffTime = eventDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return { text: "Evento Finalizado", alert: false };
        if (diffDays > 5) return { text: "Previsão indisponível", alert: false };
        
        // Random forecast for the event day based on simple hash of the date string
        const dateHash = eventInfo.eventDate.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        const willRain = dateHash % 3 === 0; // 33% chance of rain for demo
        
        if (diffDays === 0) {
             return { 
                 text: willRain ? "Chuva prevista para hoje!" : "Céu limpo hoje!",
                 alert: willRain
             };
        }
        
        return {
            text: willRain ? `Chuva prevista para o evento` : `Sol previsto para o evento`,
            alert: willRain
        };

    }, [eventInfo.eventDate]);

    const getIcon = () => {
        switch(condition) {
            case 'rainy': return <CloudRainIcon className="w-10 h-10 text-white animate-pulse" />;
            case 'cloudy': return <CloudIcon className="w-10 h-10 text-white animate-pulse" />;
            default: return <SunIcon className="w-10 h-10 text-yellow-300 animate-[spin_10s_linear_infinite]" />;
        }
    };

    const getBackground = () => {
         switch(condition) {
            case 'rainy': return 'bg-gradient-to-br from-slate-700 to-slate-600';
            case 'cloudy': return 'bg-gradient-to-br from-slate-500 to-slate-400';
            default: return 'bg-gradient-to-br from-blue-400 to-blue-300';
        }
    }

    return (
        <div className={`w-64 p-4 rounded-xl text-white shadow-lg ${getBackground()} transition-all duration-500`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-80">Agora</p>
                    <p className="text-4xl font-bold">{currentTemp}°</p>
                    <p className="text-sm opacity-90 flex items-center gap-1">
                         <WindIcon className="w-3 h-3" />
                         {condition === 'sunny' ? 'Ensolarado' : condition === 'cloudy' ? 'Nublado' : 'Chuvoso'}
                    </p>
                </div>
                <div className="pt-1">
                    {getIcon()}
                </div>
            </div>
            
            {eventForecast && (
                <div className={`mt-2 p-2 rounded-lg text-center text-xs font-bold ${eventForecast.alert ? 'bg-red-500/90 text-white animate-pulse' : 'bg-white/20 text-white'}`}>
                    {eventForecast.alert && <span className="mr-1">⚠️</span>}
                    {eventForecast.text}
                </div>
            )}
             <div className="mt-2 text-[10px] opacity-70 text-center">
                Local do Evento (Simulado)
            </div>
        </div>
    );
};

export default WeatherGadget;
