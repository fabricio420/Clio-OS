
import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { Member, AuditLog } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { FormInput } from './forms/FormElements';
import { ImageIcon, UploadCloudIcon, UserIcon, GlobeIcon, InstagramIcon, SparklesIcon, ShieldCheckIcon, LockIcon, MailIcon, CameraIcon, ActivityIcon, BadgeIcon, StarIcon, ClockIcon } from './icons';

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

// Extended interface for local storage data
interface ExtendedProfileData {
    bio: string;
    skills: string[];
    coverImage: string;
    instagram: string;
    portfolio: string;
}

interface ProfileAppProps {
    currentUser: Member;
    onSaveProfile: (updatedData: Partial<Member>) => void;
    onChangePassword: (currentPassword: string, newPassword: string) => { success: boolean, message: string };
}

export const ProfileApp: React.FC<ProfileAppProps> = ({ currentUser, onSaveProfile, onChangePassword }) => {
    const { eventInfo, auditLogs } = useAppContext();

    // Core Member Data
    const [name, setName] = useState(currentUser.name);
    const [role, setRole] = useState(currentUser.role);
    const [avatar, setAvatar] = useState(currentUser.avatar);
    
    // Extended Data (Local Storage based for now)
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState('');
    const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop'); 
    const [instagram, setInstagram] = useState('');
    const [portfolio, setPortfolio] = useState('');

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI State
    const [activeTab, setActiveTab] = useState<'identity' | 'journey' | 'security'>('identity');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    // Load extended data on mount
    useEffect(() => {
        const savedExtras = localStorage.getItem(`clio_profile_extras_${currentUser.id}`);
        if (savedExtras) {
            const parsed = JSON.parse(savedExtras) as ExtendedProfileData;
            setBio(parsed.bio || '');
            setSkills(parsed.skills || []);
            if(parsed.coverImage) setCoverImage(parsed.coverImage);
            setInstagram(parsed.instagram || '');
            setPortfolio(parsed.portfolio || '');
        }
    }, [currentUser.id]);

    // Save extended data whenever it changes
    useEffect(() => {
        const extras: ExtendedProfileData = { bio, skills, coverImage, instagram, portfolio };
        localStorage.setItem(`clio_profile_extras_${currentUser.id}`, JSON.stringify(extras));
    }, [bio, skills, coverImage, instagram, portfolio, currentUser.id]);

    // Filter and process logs for the timeline
    const userJourney = useMemo(() => {
        if (!auditLogs) return [];
        return auditLogs
            .filter(log => log.userId === currentUser.id)
            .slice(0, 20); // Limit to last 20 actions for clean UI
    }, [auditLogs, currentUser.id]);

    // Helper to "Poeticize" the logs
    const getPoeticEntry = (log: AuditLog) => {
        const actionMap: Record<string, { text: string, icon: React.ReactNode, color: string }> = {
            'CREATE': { text: 'Plantou uma semente em', icon: <SparklesIcon className="w-4 h-4"/>, color: 'text-lime-400' },
            'UPDATE': { text: 'Cuidou dos detalhes de', icon: <ActivityIcon className="w-4 h-4"/>, color: 'text-blue-400' },
            'DELETE': { text: 'Limpou o caminho removendo', icon: <ShieldCheckIcon className="w-4 h-4"/>, color: 'text-red-400' }
        };

        const base = actionMap[log.action] || { text: 'Interagiu com', icon: <ActivityIcon className="w-4 h-4"/>, color: 'text-slate-400' };
        
        return {
            ...base,
            title: `${base.text} ${log.entity}`,
            details: log.details
        };
    };

    // Handlers
    const handleAddSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newSkill.trim()) {
            e.preventDefault();
            if (!skills.includes(newSkill.trim())) {
                setSkills([...skills, newSkill.trim()]);
            }
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Imagem muito grande (max 5MB).' });
            return;
        }

        try {
            const base64 = await fileToBase64(file);
            if (type === 'avatar') {
                setAvatar(base64);
                onSaveProfile({ avatar: base64 }); 
            } else {
                setCoverImage(base64);
            }
            setMessage({ type: 'success', text: `${type === 'avatar' ? 'Foto de perfil' : 'Capa'} atualizada!` });
        } catch (err) {
            setMessage({ type: 'error', text: 'Erro ao processar imagem.' });
        }
    };

    const handleIdentitySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            onSaveProfile({ name, role }); 
            setMessage({ type: 'success', text: 'Identidade atualizada com sucesso!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao salvar.' });
        }
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Senhas não conferem.' });
            return;
        }
        const result = onChangePassword(currentPassword, newPassword);
        setMessage({ type: result.success ? 'success' : 'error', text: result.message });
        if(result.success) {
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        }
    };

    return (
        <div className="min-h-screen lg:h-full flex flex-col lg:flex-row bg-slate-950 relative overflow-y-auto lg:overflow-hidden">
             {/* Background Ambient Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-lime-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Left Column: The Clio ID Card */}
            <div className="w-full lg:w-5/12 xl:w-4/12 p-6 lg:p-10 flex flex-col items-center justify-center relative z-10 lg:overflow-y-auto">
                 <div className="w-full max-w-md relative group perspective-1000">
                    {/* Glass Card Container */}
                    <div className="relative bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] hover:border-white/20">
                        
                        {/* Cover Image */}
                        <div className="h-40 w-full relative bg-slate-800 overflow-hidden group-hover/cover">
                            <img src={coverImage} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                            <button 
                                onClick={() => coverInputRef.current?.click()}
                                className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70"
                                title="Alterar Capa"
                            >
                                <CameraIcon className="w-5 h-5" />
                            </button>
                            <input type="file" ref={coverInputRef} onChange={(e) => handleImageUpload(e, 'cover')} className="hidden" accept="image/*" />
                        </div>

                        {/* Avatar & Main Info */}
                        <div className="px-8 pb-8 relative -mt-16 flex flex-col items-center text-center">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl relative z-10">
                                    <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover border-4 border-slate-900" />
                                </div>
                                <button 
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="absolute bottom-2 right-2 p-2 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-500 transition-transform hover:scale-110 z-20"
                                    title="Alterar Avatar"
                                >
                                    <CameraIcon className="w-4 h-4" />
                                </button>
                                <input type="file" ref={avatarInputRef} onChange={(e) => handleImageUpload(e, 'avatar')} className="hidden" accept="image/*" />
                            </div>

                            <h2 className="text-3xl font-bold text-white mt-4 mb-1 tracking-tight">{name}</h2>
                            <div className="flex flex-col items-center gap-1 mb-4">
                                <p className="text-sky-400 font-medium text-sm uppercase tracking-wider">{role}</p>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-lime-300 font-medium">
                                    <BadgeIcon className="w-3 h-3" />
                                    <span>{eventInfo.collectiveName || 'Coletivo'}</span>
                                </div>
                            </div>

                            {/* Bio Section */}
                            <p className="text-slate-300 text-sm leading-relaxed mb-6 px-2 italic">
                                "{bio || "Escreva uma bio curta sobre você e sua função no coletivo..."}"
                            </p>

                            {/* Skills / Tags */}
                            <div className="flex flex-wrap justify-center gap-2 mb-8 w-full">
                                {skills.length > 0 ? skills.map((skill, idx) => (
                                    <span key={idx} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-slate-300 hover:bg-white/10 transition-colors cursor-default">
                                        #{skill}
                                    </span>
                                )) : (
                                    <span className="text-xs text-slate-500 italic">Adicione tags de habilidades...</span>
                                )}
                            </div>

                            {/* Social & Contact Actions */}
                            <div className="flex items-center gap-4 w-full justify-center border-t border-white/5 pt-6">
                                <a href={`mailto:${currentUser.email}`} className="p-3 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-all" title={currentUser.email}>
                                    <MailIcon className="w-5 h-5" />
                                </a>
                                {instagram && (
                                    <a href={`https://instagram.com/${instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-slate-800/50 text-slate-400 hover:text-pink-400 hover:bg-slate-700 transition-all">
                                        <InstagramIcon className="w-5 h-5" />
                                    </a>
                                )}
                                {portfolio && (
                                    <a href={portfolio} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-slate-800/50 text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-all">
                                        <GlobeIcon className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Decorative Elements behind card */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-[70px] opacity-20 pointer-events-none"></div>
                 </div>
            </div>

            {/* Right Column: Settings Panel */}
            <div className="flex-1 bg-slate-900/30 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/5 lg:overflow-y-auto">
                <div className="p-6 lg:p-10 max-w-3xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                        <h1 className="text-2xl font-bold text-white">Editar Perfil</h1>
                        
                        {/* Tab Switcher */}
                        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800 self-stretch sm:self-auto">
                            <button 
                                onClick={() => setActiveTab('identity')}
                                className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'identity' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            >
                                Identidade
                            </button>
                            <button 
                                onClick={() => setActiveTab('journey')}
                                className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'journey' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            >
                                <StarIcon className="w-3 h-3" />
                                Jornada
                            </button>
                            <button 
                                onClick={() => setActiveTab('security')}
                                className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'security' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            >
                                Segurança
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success' ? 'bg-lime-500/10 border-lime-500/20 text-lime-300' : 'bg-red-500/10 border-red-500/20 text-red-300'} flex items-center gap-3 animate-in slide-in-from-top-2`}>
                            {message.type === 'success' ? <SparklesIcon className="w-5 h-5" /> : <ShieldCheckIcon className="w-5 h-5" />}
                            <p className="text-sm font-medium">{message.text}</p>
                        </div>
                    )}

                    {activeTab === 'identity' && (
                        <form onSubmit={handleIdentitySubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput label="Nome Completo" name="name" value={name} onChange={(e) => setName((e.target as HTMLInputElement).value)} icon={<UserIcon className="w-4 h-4"/>} required />
                                <FormInput label="Função no Coletivo" name="role" value={role} onChange={(e) => setRole((e.target as HTMLInputElement).value)} icon={<SparklesIcon className="w-4 h-4"/>} required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Bio / Manifesto</label>
                                <textarea 
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full bg-slate-800/50 text-white p-4 rounded-xl border border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none resize-none placeholder:text-slate-600"
                                    rows={4}
                                    placeholder="Conte um pouco sobre sua arte e seu papel no grupo..."
                                />
                                <p className="text-right text-xs text-slate-500 mt-1">{bio.length}/240 caracteres</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Tags de Habilidade</label>
                                <div className="w-full bg-slate-800/50 rounded-xl border border-white/10 p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
                                    {skills.map((skill, i) => (
                                        <span key={i} className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded-lg text-sm flex items-center gap-1">
                                            {skill}
                                            <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white"><UserIcon className="w-3 h-3 rotate-45" /></button> 
                                        </span>
                                    ))}
                                    <input 
                                        type="text" 
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyDown={handleAddSkill}
                                        placeholder="Digite e pressione Enter..."
                                        className="bg-transparent text-white outline-none flex-1 min-w-[120px] px-2 py-1 text-sm placeholder:text-slate-600"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput label="Instagram (Ex: @usuario)" name="instagram" value={instagram} onChange={(e) => setInstagram((e.target as HTMLInputElement).value)} />
                                <FormInput label="Link do Portfólio" name="portfolio" value={portfolio} onChange={(e) => setPortfolio((e.target as HTMLInputElement).value)} />
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <button type="submit" className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'journey' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
                                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                    <ActivityIcon className="w-5 h-5 text-lime-400"/>
                                    Rastros e Raízes
                                </h3>
                                
                                {userJourney.length > 0 ? (
                                    <div className="relative pl-4 border-l-2 border-white/10 space-y-8">
                                        {userJourney.map((log) => {
                                            const poetic = getPoeticEntry(log);
                                            return (
                                                <div key={log.id} className="relative">
                                                    {/* Timeline Dot */}
                                                    <div className="absolute -left-[21px] top-1 w-3 h-3 bg-slate-900 rounded-full border-2 border-lime-400 shadow-[0_0_10px_rgba(132,204,22,0.5)]"></div>
                                                    
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`text-sm font-bold ${poetic.color}`}>{poetic.title}</span>
                                                            <span className="text-[10px] text-slate-500 flex items-center gap-1 bg-slate-900/50 px-2 py-0.5 rounded-full border border-white/5">
                                                                <ClockIcon className="w-3 h-3"/>
                                                                {new Date(log.timestamp).toLocaleDateString('pt-BR')}
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-400 text-sm leading-relaxed">
                                                            {log.details}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-slate-500 italic">
                                        <StarIcon className="w-12 h-12 mx-auto mb-4 opacity-20"/>
                                        <p>Sua jornada no coletivo está apenas começando.</p>
                                        <p className="text-xs mt-2">Suas ações aparecerão aqui conforme você colabora.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 max-w-md">
                            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-200 text-sm mb-6">
                                <p className="flex items-center gap-2 font-semibold mb-1"><LockIcon className="w-4 h-4"/> Área Segura</p>
                                Sua senha protege o acesso aos dados financeiros e estratégicos do coletivo. Escolha uma senha forte.
                            </div>

                            <FormInput label="Senha Atual" name="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword((e.target as HTMLInputElement).value)} required />
                            <div className="h-px bg-white/10 my-4"></div>
                            <FormInput label="Nova Senha" name="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword((e.target as HTMLInputElement).value)} required placeholder="Mínimo 6 caracteres" />
                            <FormInput label="Confirmar Nova Senha" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword((e.target as HTMLInputElement).value)} required />

                            <div className="pt-4">
                                <button type="submit" className="w-full px-8 py-3 bg-slate-700 hover:bg-white hover:text-slate-900 text-white font-semibold rounded-xl transition-all">
                                    Atualizar Senha
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
