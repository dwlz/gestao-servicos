import { createContext, useContext, useState, useEffect } from 'react';
import { authApi, getToken, setToken, removeToken } from '../services/api';

interface User {
    id: string;
    nome: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, senha: string) => Promise<{ success: boolean; error?: string }>;
    register: (nome: string, email: string, senha: string, codigoConvite: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (token) {
            authApi
                .me()
                .then((data) => {
                    setUser(data.user);
                })
                .catch(() => {
                    removeToken();
                    localStorage.removeItem('servicepro_user');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, senha: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const data = await authApi.login(email, senha);
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('servicepro_user', JSON.stringify(data.user));
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Erro ao fazer login' };
        }
    };

    const register = async (
        nome: string,
        email: string,
        senha: string,
        codigoConvite: string
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            const data = await authApi.register(nome, email, senha, codigoConvite);
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('servicepro_user', JSON.stringify(data.user));
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Erro ao registrar' };
        }
    };

    const logout = () => {
        setUser(null);
        removeToken();
        localStorage.removeItem('servicepro_user');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
