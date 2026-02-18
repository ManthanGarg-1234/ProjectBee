import { useEffect, useState, useContext } from 'react';
import api from '../../services/api';
import AuthContext from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { PlusCircle, PlayCircle, Users } from 'lucide-react';

const TeacherDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalClasses: 0,
        totalStudents: 0, // Placeholder as we don't have a direct endpoint for this summary yet
        sessionsToday: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch classes to count
                const classesRes = await api.get('/classes/teacher');
                // Fetch today's report to count sessions
                const reportRes = await api.get(`/attendance/report?date=${new Date().toISOString().split('T')[0]}`);

                setStats({
                    totalClasses: classesRes.data.length,
                    totalStudents: 0, // Would need a more complex aggregation or loop
                    sessionsToday: reportRes.data.sessions.length
                });
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Welcome Back, {user.name}</h1>
                <p className="text-gray-600">Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm uppercase">Active Classes</p>
                            <h2 className="text-3xl font-bold text-gray-800">{stats.totalClasses}</h2>
                        </div>
                        <Users className="text-blue-200 w-10 h-10" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm uppercase">Sessions Today</p>
                            <h2 className="text-3xl font-bold text-gray-800">{stats.sessionsToday}</h2>
                        </div>
                        <PlayCircle className="text-green-200 w-10 h-10" />
                    </div>
                </div>
                {/* Placeholder card */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm uppercase">Quick Action</p>
                            <Link to="/teacher/classes/create" className="text-amber-600 font-semibold hover:underline">Create Class</Link>
                        </div>
                        <PlusCircle className="text-amber-200 w-10 h-10" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link to="/teacher/classes/create" className="flex items-center p-3 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition">
                            <PlusCircle className="mr-3 w-5 h-5" /> Create New Class
                        </Link>
                        <Link to="/teacher/classes" className="flex items-center p-3 bg-green-50 text-green-700 rounded hover:bg-green-100 transition">
                            <PlayCircle className="mr-3 w-5 h-5" /> Start Attendance Session
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
