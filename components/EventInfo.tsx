import React from 'react';
import type { EventInfoData, Artist } from '../types';
import { MapPinIcon, CalendarIcon } from './icons';
import Header from './Header';

interface EventInfoProps {
  onOpenModal: (view: 'info', data: EventInfoData) => void;
  eventInfo: EventInfoData;
  artists: Artist[];
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={`bg-slate-900 p-6 rounded-lg shadow-md border-t border-lime-400 ${className}`}>
    <h3 className="text-xl font-semibold mb-4 text-lime-400">{title}</h3>
    {children}
  </div>
);

const ProgressBar: React.FC<{ value: number; max: number; }> = ({ value, max }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-300">Progresso</span>
                <span className="text-sm font-medium text-slate-300">{value} / {max}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className="bg-lime-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    )
}

const EventInfo: React.FC<EventInfoProps> = ({ onOpenModal, eventInfo, artists }) => {
  const confirmedArtists = artists.length;
  const subtitle = `Organizado por ${eventInfo.collectiveName}` + (eventInfo.isCollab && eventInfo.collabDescription ? ` · ${eventInfo.collabDescription}` : '');

  return (
    <div className="h-full flex flex-col">
       <Header
        title={eventInfo.eventName}
        subtitle={subtitle}
        action={
          <button
            onClick={() => onOpenModal('info', eventInfo)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Editar Informações
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <InfoCard title="Descrição do Evento" className="lg:col-span-2">
            <p className="text-slate-300 whitespace-pre-wrap">{eventInfo.description || 'Nenhuma descrição fornecida.'}</p>
          </InfoCard>

          <InfoCard title="Meta de Artistas">
              <p className="text-slate-400 text-sm mb-4">Acompanhe a meta de artistas confirmados para o evento.</p>
              <ProgressBar value={confirmedArtists} max={eventInfo.artistGoal} />
          </InfoCard>

          <InfoCard title="Localização e Data">
              <div className="flex items-start space-x-4">
                  <MapPinIcon className="h-8 w-8 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                      <p className="font-bold text-slate-100">{eventInfo.venueName || 'Local não definido'}</p>
                      <p className="text-slate-300 text-sm">{eventInfo.venueAddress || 'Endereço não fornecido'}</p>
                  </div>
              </div>
              <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-slate-700">
                  <CalendarIcon className="h-6 w-6 text-blue-400 flex-shrink-0" />
                  <div>
                      <p className="font-bold text-slate-100">{eventInfo.eventDate ? new Date(eventInfo.eventDate).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Data não definida'}</p>
                      <p className="text-slate-300 text-sm">{eventInfo.eventDate ? `Às ${new Date(eventInfo.eventDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : ''}</p>
                  </div>
              </div>
          </InfoCard>

          <InfoCard title="Detalhes Adicionais" className="lg:col-span-2">
            <ul className="space-y-3 text-slate-300">
                  {eventInfo.isCollab && eventInfo.collabDescription && (
                      <li className="flex items-center">
                          <span className="w-3 h-3 mr-3 rounded-full bg-sky-400"></span>
                          <strong>Colaboração:</strong>
                          <span className="ml-2">{eventInfo.collabDescription}</span>
                      </li>
                  )}
                  <li className="flex items-center">
                      <span className={`w-3 h-3 mr-3 rounded-full ${eventInfo.hasAwards ? 'bg-lime-400' : 'bg-red-400'}`}></span>
                      <strong>Premiação:</strong>
                      <span className="ml-2">{eventInfo.hasAwards ? `Sim` : 'Não haverá'}</span>
                  </li>
                  {eventInfo.hasAwards && (
                      <li className="pl-6 text-sm text-slate-400 border-l-2 border-slate-700 ml-1.5">
                        {eventInfo.awardsDescription || 'Detalhes da premiação não fornecidos.'}
                      </li>
                  )}
            </ul>
          </InfoCard>

          <InfoCard title="Tipos de Arte" className="lg:col-span-3">
              <div className="flex flex-wrap gap-2">
                  {eventInfo.artTypes.length > 0 ? eventInfo.artTypes.map((type, index) => (
                      <span key={index} className="bg-slate-700 text-lime-300 text-xs font-medium px-2.5 py-1 rounded-full">{type}</span>
                  )) : <p className="text-slate-400">Nenhum tipo de arte especificado.</p>}
              </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default EventInfo;