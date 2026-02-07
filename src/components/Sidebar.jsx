import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, BarChart3, Settings, Shield } from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Risk Overview', path: '/' },
        { icon: Users, label: 'Student Directory', path: '/students' },
        { icon: FileText, label: 'Support Actions', path: '/interventions' },
        { icon: BarChart3, label: 'Reports', path: '/reports' },
    ];

    return (
        <aside className="w-72 bg-[#0a0e1a] border-r border-white/5 h-screen fixed left-0 top-0 flex flex-col z-[100] shadow-[10px_0_50px_rgba(0,0,0,0.3)]">
            {/* Logo */}
            <div className="p-10 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-blue to-accent-purple rounded-2xl flex items-center justify-center shadow-lg shadow-accent-blue/20">
                        <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tighter italic">RISK<span className="text-accent-blue">GUARD</span></h1>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Admin Control</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6">
                <ul className="space-y-4">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${isActive
                                        ? 'bg-accent-blue text-white shadow-xl shadow-accent-blue/20 translate-x-1'
                                        : 'text-gray-500 hover:text-white hover:bg-white/[0.03] border border-transparent hover:border-white/5'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Profile */}
            <div className="p-8 mt-auto">
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:bg-white/[0.04] transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                                alt="User"
                                className="w-12 h-12 rounded-2xl ring-2 ring-white/10 group-hover:ring-accent-blue/40 transition-all"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0a0e1a] rounded-full"></div>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-black text-white tracking-tight">Dr. Sarah Jenkins</p>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Administrator</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
