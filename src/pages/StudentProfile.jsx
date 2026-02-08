import { User, BookOpen, Phone, AlertTriangle, FileText, Save, X, ChevronRight, Printer, Trash2, Plus, MessageSquare, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { studentService } from '../api/services';

const StudentProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const urlId = queryParams.get('id') || 'ST-39';

    const [formData, setFormData] = useState({
        student_id: urlId,
        name: '',
        grade: '',
        attendance_rate: 0,
        gpa: 0,
        risk_score: 0,
        ai_insight: null,
        notes: [],
        history: []
    });
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        const fetchStudent = async () => {
            setLoading(true);
            try {
                const [studentRes, historyRes] = await Promise.all([
                    studentService.getStudent(urlId),
                    studentService.getStudentHistory(urlId)
                ]);
                setFormData({
                    ...studentRes.data,
                    history: historyRes.data
                });
            } catch (error) {
                console.error("Error fetching student:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [urlId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        setSaveStatus('saving');
        try {
            await studentService.updateStudent(formData.student_id, {
                attendance_rate: parseFloat(formData.attendance_rate),
                gpa: parseFloat(formData.gpa),
                name: formData.name,
                grade: formData.grade
            });

            // Refresh data to get new chart points and insights
            const [refreshed, historyRes] = await Promise.all([
                studentService.getStudent(urlId),
                studentService.getStudentHistory(urlId)
            ]);
            setFormData({
                ...refreshed.data,
                history: historyRes.data
            });

            setSaveStatus('success');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            console.error("Error saving profile:", error);
            setSaveStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        try {
            await studentService.addNote(formData.student_id, {
                content: newNote,
                category: 'Counselor Note'
            });
            // Refresh student data
            const response = await studentService.getStudent(formData.student_id);
            setFormData(response.data);
            setNewNote('');
        } catch (error) {
            console.error("Error adding note:", error);
        }
    };

    const handleArchive = async () => {
        if (!window.confirm("Are you sure you want to archive this student record? This will remove them from the active dashboard.")) return;
        try {
            await studentService.archiveStudent(formData.student_id);
            navigate('/');
        } catch (error) {
            console.error("Error archiving student:", error);
            alert("Failed to archive student. Please try again.");
        }
    };

    // Format history for chart
    const chartData = [...(formData.history || [])].reverse().map(h => ({
        date: new Date(h.recorded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: h.risk_score
    }));

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Top Breadcrumb & Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold tracking-tight">
                    <span onClick={() => navigate('/')} className="text-gray-500 hover:text-white transition-colors cursor-pointer uppercase">Dashboard</span>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                    <span onClick={() => navigate('/')} className="text-gray-500 hover:text-white transition-colors cursor-pointer uppercase">Students</span>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                    <span className="text-white uppercase font-black">Analytics & Profile</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="btn-secondary flex items-center gap-3 px-6 py-3 rounded-2xl font-black shadow-lg">
                        <Printer className="w-5 h-5" />
                        Print Record
                    </button>
                    <button
                        onClick={handleArchive}
                        className="btn-secondary flex items-center gap-3 px-6 py-3 rounded-2xl font-black shadow-lg text-red-500 hover:text-red-400 group"
                    >
                        <Trash2 className="w-5 h-5 group-hover:animate-bounce" />
                        Archive
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-white tracking-tight">{formData.name || 'Loading Profile...'}</h1>
                <p className="text-base font-bold text-gray-500 uppercase tracking-[0.2em]">RONR
                    Student ID: <span className="text-accent-blue">{formData.student_id}</span> • {formData.grade}
                </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Sidebar Navigation */}
                <div className="lg:col-span-3">
                    <div className="card sticky top-28 p-4 space-y-2 border-dark-border/40 shadow-2xl">
                        <button className="w-full flex items-center gap-4 px-6 py-4 bg-accent-blue/10 text-accent-blue rounded-2xl font-black text-left border border-accent-blue/20 shadow-inner group">
                            <TrendingUp className="w-5 h-5" />
                            Risk Analytics
                        </button>
                        <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-500 hover:text-white hover:bg-white/[0.03] font-bold text-left transition-all border border-transparent hover:border-dark-border group">
                            <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Personal Info
                        </button>
                        <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-500 hover:text-white hover:bg-white/[0.03] font-bold text-left transition-all border border-transparent hover:border-dark-border group">
                            <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Counselor Notes
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9 space-y-10">

                    {/* Risk Profile Analytics (Chart) */}
                    <div className="card shadow-2xl border-dark-border/40 animate-in fade-in duration-700">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-accent-blue/10 rounded-2xl flex items-center justify-center border border-accent-blue/20">
                                    <TrendingUp className="w-6 h-6 text-accent-blue" />
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tight">Longitudinal Risk Tracking</h3>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-dark-bg/50 border border-dark-border/30 rounded-xl text-xs font-black text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-accent-blue"></div>
                                6 MONTH VIEW
                            </div>
                        </div>

                        <div className="h-[300px] w-full mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                    <XAxis dataKey="date" stroke="#4b5563" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#6b7280' }} />
                                    <YAxis stroke="#4b5563" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#6b7280' }} domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                                        itemStyle={{ color: '#3b82f6', fontWeight: 900 }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={4} fill="url(#riskGrad)" animationDuration={1500} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#111827' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Academic Baseline (Editable) */}
                    <div className="card shadow-2xl border-dark-border/40">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
                                <BookOpen className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-black text-white tracking-tight">Academic Baseline</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-sm font-black text-gray-500 uppercase tracking-widest">Attendance Rate (%)</label>
                                <div className="relative group">
                                    <input
                                        name="attendance_rate" value={formData.attendance_rate} onChange={handleChange}
                                        className={`input-field w-full h-[64px] text-2xl font-black px-8 bg-dark-bg focus:ring-4 focus:ring-accent-blue/10 ${formData.attendance_rate < 85 ? 'border-red-500/40 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'text-white border-dark-border'}`}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-dark-bg/80 border border-dark-border/40 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-tighter group-hover:opacity-0 transition-opacity">Editable</div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-sm font-black text-gray-500 uppercase tracking-widest">Current GPA (0-4.0)</label>
                                <div className="relative group">
                                    <input
                                        name="gpa" value={formData.gpa} onChange={handleChange}
                                        className={`input-field w-full h-[64px] text-2xl font-black px-8 bg-dark-bg focus:ring-4 focus:ring-accent-blue/10 ${formData.gpa < 2.5 ? 'border-orange-500/40 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'text-white border-dark-border'}`}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-dark-bg/80 border border-dark-border/40 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-tighter group-hover:opacity-0 transition-opacity">Editable</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Risk Summary */}
                    <div className="card bg-gradient-to-br from-[#1e1b4b] via-dark-card to-dark-bg border-accent-blue/40 shadow-[0_30px_60px_-15px_rgba(99,102,241,0.2)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                            <div className="w-16 h-16 bg-accent-blue shadow-[0_0_30px_rgba(59,130,246,0.3)] rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse-slow">
                                <AlertTriangle className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-black text-white tracking-tight mb-4">Neural Risk Assessment</h3>
                                <div className="p-8 bg-black/20 border border-white/5 rounded-3xl mb-6 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <p className="text-xl font-bold text-gray-300 leading-relaxed italic relative z-10">
                                        "{formData.ai_insight || 'AI Insight Generator is synthesizing data...'}"
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] bg-white/[0.02] w-fit px-6 py-3 rounded-2xl border border-white/5">
                                    <span className="text-gray-500">Live Risk score:</span>
                                    <span className={formData.risk_score > 70 ? "text-red-500" : formData.risk_score > 40 ? "text-orange-500" : "text-green-500"}>
                                        {formData.risk_score}% - {formData.risk_score > 70 ? "CRITICAL" : formData.risk_score > 40 ? "MODERATE" : "STABLE"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Counselor Observational Notes */}
                    <div className="card shadow-2xl border-dark-border/40 overflow-hidden">
                        <div className="p-8 border-b border-dark-border/20 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tight">Counselor Observations</h3>
                            </div>
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                {formData.notes?.length || 0} TOTAL SESSIONS
                            </div>
                        </div>

                        <div className="max-h-[450px] overflow-y-auto p-8 space-y-6 custom-scrollbar bg-dark-bg/20">
                            {formData.notes && formData.notes.length > 0 ? [...formData.notes].reverse().map((note) => (
                                <div key={note.id} className="p-8 bg-dark-bg/50 border border-dark-border/30 rounded-3xl relative group transition-all hover:border-accent-blue/30 hover:shadow-xl hover:-translate-y-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue font-black text-[10px]">
                                                C
                                            </div>
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                                {new Date(note.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="px-4 py-1 bg-accent-blue/10 border border-accent-blue/20 rounded-full text-[10px] font-black text-accent-blue uppercase tracking-widest">
                                            {note.category}
                                        </div>
                                    </div>
                                    <p className="text-gray-300 font-bold leading-relaxed text-lg">{note.content}</p>
                                </div>
                            )) : (
                                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
                                    <MessageSquare className="w-12 h-12 text-gray-600" />
                                    <p className="font-black text-gray-500 uppercase tracking-widest">No observations recorded yet</p>
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-dark-bg/40 border-t border-dark-border/20">
                            <div className="relative group">
                                <textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Draft a new observational insight or intervention log..."
                                    className="input-field w-full p-8 text-lg font-bold bg-dark-bg h-[160px] resize-none focus:ring-8 focus:ring-accent-blue/5 border-dark-border/50 placeholder-gray-700"
                                />
                                <div className="absolute bottom-6 right-6 flex items-center gap-4">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mr-2">{newNote.length} characters</span>
                                    <button
                                        onClick={handleAddNote}
                                        disabled={!newNote.trim()}
                                        className="bg-accent-blue hover:bg-white text-white hover:text-accent-blue px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 flex items-center gap-3 shadow-2xl shadow-accent-blue/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                        LOG OBSERVATION
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="flex items-center justify-between pt-10 border-t border-dark-border/20">
                        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white font-black text-lg uppercase tracking-widest transition-colors px-6">
                            Back
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className={`btn-primary group relative overflow-hidden px-16 py-7 rounded-[32px] shadow-[0_25px_50px_-12px_rgba(99,102,241,0.5)] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            <div className="flex items-center gap-4 relative z-10">
                                {saveStatus === 'success' ? (
                                    <span className="flex items-center gap-4 text-green-400">
                                        <Save className="w-7 h-7" />
                                        <span className="text-2xl font-black tracking-tight uppercase">Saved!</span>
                                    </span>
                                ) : (
                                    <>
                                        <Save className={`w-7 h-7 group-hover:rotate-12 transition-transform ${loading ? 'animate-spin' : ''}`} />
                                        <span className="text-2xl font-black tracking-tight uppercase">{loading ? 'Processing...' : 'Sync Profile'}</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
