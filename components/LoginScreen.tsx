import React, { useState, useEffect } from 'react';
import { ClioAppIcon, MailIcon, LockIcon, UserIcon } from './icons';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<boolean> | boolean;
  onSignUp: (name: string, email: string, password: string) => Promise<{ success: boolean, message: string }> | { success: boolean, message: string };
  onGuestLogin: () => void;
  loginWallpaper: string | null;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {icon: React.ReactNode}> = ({icon, ...props}) => (
    <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4">
            {icon}
        </span>
        <input 
            {...props}
            className="w-full bg-black/40 text-white p-3.5 pl-12 rounded-xl border border-white/10 focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition placeholder:text-slate-500 backdrop-blur-sm"
        />
    </div>
);

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignUp, onGuestLogin, loginWallpaper }) => {
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      try {
        const { email, password } = JSON.parse(rememberedUser);
        setEmail(email);
        setPassword(password);
        setRememberMe(true);
      } catch (e) {
        console.error("Failed to parse remembered user from localStorage", e);
        localStorage.removeItem('rememberedUser');
      }
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
        const result = onLogin(email, password);
        const success = result instanceof Promise ? await result : result;
        if (!success) {
          setError('E-mail ou senha inválidos.');
        } else {
            if (rememberMe) {
                localStorage.setItem('rememberedUser', JSON.stringify({ email, password }));
            } else {
                localStorage.removeItem('rememberedUser');
            }
        }
    } catch (err) {
        setError('Ocorreu um erro ao tentar entrar.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccessMessage('');
      
      if (password.length < 6) {
          setError('A senha deve ter no mínimo 6 caracteres.');
          return;
      }

      setIsLoading(true);

      try {
          const result = onSignUp(name, email, password);
          const { success, message } = result instanceof Promise ? await result : result;
          
          if(!success) {
              setError(message);
          } else {
              setSuccessMessage(message);
              setPassword('');
              setTimeout(() => {
                  switchView('login');
              }, 2000);
          }
      } catch (err) {
          setError('Erro inesperado ao criar conta.');
      } finally {
          setIsLoading(false);
      }
  }

  const switchView = (newView: 'login' | 'signup') => {
      setIsTransitioning(true);
      setTimeout(() => {
          setView(newView);
          setError('');
          setSuccessMessage('');
          if (newView === 'signup') {
            setName('');
            setEmail('');
            setPassword('');
          }
          setIsTransitioning(false);
      }, 300);
  }

  return (
    <div
        className={`flex items-center justify-center h-screen w-screen p-4 relative ${!loginWallpaper ? 'animated-gradient' : 'bg-cover bg-center'}`}
        style={loginWallpaper ? { backgroundImage: `url(${loginWallpaper})` } : {}}
    >
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"></div>
      
      <div className="relative w-full max-w-md mx-auto z-10">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white tracking-tight drop-shadow-lg" style={{ textShadow: '0 0 30px rgba(14, 165, 233, 0.3)' }}>
            Clio OS
          </h1>
          <p className="text-sky-200/80 mt-3 text-lg font-medium tracking-wide">Sistema Operacional Cultural</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-2xl p-8 md:p-10 rounded-[2rem] shadow-2xl border border-white/10 ring-1 ring-white/5">
            <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                {view === 'login' ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-5">
                        
                        {successMessage && (
                            <div className="bg-lime-500/20 border border-lime-500/50 text-lime-200 p-3 rounded-xl text-sm text-center mb-4 font-medium">
                                {successMessage}
                            </div>
                        )}

                        <InputField icon={<MailIcon className="h-5 w-5 text-slate-400"/>} name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@coletivo.com" disabled={isLoading} />
                        <InputField icon={<LockIcon className="h-5 w-5 text-slate-400"/>} name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" disabled={isLoading} />
                        
                        <div className="flex items-center pl-1">
                            <input id="remember-me" name="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900" />
                            <label htmlFor="remember-me" className="ml-3 block text-sm text-slate-300">Manter conectado</label>
                        </div>
                        
                        {error && <p className="text-red-300 text-sm text-center bg-red-500/10 border border-red-500/20 p-3 rounded-xl">{error}</p>}

                        <div className="space-y-4 pt-3">
                            <button type="submit" disabled={isLoading} className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                {isLoading ? 'Acessando...' : 'Entrar'}
                            </button>
                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-white/10"></div>
                                <span className="flex-shrink mx-4 text-xs text-slate-500 uppercase tracking-widest">ou</span>
                                <div className="flex-grow border-t border-white/10"></div>
                            </div>
                            <button
                                type="button"
                                onClick={onGuestLogin}
                                disabled={isLoading}
                                className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-200 font-semibold rounded-xl transition-all disabled:opacity-50"
                            >
                                Entrar como Visitante
                            </button>
                        </div>
                        <p className="text-center text-sm text-slate-400 pt-4">
                            Não tem acesso?{' '}
                            <button type="button" onClick={() => switchView('signup')} className="font-semibold text-sky-400 hover:text-sky-300 transition-colors">Cadastre-se</button>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleSignUpSubmit} className="space-y-5">
                        <h2 className="text-2xl font-bold text-center text-white mb-6">Nova Conta</h2>
                        
                        {successMessage && (
                            <div className="bg-lime-500/20 border border-lime-500/50 text-lime-200 p-3 rounded-xl text-sm text-center mb-4 font-medium">
                                {successMessage}
                            </div>
                        )}

                        <InputField icon={<UserIcon className="h-5 w-5 text-slate-400"/>} name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu Nome" disabled={isLoading} />
                        <InputField icon={<MailIcon className="h-5 w-5 text-slate-400"/>} name="email-signup" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" disabled={isLoading} />
                        <InputField icon={<LockIcon className="h-5 w-5 text-slate-400"/>} name="password-signup" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha (min. 6 chars)" disabled={isLoading} />
                        
                        {error && <p className="text-red-300 text-sm text-center bg-red-500/10 border border-red-500/20 p-3 rounded-xl">{error}</p>}
                        
                        <div className="pt-2">
                            <button type="submit" disabled={isLoading || !!successMessage} className="w-full py-3.5 px-4 bg-gradient-to-r from-lime-600 to-emerald-500 hover:from-lime-500 hover:to-emerald-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-lime-500/20 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? 'Criando...' : successMessage ? 'Sucesso!' : 'Criar Conta'}
                            </button>
                        </div>
                        <p className="text-center text-sm text-slate-400 pt-4">
                            Já possui conta?{' '}
                            <button type="button" onClick={() => switchView('login')} className="font-semibold text-sky-400 hover:text-sky-300 transition-colors">Fazer Login</button>
                        </p>
                    </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;