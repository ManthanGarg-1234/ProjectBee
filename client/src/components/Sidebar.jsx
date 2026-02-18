import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LayoutDashboard, Users, QrCode, ClipboardList, History } from 'lucide-react';

const Sidebar = () => {
    const { user } = useContext(AuthContext);

    // Dynamic links based on role
    const teacherLinks = [
        { path: '/teacher/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { path: '/teacher/classes', label: 'Classes', icon: <Users className="w-5 h-5" /> },
        { path: '/teacher/attendance/report', label: 'Reports', icon: <ClipboardList className="w-5 h-5" /> },
    ];

    const studentLinks = [
        { path: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { path: '/student/scan', label: 'Scan QR', icon: <QrCode className="w-5 h-5" /> },
        { path: '/student/history', label: 'History', icon: <History className="w-5 h-5" /> },
    ];

    const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

    return (
        <div className="w-64 bg-blue-900 text-white min-h-screen p-4">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-center">Menu</h2>
            </div>
            <ul className="space-y-2">
                {links.map((link) => (
                    <li key={link.path}>
                        <NavLink
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center p-3 rounded transition-colors ${isActive ? 'bg-blue-700 text-white' : 'hover:bg-blue-800 text-gray-300'
                                }`
                            }
                        >
                            <span className="mr-3">{link.icon}</span>
                            {link.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
