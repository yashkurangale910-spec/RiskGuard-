import { Users, AlertTriangle, Shield, TrendingUp, Search, Plus, Calendar, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
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
                console.log("Fetching dashboard data from:", import.meta.env.VITE_API_URL || 'http://localhost:8000');
                const [statsRes, trendsRes, studentsRes] = await Promise.all([
                    dashboardService.getStats(),
                    dashboardService.getTrends(),
                    studentService.getStudents()
                ]);

                setStats(statsRes.data || {});
                setDropoutData(trendsRes.data || []);
                setStudents(studentsRes.data || []);
                console.log("Dashboard data loaded successfully");
            } catch (err) {
                console.error("Critical Connectivity Error:", err);
                setError("Unable to connect to the backend server. Please ensures the FastAPI service is running on port 8000.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-white">
                <div className="w-16 h-16 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mb-6 shadow-lg shadow-accent-blue/20"></div>
                <p className="font-black text-xl tracking-widest uppercase animate-pulse">Synchronizing Analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] p-8 text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-8 border border-red-500/20">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-3xl font-black text-white mb-4">Connection Failed</h2>
                <p className="text-gray-400 max-w-md font-bold leading-relaxed mb-8">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Students */}
                <div className="stat-card group">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Total Students</p>
                            <h3 className="text-4xl font-extrabold text-white tracking-tight">{stats.total_students.toLocaleString()}</h3>
                            <p className="text-sm text-green-400 mt-2 font-semibold">
                                +2.4% <span className="text-gray-500 font-normal">since last term</span>
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/20 transition-all border border-blue-500/20">
                            <Users className="w-7 h-7 text-blue-400" />
                        </div>
                    </div>
                </div>

                {/* High Risk Students */}
                <div className="stat-card group">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">High Risk Students</p>
                            <h3 className="text-4xl font-extrabold text-red-500 tracking-tight">{stats.high_risk_students}</h3>
                            <p className="text-sm text-red-400 mt-2 font-semibold">
                                +5.1% <span className="text-gray-500 font-normal">increase this week</span>
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center group-hover:bg-red-500/20 transition-all border border-red-500/20">
                            <AlertTriangle className="w-7 h-7 text-red-400" />
                        </div>
                    </div>
                </div>

                {/* Active Interventions */}
                <div className="stat-card group">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Active Interventions</p>
                            <h3 className="text-4xl font-extrabold text-white tracking-tight">{stats.active_interventions}</h3>
                            <p className="text-sm text-blue-400 mt-2 font-semibold">
                                12 <span className="text-gray-500 font-normal">completed this month</span>
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center group-hover:bg-purple-500/20 transition-all border border-purple-500/20">
                            <Shield className="w-7 h-7 text-purple-400" />
                        </div>
                    </div>
                </div>

                {/* Improvement Rate */}
                <div className="stat-card group">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Improvement Rate</p>
                            <h3 className="text-4xl font-extrabold text-green-400 tracking-tight">+{stats.improvement_rate}%</h3>
                            <p className="text-sm text-green-400 mt-2 font-semibold">
                                8% <span className="text-gray-500 font-normal">higher than district average</span>
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center group-hover:bg-green-500/20 transition-all border border-green-500/20">
                            <TrendingUp className="w-7 h-7 text-green-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Dropout Risk Trends */}
                <div className="lg:col-span-2 card overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Dropout Risk Trends</h3>
                            <p className="text-sm text-gray-500 font-medium mt-1">Real-time predictive analytics</p>
                        </div>
                        <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-all px-4 py-2 rounded-xl bg-dark-bg/50 border border-dark-border hover:border-accent-blue/50">
                            Last 6 Months
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dropoutData}>
                                <defs>
                                    <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
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
                                    tick={{ fontSize: 13, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#4b5563"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 13, fontWeight: 700 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#111827',
                                        border: '1px solid #1f2937',
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                                        color: '#fff',
                                        padding: '12px 16px',
                                    }}
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#areaColor)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Factor Distribution */}
                <div className="card flex flex-col items-center">
                    <div className="w-full text-left mb-8">
                        <h3 className="text-xl font-bold text-white tracking-tight">Risk Factor Distribution</h3>
                        <p className="text-sm text-gray-500 font-medium mt-1">Primary indicators triggering alerts</p>
                    </div>

                    <div className="relative w-64 h-64 mt-4">
                        {/* Realistic Donut with gradients */}
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            <circle cx="50" cy="50" r="42" fill="transparent" stroke="#1f2937" strokeWidth="12" />

                            {/* Attendance - Red */}
                            <circle cx="50" cy="50" r="42" fill="transparent" stroke="#ef4444" strokeWidth="12"
                                strokeDasharray="264" strokeDashoffset="66" strokeLinecap="round" />

                            {/* Grades - Blue */}
                            <circle cx="50" cy="50" r="42" fill="transparent" stroke="#3b82f6" strokeWidth="12"
                                strokeDasharray="180" strokeDashoffset="130" strokeLinecap="round" />

                            {/* Behavior - Orange */}
                            <circle cx="50" cy="50" r="42" fill="transparent" stroke="#f97316" strokeWidth="12"
                                strokeDasharray="80" strokeDashoffset="220" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center -mt-2">
                            <span className="text-5xl font-black text-white">84</span>
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Alerts</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full mt-10">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                            <span className="text-sm font-bold text-gray-400">Attendance</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            <span className="text-sm font-bold text-gray-400">Grades</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                            <span className="text-sm font-bold text-gray-400">Behavior</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-accent-blue/40"></div>
                            <span className="text-sm font-bold text-gray-400">Engagement</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* High-Risk Student Alerts */}
            <div className="card">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight">High-Risk Student Alerts</h3>
                        <p className="text-sm text-gray-500 font-medium mt-1">Immediate intervention candidates</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-accent-blue transition-colors" />
                            <input
                                type="text"
                                placeholder="Search student name..."
                                className="input-field w-80 pl-12 bg-dark-bg font-medium"
                            />
                        </div>
                        <button
                            onClick={() => navigate('/add-student')}
                            className="btn-primary h-[50px] px-8 rounded-xl flex items-center gap-3 font-black shadow-lg shadow-accent-blue/20"
                        >
                            <Plus className="w-5 h-5" />
                            Register Student
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-border/50">
                                <th className="text-left py-5 px-6 text-xs font-black text-gray-500 uppercase tracking-widest">Student Name</th>
                                <th className="text-left py-5 px-6 text-xs font-black text-gray-500 uppercase tracking-widest">Risk Score</th>
                                <th className="text-left py-5 px-6 text-xs font-black text-gray-500 uppercase tracking-widest">Primary Factors</th>
                                <th className="text-left py-5 px-6 text-xs font-black text-gray-500 uppercase tracking-widest">Last Event</th>
                                <th className="text-left py-5 px-6 text-xs font-black text-gray-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr
                                    key={student.id}
                                    onClick={() => navigate(`/students?id=${student.student_id}`)}
                                    className="group border-b border-dark-border/30 hover:bg-white/[0.02] transition-colors cursor-pointer"
                                >
                                    <td className="py-6 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-white font-black border border-gray-600 shadow-xl group-hover:scale-110 transition-transform">
                                                {student.avatar_id}
                                            </div>
                                            <div>
                                                <p className="font-extrabold text-white text-lg tracking-tight group-hover:text-accent-blue transition-colors">{student.name}</p>
                                                <p className="text-sm font-bold text-gray-500">{student.grade}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`px-4 py-2 rounded-2xl font-black text-base shadow-lg ${student.risk_score >= 70 ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-red-500/5' :
                                                student.risk_score >= 40 ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-orange-500/5' :
                                                    'bg-green-500/10 text-green-400 border border-green-500/20 shadow-green-500/5'
                                                }`}>
                                                {student.risk_score}/100
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6">
                                        <div className="flex flex-wrap gap-2">
                                            {student.factors ? student.factors.split(', ').map((f, i) => (
                                                <span key={i} className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    {f}
                                                </span>
                                            )) : <span className="text-gray-600 font-bold text-xs uppercase italic tracking-widest">No Active Risks</span>}
                                        </div>
                                    </td>
                                    <td className="py-6 px-6">
                                        <span className="text-sm font-bold text-gray-400 line-clamp-1">{student.last_event}</span>
                                    </td>
                                    <td className="py-6 px-6">
                                        <button className="bg-accent-blue hover:bg-accent-purple text-white px-6 py-3 rounded-2xl text-sm font-black transition-all duration-300 shadow-lg shadow-accent-blue/10 hover:shadow-accent-purple/20 hover:-translate-y-1">
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
