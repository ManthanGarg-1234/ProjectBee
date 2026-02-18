import { useEffect, useState, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import AuthContext from '../../context/AuthContext';
import { CheckCircle, XCircle } from 'lucide-react';

const MarkAttendance = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('sessionId');
    const { user } = useContext(AuthContext);

    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');
    const [location, setLocation] = useState(null);

    useEffect(() => {
        if (!sessionId) {
            setStatus('error');
            setMessage('No Session ID provided.');
            return;
        }

        const mark = async () => {
            try {
                // Optional: Get geolocation here if we were implementing geofencing
                await api.post('/attendance/mark', { sessionId });
                setStatus('success');
                setMessage('Attendance Marked Successfully!');
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Failed to mark attendance.');
            }
        };

        // Simulating a small delay for UX so user sees 'Marking...'
        setTimeout(mark, 1000);

    }, [sessionId]);

    return (
        <div className="flex flex-col items-center justify-center pt-10 px-4 text-center">
            {status === 'loading' && (
                <div className="animate-pulse">
                    <div className="h-12 w-12 bg-blue-400 rounded-full mb-4 mx-auto"></div>
                    <h2 className="text-2xl font-bold text-gray-700">Marking Attendance...</h2>
                    <p className="text-gray-500">Please wait while we verify your session.</p>
                </div>
            )}

            {status === 'success' && (
                <div className="bg-green-50 p-8 rounded-lg shadow-md border border-green-200">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-green-800 mb-2">Success!</h2>
                    <p className="text-green-700 mb-6">{message}</p>
                    <Link to="/student/dashboard" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                        Back to Dashboard
                    </Link>
                </div>
            )}

            {status === 'error' && (
                <div className="bg-red-50 p-8 rounded-lg shadow-md border border-red-200">
                    <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-red-800 mb-2">Failed</h2>
                    <p className="text-red-700 mb-6">{message}</p>
                    <div className="space-x-4">
                        <Link to="/student/scan" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                            Try Again
                        </Link>
                        <Link to="/student/dashboard" className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700">
                            Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarkAttendance;
