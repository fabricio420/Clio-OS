
import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import ClioPulseToast from './ClioPulseToast';

const ClioPulseContainer: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    // We only render if there are notifications
    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] w-[350px] h-[200px] pointer-events-none flex flex-col items-end justify-end">
            <div className="relative w-full h-full pointer-events-auto">
                {notifications.map((note, index) => (
                    <ClioPulseToast
                        key={note.id}
                        notification={note}
                        index={index}
                        onClose={removeNotification}
                    />
                ))}
            </div>
        </div>
    );
};

export default ClioPulseContainer;
