import { Bell, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();

    const initials = user?.nome ? user.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

    return (
        <header className="h-16 bg-[var(--color-surface-card)]/80 backdrop-blur-xl border-b border-[var(--color-border)] flex items-center justify-between px-8 sticky top-0 z-30 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {title || 'Bem-vindo'}
            </h2>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="pl-9 pr-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all w-56 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
                    />
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] rounded-lg transition-all"
                    title={theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {/* Notifications */}
                <button className="relative p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] rounded-lg transition-all">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--color-surface-card)]"></span>
                </button>

                {/* User */}
                <div className="flex items-center gap-3 pl-4 border-l border-[var(--color-border)]">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{user?.nome || 'Usuário'}</p>
                        <p className="text-[11px] text-[var(--color-text-muted)]">Administrador</p>
                    </div>
                    <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/20">
                        {initials}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
