
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
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
        </span>
        <input 
            {...props}
            className="w-full bg-slate-900/50 text-white p-3 pl-10 rounded-lg border border-slate-600 focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition placeholder:text-slate-400"
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
              // Limpar campos sensíveis
              setPassword('');
              // Transição automática após sucesso
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
          setSuccessMessage(''); // Limpa mensagem de sucesso ao trocar manualmente
          // Mantemos o email preenchido se o usuário acabou de cadastrar para facilitar o login
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
      {loginWallpaper && <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>}
      <div className="relative w-full max-w-sm mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            Clio OS
          </h1>
          <p className="text-slate-300 mt-2 text-lg">O sistema operacional para coletivos culturais</p>
        </div>

        <div className="bg-black/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">
            <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                {view === 'login' ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        
                        {/* Se viemos de um cadastro com sucesso, mostramos aqui */}
                        {successMessage && (
                            <div className="bg-lime-500/20 border border-lime-500 text-lime-200 p-3 rounded-lg text-sm text-center mb-4">
                                {successMessage}
                            </div>
                        )}

                        <InputField icon={<MailIcon className="h-5 w-5 text-slate-400"/>} name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@coletivo.com" disabled={isLoading} />
                        <InputField icon={<LockIcon className="h-5 w-5 text-slate-400"/>} name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" disabled={isLoading} />
                        
                        <div className="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-blue-500 focus:ring-blue-500" />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">Lembrar-me</label>
                        </div>
                        
                        {error && <p className="text-red-400 text-sm text-center bg-red-900/50 p-2 rounded-md">{error}</p>}

                        <div className="space-y-4 pt-2">
                            <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-sky-500/30 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? 'Entrando...' : 'Iniciar Sessão'}
                            </button>
                            <div className="relative flex items-center">
                                <div className="flex-grow border-t border-slate-600"></div>
                                <span className="flex-shrink mx-4 text-xs text-slate-400">OU</span>
                                <div className="flex-grow border-t border-slate-600"></div>
                            </div>
                            <button
                                type="button"
                                onClick={onGuestLogin}
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all shadow-lg disabled:opacity-50"
                            >
                                Entrar como Deusa Clio
                            </button>
                        </div>
                        <p className="text-center text-sm text-slate-400 pt-2">
                            Não tem uma conta?{' '}
                            <button type="button" onClick={() => switchView('signup')} className="font-semibold text-lime-400 hover:text-lime-300">Crie uma agora</button>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleSignUpSubmit} className="space-y-4">
                        <h2 className="text-xl font-bold text-center text-white">Criar Nova Conta</h2>
                        
                        {successMessage && (
                            <div className="bg-lime-500/20 border border-lime-500 text-lime-200 p-3 rounded-lg text-sm text-center mb-4 animate-pulse">
                                {successMessage}
                            </div>
                        )}

                        <InputField icon={<UserIcon className="h-5 w-5 text-slate-400"/>} name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Maria da Silva" disabled={isLoading} />
                        <InputField icon={<MailIcon className="h-5 w-5 text-slate-400"/>} name="email-signup" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="maria@coletivo.com" disabled={isLoading} />
                        <InputField icon={<LockIcon className="h-5 w-5 text-slate-400"/>} name="password-signup" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" disabled={isLoading} />
                        
                        {error && <p className="text-red-400 text-sm text-center bg-red-900/50 p-2 rounded-md">{error}</p>}
                        
                        <div>
                            <button type="submit" disabled={isLoading || !!successMessage} className="w-full py-3 px-4 bg-gradient-to-r from-lime-600 to-green-500 hover:from-lime-700 hover:to-green-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-lime-500/30 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? 'Criando conta...' : successMessage ? 'Sucesso!' : 'Cadastrar'}
                            </button>
                        </div>
                        <p className="text-center text-sm text-slate-400 pt-2">
                            Já tem uma conta?{' '}
                            <button type="button" onClick={() => switchView('login')} className="font-semibold text-lime-400 hover:text-lime-300">Faça o login</button>
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
