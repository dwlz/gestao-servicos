import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Empresas from './pages/Empresas';
import Servicos from './pages/Servicos';
import Orcamentos from './pages/Orcamentos';
import Financeiro from './pages/Financeiro';
import PortalCliente from './pages/PortalCliente';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) return <Navigate to="/" replace />;
    return <>{children}</>;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="empresas" element={<Empresas />} />
                <Route path="servicos" element={<Servicos />} />
                <Route path="orcamentos" element={<Orcamentos />} />
                <Route path="financeiro" element={<Financeiro />} />
                <Route path="portal-cliente" element={<PortalCliente />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;