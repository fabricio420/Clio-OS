
import React, { useEffect } from 'react';
import { CheckSquareIcon, InfoIcon, XIcon } from './icons';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColors = {
    success: 'bg-slate-800 border-l-4 border-lime-500',
    error: 'bg-slate-800 border-l-4 border-red-500',
    info: 'bg-slate-800 border-l-4 border-sky-500',
  };

  const icons = {
    success: <CheckSquareIcon className="w-5 h-5 text-lime-400" />,
    error: <XIcon className="w-5 h-5 text-red-400" />,
    info: <InfoIcon className="w-5 h-5 text-sky-400" />,
  };

  return (
    <div className={`flex items-center p-4 rounded shadow-2xl min-w-[300px] transform transition-all duration-300 animate-in slide-in-from-right-10 ${bgColors[type]}`}>
      <div className="mr-3">
        {icons[type]}
      </div>
      <div className="flex-1 text-sm text-white font-medium">
        {message}
      </div>
      <button onClick={onClose} className="ml-3 text-slate-400 hover:text-white">
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
