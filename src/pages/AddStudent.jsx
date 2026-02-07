import React, { useState } from 'react';
import { User, BookOpen, AlertTriangle, ChevronRight, ChevronLeft, Save, Plus, X } from 'lucide-react';
import { studentService } from '../api/services';
import { useNavigate } from 'react-router-dom';

const AddStudent = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        student_id: '',
        grade: 'SYBsc.IT A (2025-26)',
        attendance_rate: '',
        gpa: '',
        avatar_id: '',
        academic_notes: '',
        behavioral_notes: '',
        personal_notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // 1. Create Student
            const studentPayload = {
                name: formData.name,
                student_id: formData.student_id,
                grade: formData.grade,
                avatar_id: formData.name.substring(0, 2).toUpperCase(),
                attendance_rate: parseFloat(formData.attendance_rate),
                gpa: parseFloat(formData.gpa)
            };

            await studentService.createStudent(studentPayload);

            // In a real app, we'd add notes sequentially or in a bulk call.
            // For now, we'll navigate back.
            navigate('/');
        } catch (error) {
            console.error("Error creating student:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-white tracking-tight">Register New Student</h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
                    Step {step} of 3: {step === 1 ? 'Identity' : step === 2 ? 'Academic Baseline' : 'Qualitative Indicators'}
                </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-dark-card rounded-full overflow-hidden border border-dark-border">
                <div
                    className="h-full bg-accent-blue transition-all duration-500"
                    style={{ width: `${(step / 3) * 100}%` }}
                ></div>
            </div>

            {/* Form Steps */}
            <div className="card shadow-2xl border-dark-border/40 p-10">
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                                <User className="w-6 h-6 text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-black text-white">Student Identity</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="block text-sm font-black text-gray-500 uppercase tracking-widest">Full Name</label>
                                <input
                                    name="name" value={formData.name} onChange={handleChange}
                                    placeholder="e.g., Jay Karawale"
                                    className="input-field w-full h-[60px] text-lg font-bold px-6 bg-dark-bg focus:ring-4 focus:ring-accent-blue/10"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-sm font-black text-gray-500 uppercase tracking-widest">Roll No / ID</label>
                                <input
                                    name="student_id" value={formData.student_id} onChange={handleChange}
                                    placeholder="e.g., ST-67"
                                    className="input-field w-full h-[60px] text-lg font-bold px-6 bg-dark-bg focus:ring-4 focus:ring-accent-blue/10"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="block text-sm font-black text-gray-500 uppercase tracking-widest">Grade / Division</label>
                                <select
                                    name="grade" value={formData.grade} onChange={handleChange}
                                    className="input-field w-full h-[60px] text-lg font-bold px-6 bg-dark-bg"
                                >
                                    <option>SYBsc.IT A (2025-26)</option>
                                    <option>SYBsc.IT B (2025-26)</option>
                                    <option>TYBsc.IT A (2025-26)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
                                <BookOpen className="w-6 h-6 text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-black text-white">Academic Baseline</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="block text-sm font-black text-gray-500 uppercase tracking-widest">Current Attendance (%)</label>
                                <input
                                    name="attendance_rate" type="number" value={formData.attendance_rate} onChange={handleChange}
                                    placeholder="85"
                                    className="input-field w-full h-[60px] text-lg font-bold px-6 bg-dark-bg"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-sm font-black text-gray-500 uppercase tracking-widest">Cumulative GPA (0-4.0)</label>
                                <input
                                    name="gpa" type="number" step="0.01" value={formData.gpa} onChange={handleChange}
                                    placeholder="3.2"
                                    className="input-field w-full h-[60px] text-lg font-bold px-6 bg-dark-bg"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                                <AlertTriangle className="w-6 h-6 text-orange-400" />
                            </div>
                            <h2 className="text-2xl font-black text-white">Qualitative Indicators</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Behavioral Observations</label>
                                <textarea
                                    name="behavioral_notes" value={formData.behavioral_notes} onChange={handleChange}
                                    placeholder="Mention disciplinary issues, lack of focus, or social concerns..."
                                    className="input-field w-full p-4 h-[120px] text-base font-bold bg-dark-bg"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Personal / Family Context</label>
                                <textarea
                                    name="personal_notes" value={formData.personal_notes} onChange={handleChange}
                                    placeholder="Economic situation, family distance from college, etc."
                                    className="input-field w-full p-4 h-[120px] text-base font-bold bg-dark-bg"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between mt-12 pt-8 border-t border-dark-border/20">
                    <button
                        onClick={step === 1 ? () => navigate('/') : prevStep}
                        className="text-gray-500 hover:text-white font-black text-lg uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                        {step === 1 ? 'Cancel' : <><ChevronLeft className="w-5 h-5" /> Back</>}
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={nextStep}
                            className="bg-accent-blue hover:bg-white text-white hover:text-accent-blue px-10 py-5 rounded-3xl font-black text-lg transition-all duration-500 shadow-2xl shadow-accent-blue/30 flex items-center gap-3"
                        >
                            Next Step <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="btn-primary group relative overflow-hidden px-14 py-6 rounded-3xl shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)]"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            <div className="flex items-center gap-4 relative z-10">
                                <Save className="w-6 h-6" />
                                <span className="text-xl font-black tracking-tight">{loading ? 'SAVING...' : 'FINALIZE REGISTRATION'}</span>
                            </div>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddStudent;
