
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SparklesIcon, SearchIcon, GlobeIcon, ChevronRightIcon, RefreshCwIcon } from './icons';

interface Source {
    title: string;
    uri: string;
}

const AskClioApp: React.FC = () => {
    const [query, setQuery] = useState('');
    const [answer, setAnswer] = useState('');
    const [sources, setSources] = useState<Source[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const suggestions = [
        "Editais de cultura abertos em 2024",
        "Como organizar um sarau poético",
        "Ideias de decoração barata para eventos",
        "Modelos de contrato para artistas"
    ];

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setHasSearched(true);
        setError('');
        setAnswer('');
        setSources([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: query,
                config: {
                    tools: [{ googleSearch: {} }],
                },
            });

            const text = response.text;
            setAnswer(text || "Não consegui encontrar uma resposta para isso.");

            const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            const extractedSources: Source[] = [];
            
            if (chunks) {
                chunks.forEach((chunk: any) => {
                    if (chunk.web) {
                        extractedSources.push({
                            title: chunk.web.title,
                            uri: chunk.web.uri
                        });
                    }
                });
            }
            // Remove duplicates based on URI
            const uniqueSources = Array.from(new Map(extractedSources.map(item => [item.uri, item])).values());
            setSources(uniqueSources);

        } catch (err) {
            console.error("Error searching:", err);
            setError("Ocorreu um erro ao buscar. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        // Need to use a timeout or effect to trigger search after state update, 
        // but calling the logic directly with the new value is safer here.
        // However, handleSearch uses the state 'query'. 
        // Let's fix this by creating a dedicated function that takes the query string.
        searchWithQuery(suggestion);
    };

    const searchWithQuery = async (q: string) => {
        setQuery(q);
        setIsLoading(true);
        setHasSearched(true);
        setError('');
        setAnswer('');
        setSources([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: q,
                config: {
                    tools: [{ googleSearch: {} }],
                },
            });

            const text = response.text;
            setAnswer(text || "Não consegui encontrar uma resposta.");
            
            const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            const extractedSources: Source[] = [];
             if (chunks) {
                chunks.forEach((chunk: any) => {
                    if (chunk.web) {
                        extractedSources.push({
                            title: chunk.web.title,
                            uri: chunk.web.uri
                        });
                    }
                });
            }
            const uniqueSources = Array.from(new Map(extractedSources.map(item => [item.uri, item])).values());
            setSources(uniqueSources);

        } catch (err) {
            setError("Erro na busca.");
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="h-full flex flex-col bg-slate-900 text-white overflow-hidden">
            <div className={`flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-500 ${hasSearched ? '' : 'flex flex-col justify-center items-center'}`}>
                
                {/* Header / Logo Area */}
                <div className={`flex flex-col items-center mb-8 transition-all duration-500 ${hasSearched ? 'items-start mb-4' : 'scale-110'}`}>
                     <div className={`flex items-center gap-3 ${hasSearched ? 'flex-row' : 'flex-col'}`}>
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-purple-500/20">
                            <SparklesIcon className="w-8 h-8 text-white" />
                        </div>
                        <h1 className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 ${hasSearched ? 'text-2xl' : 'text-4xl mt-4'}`}>
                            Pergunte à Clio
                        </h1>
                     </div>
                     {!hasSearched && (
                         <p className="text-slate-400 mt-2 text-lg">Pesquisa inteligente para produtores culturais.</p>
                     )}
                </div>

                {/* Search Input */}
                <div className={`w-full max-w-3xl mx-auto transition-all duration-500 ${hasSearched ? 'mb-6' : 'mb-12'}`}>
                    <form onSubmit={handleSearch} className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchIcon className="h-6 w-6 text-slate-400" />
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Pergunte qualquer coisa..."
                            className="w-full bg-slate-800 text-white p-4 pl-12 pr-12 rounded-xl border border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-xl text-lg transition-all placeholder:text-slate-500"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !query.trim()}
                            className="absolute inset-y-2 right-2 bg-slate-700 hover:bg-purple-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-slate-700"
                        >
                            {isLoading ? <RefreshCwIcon className="w-5 h-5 animate-spin" /> : <ChevronRightIcon className="w-5 h-5" />}
                        </button>
                    </form>

                    {/* Suggestions */}
                    {!hasSearched && (
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSuggestionClick(s)}
                                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-4 py-2 rounded-full text-sm transition-colors"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Results Area */}
                {hasSearched && (
                    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
                        {isLoading ? (
                            <div className="space-y-4">
                                <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse"></div>
                                <div className="h-4 bg-slate-800 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-slate-800 rounded w-5/6 animate-pulse"></div>
                            </div>
                        ) : error ? (
                            <div className="text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-900/50 text-center">
                                {error}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Main Answer */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            <SparklesIcon className="w-5 h-5 text-purple-400" />
                                            Resposta
                                        </h2>
                                        <div className="prose prose-invert prose-lg text-slate-300 leading-relaxed whitespace-pre-wrap">
                                            {answer}
                                        </div>
                                    </div>
                                </div>

                                {/* Sources Sidebar */}
                                <div className="lg:col-span-1">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <GlobeIcon className="w-4 h-4" />
                                        Fontes
                                    </h3>
                                    <div className="space-y-3">
                                        {sources.length > 0 ? (
                                            sources.map((source, index) => (
                                                <a 
                                                    key={index} 
                                                    href={source.uri} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="block bg-slate-800 hover:bg-slate-700 p-3 rounded-lg border border-slate-700 hover:border-purple-500 transition-all group"
                                                >
                                                    <p className="text-sm font-medium text-slate-200 line-clamp-2 group-hover:text-purple-300 mb-1">
                                                        {source.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500 truncate">
                                                        {new URL(source.uri).hostname}
                                                    </p>
                                                </a>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-500 italic">Nenhuma fonte direta citada.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AskClioApp;
