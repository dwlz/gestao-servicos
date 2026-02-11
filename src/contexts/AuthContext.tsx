import { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    nome: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, senha: string) => Promise<{ success: boolean; error?: string }>;
    register: (nome: string, email: string, senha: string, codigoConvite: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock valid invite codes
const VALID_INVITE_CODES = ['SERVICEPRO2026', 'CONVITE123', 'ADMIN2026'];

// Mock registered users
const MOCK_USERS = [
    { id: '1', nome: 'Will Prestador', email: 'will@servicepro.com', senha: '123456' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('servicepro_user');
        if (saved) {
            try {
                setUser(JSON.parse(saved));
            } catch {
                localStorage.removeItem('servicepro_user');
            }
        }
    }, []);

    const login = async (email: string, senha: string): Promise<{ success: boolean; error?: string }> => {
        // Simulate API delay
        await new Promise(r => setTimeout(r, 800));

        // Check registered users from localStorage
        const registeredRaw = localStorage.getItem('servicepro_registered_users');
        const registeredUsers = registeredRaw ? JSON.parse(registeredRaw) : [];
        const allUsers = [...MOCK_USERS, ...registeredUsers];

        const found = allUsers.find((u: typeof MOCK_USERS[0]) => u.email === email && u.senha === senha);
        if (!found) {
            return { success: false, error: 'E-mail ou senha incorretos.' };
        }

        const userData = { id: found.id, nome: found.nome, email: found.email };
        setUser(userData);
        localStorage.setItem('servicepro_user', JSON.stringify(userData));
        return { success: true };
    };

    const register = async (nome: string, email: string, senha: string, codigoConvite: string): Promise<{ success: boolean; error?: string }> => {
        await new Promise(r => setTimeout(r, 800));

        // Validate invite code
        if (!VALID_INVITE_CODES.includes(codigoConvite.toUpperCase().trim())) {
            return { success: false, error: 'Código de convite inválido. Solicite um código ao administrador.' };
        }

        // Check if email already exists
        const registeredRaw = localStorage.getItem('servicepro_registered_users');
        const registeredUsers = registeredRaw ? JSON.parse(registeredRaw) : [];
        const allUsers = [...MOCK_USERS, ...registeredUsers];

        if (allUsers.some((u: typeof MOCK_USERS[0]) => u.email === email)) {
            return { success: false, error: 'Este e-mail já está cadastrado.' };
        }

        // Register new user
        const newUser = {
            id: `user_${Date.now()}`,
            nome,
            email,
            senha,
        };
        registeredUsers.push(newUser);
        localStorage.setItem('servicepro_registered_users', JSON.stringify(registeredUsers));

        // Auto-login
        const userData = { id: newUser.id, nome: newUser.nome, email: newUser.email };
        setUser(userData);
        localStorage.setItem('servicepro_user', JSON.stringify(userData));
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('servicepro_user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
