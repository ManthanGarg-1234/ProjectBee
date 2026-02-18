import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import AuthContext from '../../context/AuthContext';
import { QrCode, History, BookOpen } from 'lucide-react';

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        enrolledClasses: 0,
        attendancePercentage: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            // In a real app we'd need a specific endpoint to aggregate this efficiently
            // For now, let's just fetch classes
            try {
                const classesRes = await api.get('/classes/student');
                setStats(prev => ({ ...prev, enrolledClasses: classesRes.data.length }));
            } catch (err) {
                console.error("Failed to fetch student stats", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name}</h1>
                <p className="text-gray-600">Ready to mark your attendance?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm uppercase">Enrolled Classes</p>
                            <h2 className="text-3xl font-bold text-gray-800">{stats.enrolledClasses}</h2>
                        </div>
                        <BookOpen className="text-blue-200 w-10 h-10" />
                    </div>
                </div>
                {/* 
                 <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <div className="flex justify-between items-center">
                        <div>
                             <p className="text-gray-500 text-sm uppercase">Overall Attendance</p>
                             <h2 className="text-3xl font-bold text-gray-800">{stats.attendancePercentage}%</h2>
                        </div>
                         <div className="text-green-200 text-4xl font-bold">%</div>
                    </div>
                </div>
                */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/student/scan" className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center justify-center flex-col">
                    <QrCode className="w-16 h-16 mb-4" />
                    <h3 className="text-xl font-bold">Scan QR Code</h3>
                    <p className="text-blue-100 mt-2">Mark your attendance now</p>
                </Link>

                <Link to="/student/history" className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-50 transition flex items-center justify-center flex-col border border-gray-200">
                    <History className="w-16 h-16 mb-4 text-gray-600" />
                    <h3 className="text-xl font-bold text-gray-800">View History</h3>
                    <p className="text-gray-500 mt-2">Check your past records</p>
                </Link>
            </div>
        </div>
    );
};

export default StudentDashboard;
