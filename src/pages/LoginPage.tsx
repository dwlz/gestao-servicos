import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    Snowflake,
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    KeyRound,
    ArrowRight,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import clsx from 'clsx';

const LoginPage = () => {
    const { login, register } = useAuth();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Login fields
    const [loginEmail, setLoginEmail] = useState('');
    const [loginSenha, setLoginSenha] = useState('');

    // Register fields
    const [regNome, setRegNome] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regSenha, setRegSenha] = useState('');
    const [regConfirmSenha, setRegConfirmSenha] = useState('');
    const [regCodigo, setRegCodigo] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(loginEmail, loginSenha);
        if (!result.success) setError(result.error || 'Erro ao fazer login.');
        setLoading(false);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (regSenha.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres.');
            return;
        }
        if (regSenha !== regConfirmSenha) {
            setError('As senhas não coincidem.');
            return;
        }
        if (!regCodigo.trim()) {
            setError('O código de convite é obrigatório para se registrar.');
            return;
        }

        setLoading(true);
        const result = await register(regNome, regEmail, regSenha, regCodigo);
        if (!result.success) setError(result.error || 'Erro ao registrar.');
        setLoading(false);
    };

    const inputClass = "w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all";
    const inputClassRight = "w-full pl-11 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#1a1040] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute top-10 right-10 opacity-5">
                    <Snowflake size={200} className="text-white animate-spin" style={{ animationDuration: '40s' }} />
                </div>
                <div className="absolute bottom-10 left-10 opacity-5">
                    <Snowflake size={120} className="text-white animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
                </div>
            </div>

            {/* Card */}
            <div className="relative w-full max-w-md animate-scale-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl shadow-indigo-500/30 mb-4 animate-float">
                        <Snowflake size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Services Pro</h1>
                    <p className="text-slate-400 text-sm mt-1">Sistema de Gestão de Serviços</p>
                </div>

                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Tab Switch */}
                    <div className="flex gap-1 bg-white/5 p-1 rounded-xl mb-7">
                        <button
                            onClick={() => { setMode('login'); setError(''); }}
                            className={clsx(
                                "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all",
                                mode === 'login'
                                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                                    : "text-slate-400 hover:text-white"
                            )}
                        >
                            Entrar
                        </button>
                        <button
                            onClick={() => { setMode('register'); setError(''); }}
                            className={clsx(
                                "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all",
                                mode === 'register'
                                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                                    : "text-slate-400 hover:text-white"
                            )}
                        >
                            Cadastrar
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5 animate-slide-down">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* LOGIN */}
                    {mode === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
                            <div className="relative">
                                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    placeholder="E-mail"
                                    className={inputClass}
                                    value={loginEmail}
                                    onChange={e => setLoginEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Senha"
                                    className={inputClassRight}
                                    value={loginSenha}
                                    onChange={e => setLoginSenha(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                            >
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        Entrar
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            <div className="text-center pt-2">
                                <p className="text-xs text-slate-500">
                                    Demo: <span className="text-slate-400 font-mono">will@servicepro.com</span> / <span className="text-slate-400 font-mono">123456</span>
                                </p>
                            </div>
                        </form>
                    )}

                    {/* REGISTER */}
                    {mode === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
                            <div className="relative">
                                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Nome completo"
                                    className={inputClass}
                                    value={regNome}
                                    onChange={e => setRegNome(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    placeholder="E-mail"
                                    className={inputClass}
                                    value={regEmail}
                                    onChange={e => setRegEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Senha (mín. 6 caracteres)"
                                    className={inputClassRight}
                                    value={regSenha}
                                    onChange={e => setRegSenha(e.target.value)}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <div className="relative">
                                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirmar senha"
                                    className={inputClassRight}
                                    value={regConfirmSenha}
                                    onChange={e => setRegConfirmSenha(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Invite Code */}
                            <div className="pt-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <KeyRound size={14} className="text-amber-400" />
                                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Código de Convite *</span>
                                </div>
                                <div className="relative">
                                    <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400/60" />
                                    <input
                                        type="text"
                                        placeholder="Digite o código de convite"
                                        className="w-full pl-11 pr-4 py-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40 transition-all uppercase tracking-widest font-mono"
                                        value={regCodigo}
                                        onChange={e => setRegCodigo(e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1.5 ml-1">
                                    Solicite um código ao administrador do sistema para se cadastrar.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-2"
                            >
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        Criar Conta
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center text-slate-500 text-[11px] mt-6">
                    © 2026 ServicePro — Sistema de Gestão de Serviços de Refrigeração
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
