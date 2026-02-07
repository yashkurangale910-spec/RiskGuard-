import { Bell, Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();

    const getTitleFromPath = () => {
        switch (location.pathname) {
            case '/':
                return { title: 'Risk Overview', subtitle: 'Last updated: Today, 10:42 AM' };
            case '/students':
                return { title: 'Edit Student Profile', subtitle: 'Editing ID: ST87-18250 • Last updated 2 days ago' };
            case '/interventions':
                return { title: 'Support Action Management', subtitle: 'Identify, assign, and track student support interventions in real-time.' };
            default:
                return { title: 'RiskGuard', subtitle: 'Northview District' };
        }
    };

    const { title, subtitle } = getTitleFromPath();

    return (
        <header className="h-24 bg-dark-bg/60 backdrop-blur-xl border-b border-white/5 fixed top-0 right-0 left-72 z-[90] px-12 flex items-center justify-between">
            <div className="flex flex-col">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-black text-white tracking-tight">{title}</h1>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">System Live</span>
                    </div>
                </div>
                <p className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-wider">{subtitle}</p>
            </div>

            <div className="flex items-center gap-4">
                {location.pathname === '/interventions' && (
                    <button className="btn-primary">
                        <Plus className="w-5 h-5" />
                        New Action
                    </button>
                )}
                {location.pathname === '/' && (
                    <button className="btn-primary">
                        <Plus className="w-5 h-5" />
                        New Intervention
                    </button>
                )}

                <button className="relative p-3 rounded-lg hover:bg-dark-card transition-all duration-300">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                    alt="Admin"
                    className="w-10 h-10 rounded-full border-2 border-accent-blue"
                />
            </div>
        </header>
    );
};

export default Header;
