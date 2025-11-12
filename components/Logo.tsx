
import React from 'react';
import { GlobeIcon } from './icons';

const Logo = () => {
  return (
    <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-700">
        <GlobeIcon className="w-16 h-16 text-sky-400" />
    </div>
  );
};

export default Logo;
