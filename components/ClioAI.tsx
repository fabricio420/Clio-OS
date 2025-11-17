
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MicIcon, RefreshCwIcon } from './icons';
import type { ModalView } from '../types';

interface ClioAIProps {
    activeView: ModalView | null;
    onDataReceived: (data: any) => void;
}

// Prompts do sistema ajustados para o contexto de um Sarau Cultural
const SYSTEM_PROMPTS: Record<string, string> = {
    task: `Você é um assistente de produção cultural. Extraia os detalhes da tarefa do áudio. Retorne JSON: { "title": string (resumo curto), "description": string (detalhes completos), "dueDate": string (formato YYYY-MM-DD) }. Se não houver data, não inclua o campo.`,
    
    schedule: `Você é um assistente de palco. Extraia itens do cronograma do sarau. Retorne JSON: { "time": string (HH:MM), "title": string, "description": string, "responsible": string }.`,
    
    artist: `Você é um curador artístico. Extraia dados do artista. Retorne JSON: { "name": string, "performanceType": string (ex: Poesia, Música, Performance), "contact": string (email), "notes": string, "instagram": string (com @), "whatsapp": string }.`,
    
    inventory: `Você é um produtor logístico. Extraia itens de inventário. Retorne JSON: { "name": string, "quantity": number }.`,
    
    transaction: `Você é um tesoureiro de coletivo. Extraia dados financeiros. Retorne JSON: { "description": string, "amount": number, "category": string (ex: Alimentação, Transporte, Cachê), "date": string (YYYY-MM-DD) }.`,
    
    info: `Você é o organizador do evento. Extraia informações gerais. Retorne JSON: { "eventName": string, "description": string, "venueName": string, "venueAddress": string, "eventDate": string (ISO format), "artistGoal": number }.`,
    
    default: `Extraia as informações principais em um objeto JSON plano.`
};

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result?.toString().split(',')[1] || '');
        reader.readAsDataURL(blob);
    });
};

const ClioAI: React.FC<ClioAIProps> = ({ activeView, onDataReceived }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    // Só mostra o assistente se um formulário compatível estiver aberto
    if (!activeView || !['task', 'schedule', 'artist', 'inventory', 'transaction', 'info'].includes(activeView)) {
        return null;
    }

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                await processAudio(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Erro ao acessar microfone. Verifique as permissões.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const processAudio = async (audioBlob: Blob) => {
        setIsProcessing(true);
        try {
            const base64Audio = await blobToBase64(audioBlob);
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = SYSTEM_PROMPTS[activeView || 'default'] || SYSTEM_PROMPTS['default'];
            const model = 'gemini-2.5-flash';

            const response = await ai.models.generateContent({
                model: model,
                contents: {
                    parts: [
                        { inlineData: { mimeType: 'audio/webm', data: base64Audio } },
                        { text: `Listen to the audio request strictly based on this context: ${prompt}. Return ONLY raw JSON, no markdown formatting.` }
                    ]
                },
                config: {
                    responseMimeType: "application/json"
                }
            });

            const text = response.text;
            if (text) {
                const json = JSON.parse(text);
                onDataReceived(json);
            }

        } catch (error) {
            console.error("AI Processing Error:", error);
            alert("Não foi possível processar o áudio. Tente falar mais perto do microfone.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed bottom-24 right-4 z-[70] flex flex-col items-end space-y-2">
            {isRecording && (
                <div className="bg-red-500 text-white px-4 py-2 rounded-full animate-pulse shadow-lg text-sm font-bold">
                    Gravando... (Fale os dados)
                </div>
            )}
            {isProcessing && (
                <div className="bg-blue-500 text-white px-4 py-2 rounded-full animate-bounce shadow-lg text-sm font-bold flex items-center gap-2">
                    <RefreshCwIcon className="w-4 h-4 animate-spin" />
                    Processando IA...
                </div>
            )}
            
            <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 border-2 border-white/20 ${
                    isRecording 
                    ? 'bg-red-600 text-white ring-4 ring-red-400/50 scale-110' 
                    : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Preencher com Voz (IA)"
            >
                {isRecording ? <div className="w-5 h-5 bg-white rounded-sm" /> : <MicIcon className="w-7 h-7" />}
            </button>
        </div>
    );
};

export default ClioAI;
