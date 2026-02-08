import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Filter, ChevronDown, CheckCircle2, AlertCircle, FileSpreadsheet, Printer } from 'lucide-react';
import { studentService, interventionService } from '../api/services';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
    const [generating, setGenerating] = useState(false);
    const [selectedReport, setSelectedReport] = useState('high-risk');
    const [selectedFormat, setSelectedFormat] = useState('pdf');
    const [dateRange, setDateRange] = useState('current');
    const [recentReports, setRecentReports] = useState([
        { id: 1, name: 'High_Risk_Student_List_Oct2023.pdf', type: 'Risk Analysis', date: 'Oct 25, 2023', size: '2.4 MB', status: 'Ready' },
        { id: 2, name: 'Intervention_Outcomes_Q3.csv', type: 'Intervention', date: 'Oct 22, 2023', size: '856 KB', status: 'Ready' },
        { id: 3, name: 'Attendance_Summary_Sep2023.pdf', type: 'Attendance', date: 'Oct 01, 2023', size: '4.1 MB', status: 'Ready' },
        { id: 4, name: 'Dropout_Prediction_Model_v2.pdf', type: 'System Audit', date: 'Sep 15, 2023', size: '1.2 MB', status: 'Archived' },
    ]);

    const reportTypes = [
        { id: 'high-risk', label: 'High Risk Students List', desc: 'Detailed list of students with risk score > 70', icon: AlertCircle, color: 'text-red-500' },
        { id: 'intervention', label: 'Intervention Efficacy', desc: 'Success rates of applied support actions', icon: CheckCircle2, color: 'text-green-500' },
        { id: 'attendance', label: 'Chronic Absenteeism', desc: 'Students with < 85% attendance rate', icon: Calendar, color: 'text-orange-500' },
    ];

    const generatePDFReport = async (data, reportType) => {
        const doc = new jsPDF();
        const today = new Date().toLocaleDateString();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(99, 102, 241);
        doc.text('RiskGuard Analytics Report', 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated: ${today}`, 14, 27);
        doc.text(`Report Type: ${reportTypes.find(r => r.id === reportType)?.label || reportType}`, 14, 32);

        let tableData = [];
        let tableHeaders = [];

        if (reportType === 'high-risk') {
            const highRiskStudents = data.filter(s => s.risk_score >= 70);
            tableHeaders = [['Student ID', 'Name', 'Grade', 'Risk Score', 'Primary Factor', 'GPA', 'Attendance']];
            tableData = highRiskStudents.map(s => [
                s.student_id,
                s.name,
                s.grade,
                `${s.risk_score}/100`,
                s.factors?.split(', ')[0] || 'N/A',
                s.gpa?.toFixed(2) || 'N/A',
                `${s.attendance_rate}%`
            ]);
        } else if (reportType === 'attendance') {
            const lowAttendance = data.filter(s => s.attendance_rate < 85);
            tableHeaders = [['Student ID', 'Name', 'Grade', 'Attendance Rate', 'Risk Score', 'Last Event']];
            tableData = lowAttendance.map(s => [
                s.student_id,
                s.name,
                s.grade,
                `${s.attendance_rate}%`,
                `${s.risk_score}/100`,
                s.last_event || 'No recent activity'
            ]);
        } else if (reportType === 'intervention') {
            // For intervention reports, we expect intervention data
            tableHeaders = [['Student ID', 'Name', 'Intervention', 'Status', 'Priority', 'Progress', 'Next Date']];
            tableData = data.map(i => [
                i.studentId || 'N/A',
                i.name || 'N/A',
                i.tag || i.trigger || 'N/A',
                i.status || 'pending',
                i.priority || 'medium',
                i.goalProgress ? `${i.goalProgress}%` : '0%',
                i.nextDate || 'Not scheduled'
            ]);
        }

        doc.autoTable({
            head: tableHeaders,
            body: tableData,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 247, 250] },
            margin: { top: 40 }
        });

        // Add summary
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Total Students: ${tableData.length}`, 14, finalY);

        return doc;
    };

    const generateCSVReport = (data, reportType) => {
        let csvContent = '';
        let rows = [];

        if (reportType === 'high-risk') {
            const highRiskStudents = data.filter(s => s.risk_score >= 70);
            csvContent = 'Student ID,Name,Grade,Risk Score,Primary Factor,GPA,Attendance Rate\n';
            rows = highRiskStudents.map(s =>
                `${s.student_id},"${s.name}",${s.grade},${s.risk_score},"${s.factors?.split(', ')[0] || 'N/A'}",${s.gpa || 'N/A'},${s.attendance_rate}`
            );
        } else if (reportType === 'attendance') {
            const lowAttendance = data.filter(s => s.attendance_rate < 85);
            csvContent = 'Student ID,Name,Grade,Attendance Rate,Risk Score,Last Event\n';
            rows = lowAttendance.map(s =>
                `${s.student_id},"${s.name}",${s.grade},${s.attendance_rate},${s.risk_score},"${s.last_event || 'No recent activity'}"`
            );
        } else if (reportType === 'intervention') {
            csvContent = 'Student ID,Name,Intervention,Status,Priority,Progress,Next Date\n';
            rows = data.map(i =>
                `${i.studentId || 'N/A'},"${i.name || 'N/A'}","${i.tag || i.trigger || 'N/A'}",${i.status || 'pending'},${i.priority || 'medium'},${i.goalProgress || 0}%,"${i.nextDate || 'Not scheduled'}"`
            );
        }

        csvContent += rows.join('\n');
        return csvContent;
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            let reportData;

            // Fetch appropriate data based on report type
            if (selectedReport === 'intervention') {
                const response = await interventionService.getInterventions();
                // Flatten all intervention cards from all columns
                const allInterventions = [];
                Object.values(response.data).forEach(column => {
                    if (column.cards) {
                        allInterventions.push(...column.cards);
                    }
                });
                reportData = allInterventions;
            } else {
                // For student-based reports
                const response = await studentService.getStudents();
                reportData = response.data;
            }

            const timestamp = new Date().toISOString().split('T')[0];
            const reportLabel = reportTypes.find(r => r.id === selectedReport)?.label.replace(/\s+/g, '_');

            if (selectedFormat === 'pdf') {
                const pdf = await generatePDFReport(reportData, selectedReport);
                const fileName = `${reportLabel}_${timestamp}.pdf`;
                pdf.save(fileName);

                // Add to recent reports
                setRecentReports(prev => [{
                    id: Date.now(),
                    name: fileName,
                    type: reportTypes.find(r => r.id === selectedReport)?.label,
                    date: new Date().toLocaleDateString(),
                    size: '~250 KB',
                    status: 'Ready'
                }, ...prev]);
            } else {
                const csv = generateCSVReport(reportData, selectedReport);
                const fileName = `${reportLabel}_${timestamp}.csv`;

                // Create download link
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                link.click();

                // Add to recent reports
                setRecentReports(prev => [{
                    id: Date.now(),
                    name: fileName,
                    type: reportTypes.find(r => r.id === selectedReport)?.label,
                    date: new Date().toLocaleDateString(),
                    size: '~150 KB',
                    status: 'Ready'
                }, ...prev]);
            }

            alert(`${selectedFormat.toUpperCase()} report generated successfully!`);
        } catch (error) {
            console.error('Report generation error:', error);
            alert('Failed to generate report. Please ensure the backend is running.');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10 px-6">
            {/* Header */}
            <div className="flex items-center justify-between pt-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Analytics & Reporting</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">Generate lists and export data for compliance.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Generator Section */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-[#111827] p-8 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col h-full">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-6">Generate New Report</h3>

                            <div className="space-y-4">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Report Type</label>
                                <div className="space-y-3">
                                    {reportTypes.map((type) => (
                                        <div
                                            key={type.id}
                                            onClick={() => setSelectedReport(type.id)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 group ${selectedReport === type.id
                                                ? 'bg-accent-blue/10 border-accent-blue/50 ring-1 ring-accent-blue/50'
                                                : 'bg-[#1f2937] border-white/5 hover:bg-[#1f2937]/80 hover:border-white/10'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-lg bg-[#0f1523] flex items-center justify-center border border-white/5 ${type.color}`}>
                                                <type.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className={`font-bold text-sm ${selectedReport === type.id ? 'text-white' : 'text-gray-300'}`}>{type.label}</p>
                                                <p className="text-[10px] text-gray-500 font-medium">{type.desc}</p>
                                            </div>
                                            {selectedReport === type.id && <div className="ml-auto w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Format & Range</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setSelectedFormat('pdf')}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-xs transition-all ${selectedFormat === 'pdf'
                                            ? 'bg-accent-blue/10 border-accent-blue/50 text-accent-blue ring-1 ring-accent-blue/50'
                                            : 'bg-[#1f2937] border-white/5 hover:border-white/10 text-gray-300 hover:text-white hover:bg-[#2d3748]'
                                            }`}
                                    >
                                        <FileText className="w-4 h-4" />
                                        PDF Report
                                    </button>
                                    <button
                                        onClick={() => setSelectedFormat('csv')}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-xs transition-all ${selectedFormat === 'csv'
                                            ? 'bg-accent-blue/10 border-accent-blue/50 text-accent-blue ring-1 ring-accent-blue/50'
                                            : 'bg-[#1f2937] border-white/5 hover:border-white/10 text-gray-300 hover:text-white hover:bg-[#2d3748]'
                                            }`}
                                    >
                                        <FileSpreadsheet className="w-4 h-4" />
                                        CSV Data
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="w-full mt-8 py-4 bg-accent-blue hover:bg-accent-purple text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-accent-blue/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {generating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Printer className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Generate Report
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Recent Reports List */}
                <div className="lg:col-span-2">
                    <div className="bg-[#111827] rounded-3xl border border-white/5 overflow-hidden flex flex-col h-full relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#111827]">
                            <div>
                                <h3 className="text-xl font-bold text-white">Recent Reports</h3>
                                <p className="text-sm font-medium text-gray-500 mt-1">Archive of generated documents</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#1f2937] text-white text-xs font-bold rounded-xl hover:bg-[#374151] transition-colors border border-white/5 hover:border-white/10">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                        </div>

                        <div className="overflow-x-auto flex-1 bg-[#111827]">
                            <table className="w-full">
                                <thead className="bg-[#1f2937]/30">
                                    <tr>
                                        <th className="text-left py-5 px-8 text-xs font-bold text-gray-500 uppercase tracking-widest">Report Name</th>
                                        <th className="text-left py-5 px-8 text-xs font-bold text-gray-500 uppercase tracking-widest">Type</th>
                                        <th className="text-left py-5 px-8 text-xs font-bold text-gray-500 uppercase tracking-widest">Date Created</th>
                                        <th className="text-left py-5 px-8 text-xs font-bold text-gray-500 uppercase tracking-widest">Size</th>
                                        <th className="text-right py-5 px-8 text-xs font-bold text-gray-500 uppercase tracking-widest">Download</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {recentReports.map((report) => (
                                        <tr key={report.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="py-5 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 shadow-inner ${report.name.endsWith('.pdf') ? 'bg-red-500/5 text-red-500' : 'bg-green-500/5 text-green-500'
                                                        }`}>
                                                        {report.name.endsWith('.pdf') ? <FileText className="w-5 h-5" /> : <FileSpreadsheet className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-sm group-hover:text-accent-blue transition-colors">{report.name}</p>
                                                        <span className="inline-flex items-center gap-1.5 mt-1">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${report.status === 'Ready' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-gray-500'}`}></div>
                                                            <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{report.status}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8">
                                                <span className="px-3 py-1 rounded-lg bg-[#1f2937] border border-white/5 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                                    {report.type}
                                                </span>
                                            </td>
                                            <td className="py-5 px-8">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span className="text-xs font-bold uppercase tracking-wide">{report.date}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8">
                                                <span className="text-xs font-bold text-gray-500 font-mono">{report.size}</span>
                                            </td>
                                            <td className="py-5 px-8 text-right">
                                                <button className="w-10 h-10 rounded-xl bg-[#1f2937] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-accent-blue/30 hover:bg-accent-blue/10 transition-all group-hover:scale-110 shadow-lg shadow-black/20">
                                                    <Download className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
