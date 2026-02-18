import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { PlusCircle, PlayCircle } from 'lucide-react';

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await api.get('/classes/teacher');
                setClasses(response.data);
            } catch (err) {
                console.error("Failed to fetch classes", err);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">My Classes</h1>
                <Link to="/teacher/classes/create" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700">
                    <PlusCircle className="mr-2 w-4 h-4" /> Create Class
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {classes.map((cls) => (
                            <tr key={cls._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cls.classId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.subject}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.semester}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.students.length}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link to={`/teacher/attendance/start?classId=${cls._id}`} className="text-green-600 hover:text-green-900 mr-4 flex items-center">
                                        <PlayCircle className="w-4 h-4 mr-1" /> Start Attendance
                                    </Link>
                                    {/* Link to view details or reports could go here */}
                                </td>
                            </tr>
                        ))}
                        {classes.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No classes found. Create one to get started.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Classes;
