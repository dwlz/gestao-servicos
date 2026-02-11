import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    Wrench,
    FileText,
    Wallet,
    LogOut,
    Snowflake,
    ShieldCheck,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Building2, label: 'Empresas & Locais', path: '/empresas' },
        { icon: Wrench, label: 'Serviços', path: '/servicos' },
        { icon: FileText, label: 'Orçamentos', path: '/orcamentos' },
        { icon: Wallet, label: 'Financeiro', path: '/financeiro' },
    ];

    const clienteItems = [
        { icon: ShieldCheck, label: 'Portal do Cliente', path: '/portal-cliente' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--color-sidebar-bg)] flex flex-col z-20 transition-colors duration-300">
            {/* Logo */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Snowflake size={22} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-tight">ServicePro</h1>
                        <p className="text-[11px] text-[var(--color-sidebar-text)] tracking-wide uppercase">Refrigeração</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-2">
                <p className="text-[10px] text-[var(--color-sidebar-text)] uppercase tracking-widest font-semibold px-3 mb-3">Menu</p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm',
                                isActive
                                    ? 'bg-[var(--color-sidebar-active)] text-[var(--color-sidebar-text-active)] shadow-sm'
                                    : 'text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)] hover:text-white'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={clsx(
                                    'p-1.5 rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-indigo-500/20 text-indigo-400'
                                        : 'text-[var(--color-sidebar-text)] group-hover:text-white'
                                )}>
                                    <item.icon size={18} />
                                </div>
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}

                <div className="mt-5 mb-1">
                    <p className="text-[10px] text-[var(--color-sidebar-text)] uppercase tracking-widest font-semibold px-3 mb-3">Cliente</p>
                </div>
                {clienteItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm',
                                isActive
                                    ? 'bg-[var(--color-sidebar-active)] text-[var(--color-sidebar-text-active)] shadow-sm'
                                    : 'text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)] hover:text-white'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={clsx(
                                    'p-1.5 rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-indigo-500/20 text-indigo-400'
                                        : 'text-[var(--color-sidebar-text)] group-hover:text-white'
                                )}>
                                    <item.icon size={18} />
                                </div>
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom */}
            <div className="p-3 border-t border-white/5">
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full text-[var(--color-sidebar-text)] hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all text-sm">
                    <div className="p-1.5 rounded-lg">
                        <LogOut size={18} />
                    </div>
                    <span className="font-medium">Sair</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
