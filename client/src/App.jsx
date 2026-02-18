import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import Classes from './pages/teacher/Classes';
import CreateClass from './pages/teacher/CreateClass';
import StartAttendance from './pages/teacher/StartAttendance';
import AttendanceReport from './pages/teacher/AttendanceReport';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import ScanQR from './pages/student/ScanQR';
import MarkAttendance from './pages/student/MarkAttendance';
import AttendanceHistory from './pages/student/AttendanceHistory';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<DashboardLayout />}>

                            {/* Teacher Routes */}
                            <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                                <Route path="/teacher/classes" element={<Classes />} />
                                <Route path="/teacher/classes/create" element={<CreateClass />} />
                                <Route path="/teacher/attendance/start" element={<StartAttendance />} />
                                <Route path="/teacher/attendance/report" element={<AttendanceReport />} />
                            </Route>

                            {/* Student Routes */}
                            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                                <Route path="/student/dashboard" element={<StudentDashboard />} />
                                <Route path="/student/scan" element={<ScanQR />} />
                                <Route path="/student/mark-attendance" element={<MarkAttendance />} />
                                <Route path="/student/history" element={<AttendanceHistory />} />
                            </Route>

                        </Route>
                    </Route>

                    {/* Catch all - 404 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
