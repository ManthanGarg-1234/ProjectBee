import { useState, useEffect } from 'react';
import api from '../../services/api';

const AttendanceReport = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [date, setDate] = useState('');
    const [report, setReport] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
            const res = await api.get('/classes/teacher');
            setClasses(res.data);
        };
        fetchClasses();
    }, []);

    const fetchReport = async () => {
        if (!selectedClass) return;
        try {
            const res = await api.get(`/attendance/report?classId=${selectedClass}&date=${date}`);
            setReport(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const exportCSV = () => {
        if (!report || !report.attendance) return;

        const rows = [['Student Name', 'Roll Number', 'Time Marked', 'Status']];
        report.attendance.forEach(record => {
            rows.push([
                record.studentId.name,
                record.studentId.rollNumber,
                new Date(record.markedAt).toLocaleTimeString(),
                'Present'
            ]);
        });

        let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "attendance_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Attendance Reports</h1>

            <div className="bg-white p-6 rounded-lg shadow mb-8 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-gray-700 mb-2">Class</label>
                    <select
                        className="w-full p-2 border rounded"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                            <option key={cls._id} value={cls._id}>{cls.subject}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-gray-700 mb-2">Date (Optional)</label>
                    <input
                        type="date"
                        className="w-full p-2 border rounded"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <button
                    onClick={fetchReport}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium h-10"
                >
                    View Report
                </button>
            </div>

            {report && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-700">Attendance Data</h3>
                        <button onClick={exportCSV} className="text-blue-600 hover:text-blue-800 font-medium">Download CSV</button>
                    </div>
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Marked</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {report.attendance.map((record) => (
                                <tr key={record._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.studentId.rollNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.studentId.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.markedAt).toLocaleTimeString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Present
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {report.attendance.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No attendance records found for this selection.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AttendanceReport;
