import React, { useState } from 'react';
import { User, BookOpen, AlertTriangle, ChevronRight, ChevronLeft, Save, Plus, X, Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { studentService } from '../api/services';
import { useNavigate } from 'react-router-dom';

const AddStudent = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('manual'); // 'manual' or 'bulk'
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Manual Form Data
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

    // Bulk Import State
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const studentPayload = {
                name: formData.name,
                student_id: formData.student_id,
                grade: formData.grade,
                avatar_id: formData.name.substring(0, 2).toUpperCase(),
                attendance_rate: parseFloat(formData.attendance_rate),
                gpa: parseFloat(formData.gpa),
                academic_notes: formData.academic_notes,
                behavioral_notes: formData.behavioral_notes,
                personal_notes: formData.personal_notes
            };
            await studentService.createStudent(studentPayload);
            navigate('/');
        } catch (error) {
            console.error("Error creating student:", error);
        } finally {
            setLoading(false);
        }
    };

    // Bulk Import Handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleBulkUpload = () => {
        if (!file) return;
        setUploadStatus('uploading');

        // Simulate upload
        setTimeout(() => {
            setUploadStatus('success');
            // Reset after 2 seconds
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black text-white tracking-tight">Register New Student</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
                        {mode === 'manual' ? 'Single Entry Mode' : 'Bulk Import Mode'}
                    </p>
                </div>

                <div className="flex bg-dark-card rounded-xl p-1 border border-dark-border">
                    <button
                        onClick={() => setMode('manual')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'manual' ? 'bg-accent-blue text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Manual Entry
                    </button>
                    <button
                        onClick={() => setMode('bulk')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'bulk' ? 'bg-accent-blue text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Bulk Import
                    </button>
                </div>
            </div>

            {mode === 'manual' ? (
                <>
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
                </>
            ) : (
                <div className="card shadow-2xl border-dark-border/40 p-10 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20">
                            <FileSpreadsheet className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">Bulk Data Upload</h2>
                            <p className="text-gray-500 text-sm">Upload a CSV file containing student records.</p>
                        </div>
                        <button className="ml-auto text-accent-blue font-bold text-sm hover:underline">
                            Download Template
                        </button>
                    </div>

                    <div
                        className={`border-4 border-dashed rounded-3xl h-[300px] flex flex-col items-center justify-center transition-all duration-300 ${dragActive ? 'border-accent-blue bg-accent-blue/5 scale-[1.02]' : 'border-dark-border bg-dark-bg'
                            } ${file ? 'border-green-500/50 bg-green-500/5' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        {uploadStatus === 'success' ? (
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/30 animate-bounce">
                                    <CheckCircle2 className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-white">Upload Complete!</h3>
                                <p className="text-gray-400">Successfully processed student records.</p>
                            </div>
                        ) : uploadStatus === 'uploading' ? (
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <h3 className="text-2xl font-black text-white">Processing...</h3>
                                <p className="text-gray-400">Parsing CSV and updating database.</p>
                            </div>
                        ) : file ? (
                            <div className="text-center space-y-6">
                                <div className="w-16 h-16 bg-dark-card rounded-2xl flex items-center justify-center mx-auto border border-white/10">
                                    <FileSpreadsheet className="w-8 h-8 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white max-w-md truncate px-4">{file.name}</h3>
                                    <p className="text-gray-500 text-sm mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                                </div>
                                <div className="flex gap-4 justify-center">
                                    <button onClick={() => setFile(null)} className="text-gray-400 hover:text-white font-bold text-sm">Remove</button>
                                    <button
                                        onClick={handleBulkUpload}
                                        className="bg-accent-blue hover:bg-accent-purple text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-accent-blue/20 hover:-translate-y-1 transition-all"
                                    >
                                        Upload File
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-dark-card rounded-full flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
                                    <Upload className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-300">Drag & Drop CSV File</h3>
                                <p className="text-gray-500 text-sm mt-2 mb-6">or click to browse from your computer</p>
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="bg-dark-card hover:bg-white hover:text-dark-bg text-white px-8 py-3 rounded-xl font-bold text-sm border border-dark-border cursor-pointer transition-all"
                                >
                                    Browse Files
                                </label>
                            </>
                        )}
                    </div>

                    <div className="mt-8 p-6 bg-blue-500/5 rounded-xl border border-blue-500/10 flex gap-4">
                        <AlertCircle className="w-6 h-6 text-blue-400 shrink-0" />
                        <div className="space-y-1">
                            <h4 className="font-bold text-blue-400 text-sm">CSV Formatting Guide</h4>
                            <p className="text-gray-400 text-xs leading-relaxed">
                                Ensure your CSV has the following headers: <code className="bg-black/30 px-1 rounded text-gray-300">Student ID, Name, Grade, Attendance, GPA</code>.
                                <br />Detailed qualitative notes should be mapped to the <code className="bg-black/30 px-1 rounded text-gray-300">Notes</code> column if available.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddStudent;
