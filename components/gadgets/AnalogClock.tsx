import React, { useState, useEffect } from 'react';

const AnalogClock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    // Calculate rotation degrees for each hand
    const secondHandRotation = (seconds / 60) * 360;
    const minuteHandRotation = ((minutes * 60 + seconds) / 3600) * 360;
    // The formula correctly handles 24-hour format for a 12-hour clock face
    const hourHandRotation = ((hours * 3600 + minutes * 60 + seconds) / 43200) * 360;

    return (
        <div className="w-40 h-40 rounded-full bg-slate-700/50 border-4 border-slate-600 relative flex items-center justify-center select-none">
            {/* Hour hand - height 3rem. Clock height is 10rem. Center is 5rem. Top = 5rem - 3rem = 2rem */}
            <div
                className="absolute w-1 bg-lime-400"
                style={{
                    height: '3rem',
                    top: '2rem',
                    left: '50%',
                    transformOrigin: 'bottom',
                    transform: `translateX(-50%) rotate(${hourHandRotation}deg)`,
                }}
            ></div>
            {/* Minute hand - height 4rem. Top = 5rem - 4rem = 1rem */}
            <div
                className="absolute w-0.5 bg-white"
                style={{
                    height: '4rem',
                    top: '1rem',
                    left: '50%',
                    transformOrigin: 'bottom',
                    transform: `translateX(-50%) rotate(${minuteHandRotation}deg)`,
                }}
            ></div>
            {/* Second hand - height 4rem. Top = 5rem - 4rem = 1rem */}
            <div
                className="absolute w-px bg-red-400"
                style={{
                    height: '4rem',
                    top: '1rem',
                    left: '50%',
                    transformOrigin: 'bottom',
                    transform: `translateX(-50%) rotate(${secondHandRotation}deg)`,
                }}
            ></div>
            {/* Center dot */}
            <div className="absolute w-2 h-2 bg-white rounded-full"></div>
        </div>
    );
};

export default AnalogClock;
