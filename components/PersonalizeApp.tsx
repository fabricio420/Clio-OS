import React, { useRef, useState } from 'react';
import { ImageIcon, StickyNoteIcon, UploadCloudIcon, BarChartIcon, UsersIcon, RadioIcon } from './icons';
import type { GadgetType } from '../types';

interface PersonalizeAppProps {
    currentWallpaper: string;
    onSetWallpaper: (imageUrl: string) => void;
    onResetWallpaper: () => void;
    handleAddGadget: (type: GadgetType) => void;
    wallpapers: { name: string; url: string; }[];
}

const WallpaperThumbnail: React.FC<{ url: string; name: string; onClick: () => void; isActive: boolean; }> = ({ url, name, onClick, isActive }) => (
    <button
        onClick={onClick}
        className={`rounded-lg overflow-hidden border-2 transition-all duration-200 aspect-video flex items-center justify-center ${isActive ? 'border-lime-400 ring-2 ring-lime-400/50' : 'border-slate-700 hover:border-sky-500'}`}
        title={name}
    >
        <img src={url} alt={name} className="w-full h-full object-cover" />
    </button>
);


const fileToBase64 = (file: File): Promise<string> => 
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-3 text-sm font-semibold transition-colors ${
            isActive
                ? 'text-lime-400 border-b-2 border-lime-400'
                : 'text-slate-400 hover:text-white border-b-2 border-transparent'
        }`}
    >
        {label}
    </button>
);

const GadgetPreviewCard: React.FC<{ title: string; onAdd: () => void; children: React.ReactNode }> = ({ title, onAdd, children }) => (
    <div className="bg-slate-800 rounded-lg p-4 flex flex-col items-center gap-4 border border-slate-700">
        <div className="w-48 h-32 bg-slate-900 rounded-md flex items-center justify-center overflow-hidden">
            {children}
        </div>
        <h3 className="font-semibold text-white">{title}</h3>
        <button
            onClick={onAdd}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
        >
            Adicionar
        </button>
    </div>
);


const PersonalizeApp: React.FC<PersonalizeAppProps> = ({ currentWallpaper, onSetWallpaper, onResetWallpaper, handleAddGadget, wallpapers }) => {
    const [activeTab, setActiveTab] = useState<'wallpaper' | 'gadgets'>('wallpaper');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>('');
    
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) { // 5MB Limit
            setError('A imagem é muito grande. O limite é de 5MB.');
            return;
        }

        setError('');
        try {
            const base64 = await fileToBase64(file);
            onSetWallpaper(base64);
        } catch (e) {
            setError('Falha ao processar a imagem. Tente outra.');
            console.error(e);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const previewStyle = { backgroundImage: `url(${currentWallpaper})` };
        
    return (
        <div className="h-full flex flex-col bg-slate-900 text-white">
            <header className="flex-shrink-0 border-b border-slate-700 flex items-center px-4">
                <TabButton label="Área de Trabalho" isActive={activeTab === 'wallpaper'} onClick={() => setActiveTab('wallpaper')} />
                <TabButton label="Gadgets" isActive={activeTab === 'gadgets'} onClick={() => setActiveTab('gadgets')} />
            </header>

            <main className="flex-1 overflow-y-auto">
                {activeTab === 'wallpaper' && (
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-lime-400 mb-2">Papel de Parede</h2>
                        <p className="text-slate-400 mb-6 max-w-2xl">
                            Altere a aparência da sua área de trabalho. Escolha uma imagem da galeria, envie a sua própria ou restaure para o padrão.
                        </p>

                        <h3 className="text-lg font-semibold text-white mb-3">Pré-visualização</h3>
                        <div 
                            className="w-full max-w-2xl h-64 rounded-lg bg-cover bg-center mb-6 border-2 border-slate-700 shadow-lg"
                            style={previewStyle}
                            aria-label="Pré-visualização do papel de parede"
                        ></div>
                        
                        <h3 className="text-lg font-semibold text-white mb-3">Galeria</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl mb-6">
                            {wallpapers.map(wp => (
                                <WallpaperThumbnail
                                    key={wp.url}
                                    url={wp.url}
                                    name={wp.name}
                                    isActive={currentWallpaper === wp.url}
                                    onClick={() => onSetWallpaper(wp.url)}
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-red-400 bg-red-900/50 p-3 rounded-md mb-6 w-full max-w-2xl">{error}</p>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl pt-6 border-t border-slate-700">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/gif, image/webp"
                                className="hidden"
                            />
                            <button
                                onClick={triggerFileSelect}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
                            >
                                <ImageIcon className="h-5 w-5" />
                                Carregar Nova Imagem
                            </button>
                            <button
                                onClick={onResetWallpaper}
                                className="flex-1 py-3 px-6 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-md transition"
                            >
                                Restaurar Padrão
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-4 max-w-2xl">Tamanho máximo do arquivo: 5MB.</p>
                    </div>
                )}
                
                {activeTab === 'gadgets' && (
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-lime-400 mb-2">Adicionar Gadgets</h2>
                        <p className="text-slate-400 mb-8">
                            Personalize sua área de trabalho com ferramentas úteis. Arraste-os para onde quiser.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <GadgetPreviewCard title="Relógio Analógico" onAdd={() => handleAddGadget('analog_clock')}>
                                <div className="w-20 h-20 rounded-full bg-slate-700 border-2 border-slate-500 relative">
                                    <div className="absolute top-1/2 left-1/2 w-0.5 h-6 bg-white -translate-x-1/2 -translate-y-full origin-bottom" style={{ transform: 'translateX(-50%) translateY(-100%) rotate(45deg)'}}></div>
                                    <div className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-white -translate-x-1/2 -translate-y-full origin-bottom" style={{ transform: 'translateX(-50%) translateY(-100%) rotate(180deg)'}}></div>
                                </div>
                            </GadgetPreviewCard>
                            <GadgetPreviewCard title="Contagem Regressiva" onAdd={() => handleAddGadget('countdown')}>
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-lime-400">15</div>
                                        <div className="text-xs text-slate-400">dias</div>
                                    </div>
                                    <div className="text-2xl font-bold text-lime-400">:</div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-lime-400">10</div>
                                        <div className="text-xs text-slate-400">horas</div>
                                    </div>
                                </div>
                            </GadgetPreviewCard>
                            <GadgetPreviewCard title="Notas Rápidas" onAdd={() => handleAddGadget('quick_note')}>
                                <div className="p-4 bg-yellow-300/20 w-full h-full flex flex-col items-center justify-center">
                                    <StickyNoteIcon className="w-10 h-10 text-yellow-400 mb-2"/>
                                    <p className="text-xs text-slate-400">Sua nota aqui...</p>
                                </div>
                            </GadgetPreviewCard>
                             <GadgetPreviewCard title="Resumo Financeiro" onAdd={() => handleAddGadget('financial_summary')}>
                                <div className="p-4 bg-emerald-500/20 w-full h-full flex flex-col items-center justify-center">
                                    <BarChartIcon className="w-10 h-10 text-emerald-400 mb-2"/>
                                    <p className="text-xs text-slate-400">Visão rápida das finanças.</p>
                                </div>
                            </GadgetPreviewCard>
                            <GadgetPreviewCard title="Status da Equipe" onAdd={() => handleAddGadget('team_status')}>
                                <div className="p-4 bg-teal-500/20 w-full h-full flex flex-col items-center justify-center">
                                    <UsersIcon className="w-10 h-10 text-teal-400 mb-2"/>
                                    <p className="text-xs text-slate-400 text-center">Veja o que a equipe está fazendo.</p>
                                </div>
                            </GadgetPreviewCard>
                            <GadgetPreviewCard title="Rádio Clio" onAdd={() => handleAddGadget('radio_clio')}>
                                <div className="p-4 bg-rose-500/20 w-full h-full flex flex-col items-center justify-center">
                                    <RadioIcon className="w-10 h-10 text-rose-400 mb-2"/>
                                    <p className="text-xs text-slate-400 text-center">Player de música do coletivo.</p>
                                </div>
                            </GadgetPreviewCard>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PersonalizeApp;