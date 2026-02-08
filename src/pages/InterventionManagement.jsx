import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Calendar, FileText, Download, Plus, Search, ChevronRight, Bell, Settings, Filter, Trash2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { interventionService } from '../api/services';

const InterventionManagement = () => {
    const navigate = useNavigate();
    const [columns, setColumns] = useState({
        pending: { title: 'Pending Action', count: 0, color: 'orange', cards: [] },
        inProgress: { title: 'In Progress', count: 0, color: 'blue', cards: [] },
        resolved: { title: 'Resolved', count: 0, color: 'green', cards: [] },
    });
    const [loading, setLoading] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newIntervention, setNewIntervention] = useState({
        student_id: '',
        title: 'Academic Tutoring',
        description: '',
        status: 'pending',
        priority: 'urgent',
        next_date: new Date().toISOString().split('T')[0]
    });

    const fetchInterventions = async () => {
        setLoading(true);
        try {
            const response = await interventionService.getInterventions();
            console.log("Fetched Interventions:", response.data);
            if (response.data) {
                setColumns(response.data);
            }
        } catch (error) {
            console.error("Error fetching interventions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterventions();
    }, []);

    const handleCreateIntervention = async () => {
        if (!newIntervention.student_id || !newIntervention.description) {
            alert("Please provide Student ID and Goal description");
            return;
        }
        setSubmitting(true);
        try {
            await interventionService.createIntervention(newIntervention);
            setShowSidebar(false);
            setNewIntervention({
                student_id: '',
                title: 'Academic Tutoring',
                description: '',
                status: 'pending',
                priority: 'urgent',
                next_date: new Date().toISOString().split('T')[0]
            });
            fetchInterventions();
        } catch (error) {
            console.error("Error creating intervention:", error);
            alert("Error creating intervention. Ensure Student ID is correct.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleMoveCard = async (cardId, nextStatus) => {
        try {
            await interventionService.moveCard(cardId, nextStatus, nextStatus === 'resolved' ? 100 : 50);
            fetchInterventions();
        } catch (error) {
            console.error("Error moving card:", error);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen text-white font-bold p-8">Loading Support Actions...</div>;
    }

    const handleExport = () => {
        navigate('/reports');
    };

    return (
        <div className="space-y-10 max-w-[1600px] mx-auto pb-20">
            {/* Nav & Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">
                    <span>DASHBOARD</span>
                    <ChevronRight className="w-3 h-3 text-gray-700" />
                    <span className="text-white">SUPPORT ACTION MANAGEMENT</span>
                </div>
                <div className="flex items-end justify-between">
                    <div className="space-y-1">
                        <h1 className="text-5xl font-black text-white tracking-tight">Support Action Management</h1>
                        <p className="text-lg font-bold text-gray-500">Identify, assign, and track student support interventions in real-time.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleExport}
                            className="btn-secondary h-[60px] px-8 rounded-2xl flex items-center gap-3 font-black text-sm uppercase tracking-widest hover:bg-white/[0.05] transition-all"
                        >
                            <Download className="w-5 h-5" />
                            Export Report
                        </button>
                        <button
                            onClick={() => setShowSidebar(true)}
                            className="bg-accent-blue hover:bg-accent-purple text-white h-[60px] px-8 rounded-2xl flex items-center gap-3 font-black text-sm uppercase tracking-widest transition-all shadow-[0_15px_30px_-5px_rgba(99,102,241,0.3)] hover:shadow-accent-purple/40 hover:-translate-y-1"
                        >
                            <Plus className="w-5 h-5" />
                            New Action
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex items-center justify-between border-b border-dark-border/20 pb-8">
                <div className="flex items-center gap-4">
                    <button className="px-8 py-4 bg-accent-blue text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-accent-blue/20">
                        All High-Risk
                    </button>
                    <button className="px-8 py-4 bg-dark-card/50 text-gray-500 hover:text-white rounded-2xl font-black text-sm uppercase tracking-widest border border-dark-border/40 transition-all">
                        Critical Only
                    </button>
                    <button className="px-8 py-4 bg-dark-card/50 text-gray-500 hover:text-white rounded-2xl font-black text-sm uppercase tracking-widest border border-dark-border/40 transition-all">
                        My Assignments
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">SORT BY:</span>
                    <div className="relative group">
                        <select className="bg-dark-card border border-dark-border/40 rounded-2xl px-6 py-4 text-white font-black text-sm pr-12 appearance-none cursor-pointer group-hover:border-accent-blue/40 transition-all">
                            <option>Highest Risk Score</option>
                            <option>Recent Activity</option>
                            <option>Alphabetical</option>
                        </select>
                        <MoreVertical className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" />
                    </div>
                </div>
            </div >

            {/* Kanban Board Layout */}
            < div className="grid grid-cols-1 lg:grid-cols-3 gap-10" >

                {/* Pending Column */}
                < div className="space-y-8 bg-dark-bg/40 p-4 rounded-3xl border border-dark-border/10" >
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xl font-black text-white tracking-tight">{columns.pending.title}</h3>
                            <span className="w-8 h-8 flex items-center justify-center bg-orange-500/10 text-orange-500 rounded-xl text-sm font-black ring-1 ring-orange-500/20">
                                {columns.pending.count}
                            </span>
                        </div>
                        <button className="text-gray-600 hover:text-white transition-colors p-2">
                            <MoreVertical className="w-5 h-5 rotate-90" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {columns.pending.cards.map((card) => (
                            <div key={card.id} className="card p-8 border-dark-border/40 hover:border-red-500/40 hover:shadow-[0_20px_50px_-15px_rgba(239,68,68,0.1)] transition-all cursor-pointer group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-red-500/10 transition-colors"></div>
                                <div className="flex items-start justify-between relative z-10 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center text-white font-black shadow-xl ring-1 ring-white/5 group-hover:scale-110 transition-transform">
                                            {card.avatar}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-white tracking-tight">{card.name}</h4>
                                            <p className="text-xs font-bold text-gray-500 tracking-widest uppercase mt-1">ID: {card.studentId}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-1">RISK SCORE</span>
                                        <span className={`text-3xl font-black tracking-tighter ${card.riskScore >= 90 ? 'text-red-500' : 'text-orange-500'}`}>
                                            {card.riskScore}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 bg-orange-500/[0.03] border-l-4 border-orange-500 rounded-xl mb-8 group-hover:bg-orange-500/[0.06] transition-colors">
                                    <p className="text-sm font-bold text-gray-300 leading-relaxed">
                                        <span className="text-orange-500 font-black uppercase tracking-widest text-[10px] block mb-1">Trigger:</span>
                                        {card.trigger}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleMoveCard(card.id, 'inProgress')}
                                    className="w-full h-14 bg-accent-blue/10 hover:bg-accent-blue text-accent-blue hover:text-white border border-accent-blue/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                                >
                                    <Clock className="w-4 h-4" />
                                    Start Intervention
                                </button>
                            </div>
                        ))}
                    </div>
                </div >

                {/* In Progress Column */}
                < div className="space-y-8 bg-dark-bg/40 p-4 rounded-3xl border border-dark-border/10" >
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xl font-black text-white tracking-tight">{columns.inProgress.title}</h3>
                            <span className="w-8 h-8 flex items-center justify-center bg-blue-500/10 text-blue-500 rounded-xl text-sm font-black ring-1 ring-blue-500/20">
                                {columns.inProgress.count}
                            </span>
                        </div>
                        <button className="text-gray-600 hover:text-white transition-colors p-2">
                            <MoreVertical className="w-5 h-5 rotate-90" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {columns.inProgress.cards.map((card) => (
                            <div key={card.id} className="card p-8 border-dark-border/40 hover:border-blue-500/40 hover:shadow-[0_20px_50px_-15px_rgba(59,130,246,0.1)] transition-all cursor-pointer group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors"></div>
                                <div className="flex items-start justify-between relative z-10 mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center text-white font-black shadow-xl ring-1 ring-white/5 group-hover:scale-110 transition-transform">
                                            {card.avatar}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-white tracking-tight">{card.name}</h4>
                                            <p className="text-xs font-bold text-gray-500 tracking-widest uppercase mt-1">{card.studentId}</p>
                                        </div>
                                    </div>
                                    <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-500 text-white shadow-lg shadow-blue-500/20 border border-white/10 group-hover:scale-105 transition-transform">
                                        {card.tag}
                                    </span>
                                </div>

                                <div className="mb-10 relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Goal Progress</span>
                                        <span className="text-sm font-black text-blue-400">{card.goalProgress}%</span>
                                    </div>
                                    <div className="w-full bg-dark-bg/80 rounded-full h-3 ring-1 ring-white/5 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-blue-600 to-accent-blue h-3 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                            style={{ width: `${card.goalProgress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest relative z-10 border-t border-dark-border/20 pt-6">
                                    <div className="flex items-center gap-3 text-gray-500 group-hover:text-gray-300 transition-colors">
                                        <Clock className="w-4 h-4" />
                                        <span>Next: {card.nextDate}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-500 group-hover:text-gray-300 transition-colors">
                                        <FileText className="w-4 h-4" />
                                        <span>{card.notes} sessions</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleMoveCard(card.id, 'resolved')}
                                    className="w-full h-12 mt-6 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Mark Resolved
                                </button>
                            </div>
                        ))}
                    </div>
                </div >

                {/* Resolved Column */}
                < div className="space-y-8 bg-dark-bg/40 p-4 rounded-3xl border border-dark-border/10" >
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xl font-black text-white tracking-tight">{columns.resolved.title}</h3>
                            <span className="w-8 h-8 flex items-center justify-center bg-green-500/10 text-green-500 rounded-xl text-sm font-black ring-1 ring-green-500/20">
                                {columns.resolved.count}
                            </span>
                        </div>
                        <button className="text-gray-600 hover:text-white transition-colors p-2">
                            <MoreVertical className="w-5 h-5 rotate-90" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {columns.resolved.cards.map((card) => (
                            <div key={card.id} className="card p-8 bg-green-500/[0.02] border-green-500/10 hover:border-green-500/30 hover:shadow-[0_20px_50px_-15px_rgba(34,197,94,0.1)] transition-all cursor-pointer group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[50px] -mr-16 -mt-16"></div>
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 font-black shadow-xl ring-1 ring-green-500/20 group-hover:scale-110 group-hover:bg-green-500 transition-all group-hover:text-white">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-black text-white tracking-tight mb-1">{card.name}</h4>
                                        <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">{card.studentId}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div >
            </div >

            {/* Sidebar Slide-over Panel (Enhanced) */}
            {
                showSidebar && (
                    <div className="fixed inset-0 z-[100] overflow-hidden">
                        <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-md transition-opacity duration-500" onClick={() => setShowSidebar(false)}></div>
                        <div className="absolute inset-y-0 right-0 max-w-full flex">
                            <div className="w-screen max-w-2xl bg-dark-card border-l border-white/5 shadow-2xl animate-in slide-in-from-right duration-500 p-12 overflow-y-auto">
                                <div className="flex items-center justify-between mb-12">
                                    <div className="space-y-1">
                                        <h2 className="text-4xl font-black text-white tracking-tight">New Support Action</h2>
                                        <p className="text-base font-bold text-gray-500 uppercase tracking-widest">Identifying intervention goals</p>
                                    </div>
                                    <button onClick={() => setShowSidebar(false)} className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 hover:text-red-500 transition-all border border-white/5">
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Left Section Summary */}
                                    <div className="card bg-accent-blue shadow-[0_20px_40px_-10px_rgba(99,102,241,0.3)] p-8 space-y-8 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-white/20 transition-all"></div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Attendance Rate</p>
                                            <h4 className="text-5xl font-black text-white tracking-tighter">68%</h4>
                                        </div>
                                        <div className="space-y-2 pb-4 border-b border-white/10">
                                            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Credits Earned</p>
                                            <h4 className="text-4xl font-black text-white tracking-tighter">12/30</h4>
                                        </div>
                                        <div className="flex items-center gap-4 text-white">
                                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                                <AlertCircle className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-bold leading-tight">Student is currently tracking below diploma requirements.</p>
                                        </div>
                                    </div>

                                    {/* Form Fields Right */}
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Student ID (e.g. ST-23)</label>
                                            <input
                                                type="text"
                                                value={newIntervention.student_id}
                                                onChange={(e) => setNewIntervention({ ...newIntervention, student_id: e.target.value })}
                                                className="input-field w-full h-14 px-6 bg-dark-bg font-bold border-white/5"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Type of Support</label>
                                            <select
                                                value={newIntervention.title}
                                                onChange={(e) => setNewIntervention({ ...newIntervention, title: e.target.value })}
                                                className="input-field w-full h-14 px-6 bg-dark-bg font-bold cursor-pointer appearance-none border-white/5"
                                            >
                                                <option>Academic Tutoring</option>
                                                <option>Social-Emotional</option>
                                                <option>Financial Aid</option>
                                                <option>Career Counseling</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Intervention Goal / Description</label>
                                        <textarea
                                            rows={4}
                                            value={newIntervention.description}
                                            onChange={(e) => setNewIntervention({ ...newIntervention, description: e.target.value })}
                                            placeholder="E.g., Improve core class attendance to 90% over next 4 weeks through daily check-ins."
                                            className="input-field w-full p-6 bg-dark-bg font-bold border-white/5 resize-none leading-relaxed"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Follow-up Date</label>
                                        <input
                                            type="date"
                                            value={newIntervention.next_date}
                                            onChange={(e) => setNewIntervention({ ...newIntervention, next_date: e.target.value })}
                                            className="input-field w-full h-14 px-6 bg-dark-bg font-bold border-white/5"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Priority Status</label>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setNewIntervention({ ...newIntervention, priority: 'urgent' })} className={`flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${newIntervention.priority === 'urgent' ? 'bg-red-500 text-white shadow-xl shadow-red-500/20' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>Urgent</button>
                                            <button onClick={() => setNewIntervention({ ...newIntervention, priority: 'high' })} className={`flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${newIntervention.priority === 'high' ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' : 'bg-white/5 border border-white/5 text-gray-500 hover:text-white'}`}>High</button>
                                            <button onClick={() => setNewIntervention({ ...newIntervention, priority: 'medium' })} className={`flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${newIntervention.priority === 'medium' ? 'bg-accent-blue text-white shadow-xl shadow-accent-blue/20' : 'bg-white/5 border border-white/5 text-gray-500 hover:text-white'}`}>Medium</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 p-8 bg-dark-bg/50 border border-white/5 rounded-[2rem] space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-accent-blue flex items-center justify-center">
                                            <Bell className="w-5 h-5 text-white" />
                                        </div>
                                        <h4 className="text-xl font-black text-white tracking-tight uppercase tracking-wider">Activity History</h4>
                                    </div>
                                    <div className="space-y-6 pl-2">
                                        <div className="flex gap-6 relative">
                                            <div className="w-[2px] h-full bg-dark-border absolute left-[7px] top-6"></div>
                                            <div className="w-4 h-4 rounded-full bg-accent-blue ring-4 ring-accent-blue/20 flex-shrink-0 relative z-10 mt-1"></div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-300 leading-relaxed">Automated Alert: Student triggered risk threshold for chronic absence.</p>
                                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-2">Oct 20, 2023 • 08:30 AM</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 flex items-center gap-6">
                                    <button onClick={() => setShowSidebar(false)} className="flex-1 h-[70px] bg-white/5 hover:bg-white/10 text-white rounded-[2rem] font-black text-lg uppercase tracking-widest transition-all">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreateIntervention}
                                        disabled={submitting}
                                        className="flex-[2] h-[70px] bg-accent-blue hover:bg-accent-purple text-white rounded-[2rem] font-black text-lg uppercase tracking-widest transition-all shadow-2xl shadow-accent-blue/30 scale-100 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                    >
                                        {submitting ? 'Syncing...' : 'Save Intervention'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Floating Action Button (Enhanced) */}
            <button
                onClick={() => setShowSidebar(true)}
                className="fixed bottom-12 right-12 w-24 h-24 bg-accent-blue hover:bg-accent-purple text-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(99,102,241,0.4)] flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 group overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <Plus className="w-10 h-10 relative z-10 group-hover:rotate-90 transition-transform duration-500" />
            </button>
        </div >
    );
};

export default InterventionManagement;
