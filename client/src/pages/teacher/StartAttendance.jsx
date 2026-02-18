import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import api from '../../services/api';
import { RefreshCw, StopCircle, Users } from 'lucide-react';

const StartAttendance = () => {
    const [searchParams] = useSearchParams();
    const classIdFromUrl = searchParams.get('classId');

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(classIdFromUrl || '');
    const [session, setSession] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [studentCount, setStudentCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            const res = await api.get('/classes/teacher');
            setClasses(res.data);
        };
        fetchClasses();
    }, []);

    // Countdown timer
    useEffect(() => {
        if (!session || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [session, timeLeft]);

    // Live student count poller
    useEffect(() => {
        if (!session || !session.isActive) return;

        const poller = setInterval(async () => {
            try {
                const res = await api.get(`/attendance/session/${session.sessionId}`);
                setStudentCount(res.data.count);
            } catch (err) {
                console.error("Polling error", err);
            }
        }, 3000);

        return () => clearInterval(poller);
    }, [session]);

    const startSession = async () => {
        if (!selectedClass) return;
        setLoading(true);
        try {
            // Default 90 seconds expiry
            const res = await api.post('/attendance/start', { classId: selectedClass, expiresIn: 90 });
            setSession(res.data);
            setTimeLeft(90);
            setStudentCount(0);
        } catch (err) {
            console.error(err);
            alert('Failed to start session');
        } finally {
            setLoading(false);
        }
    };

    const stopSession = () => {
        setSession(null);
        setTimeLeft(0);
    };

    return (
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Start Attendance Session</h1>

            {!session ? (
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
                    <label className="block text-gray-700 mb-4 text-left">Select Class</label>
                    <select
                        className="w-full p-3 border rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        <option value="">-- Select a Class --</option>
                        {classes.map((cls) => (
                            <option key={cls._id} value={cls._id}>
                                {cls.classId} - {cls.subject}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={startSession}
                        disabled={!selectedClass || loading}
                        className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:bg-gray-400 flex justify-center items-center"
                    >
                        {loading ? 'Starting...' : <><PlayCircle className="mr-2" /> Start Session</>}
                    </button>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-100">
                    <div className="mb-4">
                        <span className={`px-4 py-1 rounded-full text-sm font-semibold ${timeLeft > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {timeLeft > 0 ? `Session Active: ${timeLeft}s remaining` : 'Session Expired'}
                        </span>
                    </div>

                    <div className="flex justify-center mb-8">
                        {timeLeft > 0 ? (
                            <div className="p-4 bg-white border-4 border-gray-800 rounded-lg">
                                <QRCodeCanvas
                                    value={JSON.stringify({ sessionId: session.sessionId })}
                                    size={300}
                                    level={"H"}
                                />
                            </div>
                        ) : (
                            <div className="w-[300px] h-[300px] flex items-center justify-center bg-gray-100 rounded-lg border-4 border-gray-300 text-gray-400">
                                QR Expired
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                        <div className="bg-blue-50 p-4 rounded text-center">
                            <p className="text-gray-500 text-sm">Students Marked</p>
                            <p className="text-3xl font-bold text-blue-800 flex justify-center items-center">
                                <Users className="w-6 h-6 mr-2" /> {studentCount}
                            </p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded text-center">
                            <p className="text-gray-500 text-sm">Status</p>
                            <p className="text-xl font-bold text-amber-800 mt-1">
                                {timeLeft > 0 ? 'Live' : 'Ended'}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={startSession}
                            className="flex items-center bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            <RefreshCw className="mr-2 w-4 h-4" /> Refresh / New QR
                        </button>
                        <button
                            onClick={stopSession}
                            className="flex items-center bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                        >
                            <StopCircle className="mr-2 w-4 h-4" /> Stop Session
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// StartSession Helper Icon
const PlayCircle = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
)

export default StartAttendance;
