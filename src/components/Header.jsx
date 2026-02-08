import { Bell, Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = () => {
    return (
        <header className="h-24 bg-dark-bg/60 backdrop-blur-xl border-b border-white/5 fixed top-0 right-0 left-72 z-[90] px-12 flex items-center justify-end">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full mr-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">System Live</span>
                </div>

                <button className="relative p-3 rounded-lg hover:bg-dark-card transition-all duration-300 group">
                    <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-dark-card"></span>
                </button>

                <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                    alt="Admin"
                    className="w-10 h-10 rounded-full border-2 border-accent-blue cursor-pointer hover:opacity-80 transition-opacity"
                />
            </div>
        </header>
    );
};

export default Header;
