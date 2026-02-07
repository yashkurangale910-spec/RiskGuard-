import { Users, AlertTriangle, Shield, TrendingUp, Search, Plus, Bell, ChevronDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService, dashboardService } from '../api/services';

const Dashboard = () => {
    const navigate = useNavigate();
    const [dropoutData, setDropoutData] = useState([]);
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({
        total_students: 0,
        high_risk_students: 0,
        active_interventions: 0,
        improvement_rate: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [statsRes, trendsRes, studentsRes] = await Promise.all([
                    dashboardService.getStats(),
                    dashboardService.getTrends(),
                    studentService.getStudents()
                ]);

                setStats(statsRes.data || {});
                setDropoutData(trendsRes.data || []);
                setStudents(studentsRes.data || []);
            } catch (err) {
                console.error("Connectivity Error:", err);
                setError("Unable to connect to the backend server.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-white">
                <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-medium text-sm tracking-wider uppercase opacity-70">Loading Dashboard...</p>
            </div>
        );
    }

    if (error) return null;

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10 px-6">
            {/* Header */}
            <div className="flex items-center justify-between pt-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Risk Overview</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">Last updated: Today, 10:42 AM</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="w-10 h-10 rounded-full bg-[#1f2937] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#1f2937]"></span>
                    </button>
                    <button
                        onClick={() => navigate('/interventions')}
                        className="bg-accent-blue hover:bg-accent-purple text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-accent-blue/20 hover:shadow-accent-purple/40"
                    >
                        <Plus className="w-4 h-4" />
                        New Intervention
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Students */}
                <div className="bg-[#111827] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-1">Total Students</p>
                            <h3 className="text-3xl font-bold text-white tracking-tight">{stats.total_students.toLocaleString()}</h3>
                            <p className="text-xs font-bold text-emerald-400 mt-3 flex items-center gap-1">
                                +2.4% <span className="text-gray-500 font-medium">since last term</span>
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* High Risk Students */}
                <div className="bg-[#111827] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-red-500/20 transition-colors">
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-1">High Risk Students</p>
                            <h3 className="text-3xl font-bold text-red-500 tracking-tight">{stats.high_risk_students}</h3>
                            <p className="text-xs font-bold text-red-400 mt-3 flex items-center gap-1">
                                +5.1% <span className="text-gray-500 font-medium">increase this week</span>
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Active Interventions */}
                <div className="bg-[#111827] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-indigo-500/20 transition-colors">
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-1">Active Interventions</p>
                            <h3 className="text-3xl font-bold text-white tracking-tight">{stats.active_interventions}</h3>
                            <p className="text-xs font-bold text-emerald-400 mt-3 flex items-center gap-1">
                                12 <span className="text-gray-500 font-medium">completed this month</span>
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                            <Shield className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Improvement Rate */}
                <div className="bg-[#111827] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-emerald-500/20 transition-colors">
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-1">Improvement Rate</p>
                            <h3 className="text-3xl font-bold text-emerald-400 tracking-tight">+{stats.improvement_rate}%</h3>
                            <p className="text-xs font-bold text-emerald-400 mt-3 flex items-center gap-1">
                                8% <span className="text-gray-500 font-medium">higher than district avg</span>
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Dropout Risk Trends */}
                <div className="lg:col-span-2 bg-[#111827] p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-white">Dropout Risk Trends</h3>
                        </div>
                        <button className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white bg-[#1f2937] px-3 py-1.5 rounded-lg transition-colors border border-white/5">
                            Last 6 Months
                            <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dropoutData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    stroke="#4b5563"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 600, fill: '#6b7280' }}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#4b5563"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 600, fill: '#6b7280' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontSize: '12px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                                    }}
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Factor Distribution */}
                <div className="bg-[#111827] p-6 rounded-2xl border border-white/5 flex flex-col items-center">
                    <div className="w-full text-left mb-6">
                        <h3 className="text-lg font-bold text-white">Risk Factor Distribution</h3>
                    </div>

                    <div className="relative w-56 h-56 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            {/* Track */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1f2937" strokeWidth="10" strokeLinecap="round" />

                            {/* Attendance - Red - 40% */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="10"
                                strokeDasharray="251.2" strokeDashoffset="150" strokeLinecap="round" className="drop-shadow-[0_0_4px_rgba(239,68,68,0.5)]" />

                            {/* Grades - Blue - 30% */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="10"
                                strokeDasharray="251.2" strokeDashoffset="175" strokeLinecap="round" transform="rotate(144 50 50)" className="drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]" />

                            {/* Behavior - Yellow - 20% */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="10"
                                strokeDasharray="251.2" strokeDashoffset="200" strokeLinecap="round" transform="rotate(252 50 50)" className="drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-white">84</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">ALERTS</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full mt-8 px-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                            <span className="text-xs font-medium text-gray-400">Attendance</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                            <span className="text-xs font-medium text-gray-400">Grades</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                            <span className="text-xs font-medium text-gray-400">Behavior</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                            <span className="text-xs font-medium text-gray-400">Engagement</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* High-Risk Student Alerts */}
            <div className="bg-[#111827] rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">High-Risk Student Alerts</h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search student name..."
                                className="bg-[#1f2937] text-white text-sm rounded-lg pl-9 pr-4 py-2 border border-transparent focus:border-accent-blue outline-none transition-all w-64 placeholder:text-gray-600 font-medium"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 bg-[#1f2937] text-white text-xs font-medium rounded-lg hover:bg-[#374151] transition-colors border border-white/5">
                            <span className="text-gray-300">Filters</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#1f2937]/30">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Score</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Primary Factor</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Event</th>
                                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {students.slice(0, 5).map((student) => (
                                <tr key={student.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-[#1f2937] flex items-center justify-center text-xs font-bold text-gray-400 border border-white/10">
                                                {student.avatar_id}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{student.name}</p>
                                                <p className="text-[11px] text-gray-500 font-medium">{student.grade}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border ${student.risk_score >= 80
                                                ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.15)]'
                                                : student.risk_score >= 50
                                                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                    : 'bg-green-500/10 text-green-500 border-green-500/20'
                                            }`}>
                                            {student.risk_score}/100
                                        </span>
                                    </td>
                                    <td className="py-6 px-6">
                                        <span className="inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide bg-[#1f2937] text-gray-400 border border-white/10">
                                            {student.factors ? student.factors.split(', ')[0] : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-medium text-gray-500">{student.last_event || 'No recent activity'}</span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={() => navigate(`/students?id=${student.student_id}`)}
                                            className="px-4 py-1.5 bg-accent-blue hover:bg-accent-purple text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-accent-blue/20"
                                        >
                                            Assign Counseling
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
