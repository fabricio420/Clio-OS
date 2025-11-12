import React, { useState, useMemo, memo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import type { ModalView, PhotoAlbum, Photo } from '../types';
import { PlusIcon, ChevronLeftIcon, ImageIcon, XIcon, ChevronRightIcon } from './icons';
import Header from './Header';

// --- Lightbox Component ---
const Lightbox: React.FC<{
    photos: Photo[];
    startIndex: number;
    onClose: () => void;
}> = ({ photos, startIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };
    
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [photos.length]);

    const photo = photos[currentIndex];
    if (!photo) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={onClose}>
            <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl z-10"><XIcon className="w-8 h-8"/></button>
            <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="absolute left-4 p-2 bg-white/10 rounded-full hover:bg-white/20"><ChevronLeftIcon className="w-8 h-8 text-white"/></button>
            <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="absolute right-4 p-2 bg-white/10 rounded-full hover:bg-white/20"><ChevronRightIcon className="w-8 h-8 text-white"/></button>
            
            <div className="relative" onClick={(e) => e.stopPropagation()}>
                <img src={photo.dataUrl} alt={photo.caption} className="max-h-[90vh] max-w-[90vw] object-contain"/>
                {photo.caption && <p className="text-center text-white mt-2 bg-black/50 p-2 rounded-b-lg">{photo.caption}</p>}
            </div>
        </div>
    );
};


// --- Album View ---
const AlbumCard: React.FC<{ album: PhotoAlbum; onClick: () => void }> = memo(({ album, onClick }) => (
    <button onClick={onClick} className="bg-slate-900 rounded-lg shadow-md w-full text-left group overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 border-t border-lime-400">
        <div className="h-40 bg-slate-800 flex items-center justify-center overflow-hidden">
            {album.photos.length > 0 ? (
                <img src={album.photos[0].dataUrl} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
                <ImageIcon className="w-16 h-16 text-slate-500" />
            )}
        </div>
        <div className="p-4">
            <h3 className="text-lg font-bold text-white truncate">{album.name}</h3>
            <p className="text-sm text-slate-400">{album.photos.length} foto(s)</p>
        </div>
    </button>
));

// --- Photo View ---
const PhotoCard: React.FC<{ photo: Photo; onClick: () => void; onDelete: (photoId: string) => void; }> = memo(({ photo, onClick, onDelete }) => (
    <div className="relative group aspect-square">
        <button onClick={onClick} className="w-full h-full bg-slate-900 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500">
            <img src={photo.dataUrl} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </button>
        <button
            onClick={(e) => {
                e.stopPropagation();
                onDelete(photo.id);
            }}
            className="absolute top-1 right-1 z-10 p-1 bg-black/50 rounded-full text-white hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Excluir foto"
        >
            <XIcon className="w-4 h-4" />
        </button>
    </div>
));


const PhotoGalleryApp: React.FC<{
  onOpenModal: (view: ModalView, data?: any) => void;
}> = ({ onOpenModal }) => {
    const { photoAlbums, handleDeletePhoto } = useAppContext();
    const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
    const [lightboxState, setLightboxState] = useState<{ isOpen: boolean; startIndex: number }>({ isOpen: false, startIndex: 0 });

    const selectedAlbum = useMemo(() => photoAlbums.find(a => a.id === selectedAlbumId), [photoAlbums, selectedAlbumId]);

    const handlePhotoClick = (index: number) => {
        setLightboxState({ isOpen: true, startIndex: index });
    };

    // --- RENDER LOGIC ---
    if (selectedAlbum) {
        const handleConfirmDelete = (photoId: string) => {
            if (window.confirm('Tem certeza que deseja excluir esta foto? A ação não pode ser desfeita.')) {
                handleDeletePhoto(selectedAlbum.id, photoId);
            }
        };

        return (
            <div className="h-full flex flex-col">
                 {lightboxState.isOpen && (
                    <Lightbox
                        photos={selectedAlbum.photos}
                        startIndex={lightboxState.startIndex}
                        onClose={() => setLightboxState({ isOpen: false, startIndex: 0 })}
                    />
                )}
                <header className="flex-shrink-0 px-4 md:px-8 pt-6 mb-6">
                    <button onClick={() => setSelectedAlbumId(null)} className="flex items-center space-x-2 text-sm text-sky-400 hover:text-sky-300 mb-2">
                        <ChevronLeftIcon className="h-4 w-4" />
                        <span>Voltar para todos os álbuns</span>
                    </button>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-white">{selectedAlbum.name}</h2>
                            <p className="text-slate-400">{selectedAlbum.description}</p>
                        </div>
                        <button
                            onClick={() => onOpenModal('photo', { albumId: selectedAlbum.id })}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition self-start sm:self-center"
                        >
                            <PlusIcon className="h-5 w-5" />
                            <span>Adicionar Fotos</span>
                        </button>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8">
                    {selectedAlbum.photos.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {selectedAlbum.photos.map((photo, index) => (
                                <PhotoCard 
                                    key={photo.id}
                                    photo={photo}
                                    onClick={() => handlePhotoClick(index)}
                                    onDelete={handleConfirmDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-slate-900 rounded-lg border-t border-slate-700">
                            <p className="text-slate-400 text-lg">Este álbum está vazio.</p>
                            <p className="text-sm mt-2">Clique em "Adicionar Fotos" para começar.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <Header
                title="Galeria de Fotos"
                subtitle="Álbuns de recordações dos seus eventos."
                action={
                    <button
                        onClick={() => onOpenModal('photo_album')}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span>Novo Álbum</span>
                    </button>
                }
            />
             <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8">
                {photoAlbums.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {photoAlbums.map(album => (
                            <AlbumCard key={album.id} album={album} onClick={() => setSelectedAlbumId(album.id)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-slate-900 rounded-lg border-t border-slate-700">
                        <p className="text-slate-400 text-lg">Nenhum álbum de fotos criado.</p>
                        <p className="text-sm mt-2">Clique em "Novo Álbum" para criar seu primeiro.</p>
                    </div>
                )}
             </div>
        </div>
    );
};

export default PhotoGalleryApp;