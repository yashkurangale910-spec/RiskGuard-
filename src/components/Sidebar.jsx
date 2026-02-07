import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, BarChart3, Settings as SettingsIcon, Shield } from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Student Directory', path: '/students' },
        { icon: FileText, label: 'Intervention Plans', path: '/interventions' },
        { icon: BarChart3, label: 'Reports', path: '/reports' },
    ];

    return (
        <aside className="w-72 bg-[#0a0e1a] border-r border-white/5 h-screen fixed left-0 top-0 flex flex-col z-[100] shadow-[10px_0_50px_rgba(0,0,0,0.3)]">
            {/* Logo */}
            <div className="p-8 mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent-blue rounded-xl flex items-center justify-center shadow-lg shadow-accent-blue/20">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-white tracking-tight leading-tight">SOOR COLLEGE</h1>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Dropout Identification & Support System</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-300 group ${isActive
                                        ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium text-sm">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Bottom Actions */}
            <div className="p-6 mt-auto space-y-6">
                <button className="flex items-center gap-3 px-5 text-gray-400 hover:text-white transition-colors w-full">
                    <SettingsIcon className="w-5 h-5" />
                    <span className="font-medium text-sm">Settings</span>
                </button>

                <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                                alt="User"
                                className="w-10 h-10 rounded-full border border-white/10"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0a0e1a] rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">Dr. Sarah Jenkins</p>
                            <p className="text-[11px] text-gray-500 truncate">Administrator</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
