import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const AppLayout = () => {
    return (
        <div className="min-h-screen bg-[var(--color-surface)] flex transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 ml-64 flex flex-col min-h-screen">
                <Header />
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
