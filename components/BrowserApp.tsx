import React, { useState, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, RefreshCwIcon, InfoIcon } from './icons';

const BrowserApp: React.FC = () => {
    const [urlInput, setUrlInput] = useState<string>('https://wikipedia.org');
    const [iframeSrc, setIframeSrc] = useState<string>('https://wikipedia.org');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const sanitizeUrl = (url: string): string => {
        if (!url.trim()) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://${url}`;
    };

    const handleGo = (e: React.FormEvent) => {
        e.preventDefault();
        const sanitized = sanitizeUrl(urlInput);
        if (sanitized) {
            setIframeSrc(sanitized);
        }
    };
    
    const handleReload = () => {
        if(iframeRef.current) {
            iframeRef.current.src = iframeSrc;
        }
    };

    const handleBack = () => {
       // Not possible due to cross-origin security restrictions
    };
    
    const handleForward = () => {
       // Not possible due to cross-origin security restrictions
    };

    return (
        <div className="h-full flex flex-col bg-slate-900 text-white">
            <header className="flex-shrink-0 bg-slate-800 p-2 border-b border-slate-700 flex items-center gap-2">
                <button title="Voltar (indisponível)" className="p-2 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-transparent" disabled><ChevronLeftIcon className="w-5 h-5"/></button>
                <button title="Avançar (indisponível)" className="p-2 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-transparent" disabled><ChevronRightIcon className="w-5 h-5"/></button>
                <button onClick={handleReload} title="Recarregar" className="p-2 rounded-md hover:bg-slate-700"><RefreshCwIcon className="w-5 h-5"/></button>
                <form onSubmit={handleGo} className="flex-grow">
                    <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Digite uma URL e pressione Enter"
                        className="w-full bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </form>
            </header>
            <main className="flex-1 bg-slate-950 relative">
                 <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 p-2 bg-slate-800/80 rounded-lg text-xs text-slate-400 flex items-center gap-2">
                    <InfoIcon className="w-4 h-4 text-sky-400"/>
                    <span>Alguns sites (Google, redes sociais, etc.) podem não carregar por restrições de segurança.</span>
                </div>
                <iframe
                    ref={iframeRef}
                    src={iframeSrc}
                    title="Navegador"
                    className="w-full h-full border-none bg-white"
                    sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
                    onError={() => console.error(`Erro ao carregar: ${iframeSrc}`)}
                ></iframe>
            </main>
        </div>
    );
};

export default BrowserApp;
