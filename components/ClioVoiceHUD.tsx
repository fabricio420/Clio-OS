
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MicIcon, XIcon, SparklesIcon, CheckSquareIcon, WalletIcon, CalendarIcon } from './icons';
import { useAppContext } from '../contexts/AppContext';

// --- TYPES FOR SPEECH RECOGNITION ---
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface ClioVoiceHUDProps {
  isOpen: boolean;
  onClose: () => void;
  actions: {
    createTask: (title: string, dueDate?: string) => void;
    createTransaction: (description: string, amount: number, type: 'income' | 'expense') => void;
    addToSchedule: (title: string, time: string) => void;
    navigate: (view: string) => void;
  };
}

const ClioVoiceHUD: React.FC<ClioVoiceHUDProps> = ({ isOpen, onClose, actions }) => {
  const [status, setStatus] = useState<'listening' | 'processing' | 'success' | 'error' | 'idle'>('idle');
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('Salve! Como posso ajudar o coletivo hoje?');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const requestRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // --- GEMINI SETUP ---
  const processCommandWithGemini = async (text: string) => {
    setStatus('processing');
    setFeedback('Processando seu pedido...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Define Tools (Function Declarations)
      const tools = [
        {
          functionDeclarations: [
            {
              name: "createTask",
              description: "Cria uma nova tarefa ou atividade to-do.",
              parameters: {
                type: "OBJECT",
                properties: {
                  title: { type: "STRING", description: "O título ou descrição da tarefa" },
                  dueDate: { type: "STRING", description: "Data de vencimento em formato YYYY-MM-DD (hoje é " + new Date().toISOString().split('T')[0] + ")" }
                },
                required: ["title"]
              }
            },
            {
              name: "createTransaction",
              description: "Registra uma movimentação financeira (gasto, despesa, compra, venda, receita).",
              parameters: {
                type: "OBJECT",
                properties: {
                  description: { type: "STRING", description: "Descrição do item (ex: Cerveja, Cabos)" },
                  amount: { type: "NUMBER", description: "Valor em reais" },
                  type: { type: "STRING", description: "'income' para entrada/receita ou 'expense' para saída/gasto/despesa" }
                },
                required: ["description", "amount", "type"]
              }
            },
            {
              name: "addToSchedule",
              description: "Adiciona um item ao cronograma/roteiro do evento.",
              parameters: {
                type: "OBJECT",
                properties: {
                  title: { type: "STRING", description: "Título da atração ou atividade" },
                  time: { type: "STRING", description: "Horário no formato HH:MM" }
                },
                required: ["title", "time"]
              }
            },
            {
              name: "navigate",
              description: "Navega para uma área específica do app.",
              parameters: {
                type: "OBJECT",
                properties: {
                  view: { type: "STRING", description: "Nome da área: 'dashboard', 'tasks', 'schedule', 'finances', 'team', 'inventory'" }
                },
                required: ["view"]
              }
            }
          ]
        }
      ];

      const model = ai.models.getGenerativeModel({
        model: "gemini-2.5-flash",
        tools: tools,
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: `Contexto: Você é a Clio, IA de um coletivo cultural. Hoje é ${new Date().toLocaleDateString()}. Usuário disse: "${text}"` }] }]
      });

      const call = result.functionCalls()?.[0];

      if (call) {
        const args = call.args as any;
        
        if (call.name === 'createTask') {
            actions.createTask(args.title, args.dueDate);
            setFeedback(`Tarefa "${args.title}" criada!`);
        } else if (call.name === 'createTransaction') {
            actions.createTransaction(args.description, args.amount, args.type);
            setFeedback(`${args.type === 'income' ? 'Receita' : 'Despesa'} de R$${args.amount} registrada!`);
        } else if (call.name === 'addToSchedule') {
            actions.addToSchedule(args.title, args.time);
            setFeedback(`Adicionado ao cronograma às ${args.time}.`);
        } else if (call.name === 'navigate') {
            actions.navigate(args.view);
            setFeedback(`Navegando para ${args.view}...`);
            setTimeout(onClose, 1500);
        }
        
        setStatus('success');
        // Reset after success
        setTimeout(() => {
            if(status !== 'idle') {
                setStatus('idle');
                setTranscript('');
                setFeedback('Diga "Salve Clio" ou faça outro pedido.');
                startListening(); // Restart listening
            }
        }, 3000);

      } else {
        setFeedback(result.response.text() || "Entendi, mas não precisei executar nenhuma ação no sistema.");
        setStatus('idle');
      }

    } catch (error) {
      console.error(error);
      setStatus('error');
      setFeedback("Desculpe, tive um erro de conexão.");
    }
  };

  // --- AUDIO VISUALIZATION ---
  const startVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      drawWave();
    } catch (err) {
      console.error("Error accessing microphone for visualizer", err);
    }
  };

  const stopVisualizer = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    if (sourceRef.current) sourceRef.current.disconnect();
    if (analyserRef.current) analyserRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
    audioContextRef.current = null;
  };

  const drawWave = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Center circle pulse based on volume
    const average = dataArray.reduce((a, b) => a + b) / bufferLength;
    const scale = 1 + (average / 256) * 1.5;

    // Draw Dynamic Waves
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    
    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2; // Amplitude scaling
        
        // Creating a symmetrical wave from center
        const x = (i / bufferLength) * width;
        
        // Mirror effect for visual symmetry
        if(i === 0) ctx.moveTo(width/2 + x, height/2 - y/4);
        
        // Complex wave drawing logic for "tech" look
        // Using sine wave modulation combined with frequency data
        const cpX = width/2 + Math.cos(i * 0.5) * (i * 2); 
        const cpY = height/2 + Math.sin(Date.now() / 1000 + i) * (average * 2);
        
        ctx.lineTo(x, height/2 + (dataArray[i] * 0.8) * Math.sin(i * 0.2 + Date.now()/200));
    }
    
    ctx.strokeStyle = '#a3e635'; // Lime-400
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#a3e635';
    ctx.stroke();

    // Secondary wave (Cyan)
    ctx.beginPath();
    for (let i = 0; i < bufferLength; i++) {
         const x = (i / bufferLength) * width;
         ctx.lineTo(x, height/2 - (dataArray[i] * 0.5) * Math.cos(i * 0.3 + Date.now()/300));
    }
    ctx.strokeStyle = '#38bdf8'; // Sky-400
    ctx.stroke();
    
    requestRef.current = requestAnimationFrame(drawWave);
  };

  // --- SPEECH RECOGNITION ---
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        setFeedback("Seu navegador não suporta reconhecimento de voz.");
        return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'pt-BR';
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onstart = () => {
        setStatus('listening');
        startVisualizer();
    };

    recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultTranscript = event.results[current][0].transcript;
        setTranscript(resultTranscript);
    };

    recognitionRef.current.onend = () => {
        stopVisualizer();
        if (transcript) {
            processCommandWithGemini(transcript);
        } else {
            setStatus('idle');
        }
    };

    recognitionRef.current.onerror = (event: any) => {
        console.error(event.error);
        setStatus('error');
        stopVisualizer();
    };

    recognitionRef.current.start();
  };

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setStatus('idle');
      setFeedback('Diga "Salve Clio" para começar...');
      // Auto-start listening when opened
      setTimeout(startListening, 500);
    } else {
        if (recognitionRef.current) recognitionRef.current.stop();
        stopVisualizer();
    }
    return () => {
        stopVisualizer();
    };
  }, [isOpen]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-xl transition-opacity duration-500">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors">
            <XIcon className="w-10 h-10" />
        </button>

        {/* Visualizer Container */}
        <div className="relative w-full max-w-3xl h-96 flex items-center justify-center">
            <canvas ref={canvasRef} width={800} height={400} className="absolute inset-0 w-full h-full" />
            
            {/* Central Icon */}
            <div className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                status === 'listening' ? 'bg-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.5)] scale-110' : 
                status === 'processing' ? 'bg-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.5)] animate-pulse' :
                status === 'success' ? 'bg-lime-500/20 shadow-[0_0_50px_rgba(163,230,53,0.5)]' :
                'bg-slate-700/50'
            }`}>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                     status === 'listening' ? 'bg-red-500 text-white' : 
                     status === 'processing' ? 'bg-blue-500 text-white' :
                     status === 'success' ? 'bg-lime-500 text-slate-900' :
                     'bg-slate-700 text-slate-300'
                }`}>
                    {status === 'processing' ? <SparklesIcon className="w-12 h-12 animate-spin" /> : <MicIcon className="w-12 h-12" />}
                </div>
            </div>
        </div>

        {/* Text Feedback */}
        <div className="mt-8 text-center px-4 space-y-4 max-w-2xl">
            <p className={`text-2xl font-light transition-all duration-300 ${transcript ? 'text-white scale-105' : 'text-slate-500'}`}>
                {transcript || "..."}
            </p>
            <p className={`text-lg font-semibold ${
                status === 'error' ? 'text-red-400' : 
                status === 'success' ? 'text-lime-400' : 
                'text-sky-400'
            }`}>
                {feedback}
            </p>
        </div>

        {/* Hints */}
        {status === 'idle' && (
             <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-500 opacity-70">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                    <CheckSquareIcon className="w-4 h-4" />
                    "Cria uma tarefa: Comprar gelo"
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                    <WalletIcon className="w-4 h-4" />
                    "Gastei 50 reais no Uber"
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                    <CalendarIcon className="w-4 h-4" />
                    "Show da banda às 20h"
                </div>
             </div>
        )}
    </div>
  );
};

export default ClioVoiceHUD;
