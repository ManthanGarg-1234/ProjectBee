const AttendanceSession = require('../models/AttendanceSession');
const Attendance = require('../models/Attendance');
const Class = require('../models/Class');
const { v4: uuidv4 } = require('uuid');

// @desc    Start a new attendance session
// @route   POST /api/attendance/start
// @access  Private/Teacher
const startSession = async (req, res) => {
    const { classId, expiresIn } = req.body; // expiresIn in seconds

    try {
        const classItem = await Class.findById(classId);
        if (!classItem) {
            return res.status(404).json({ message: 'Class not found' });
        }

        if (classItem.teacherId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to start session for this class' });
        }

        const sessionId = uuidv4();
        const expiresAt = new Date(Date.now() + expiresIn * 1000);

        const session = await AttendanceSession.create({
            sessionId,
            classId,
            teacherId: req.user._id,
            expiresAt,
            isActive: true
        });

        res.status(201).json(session);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Mark attendance
// @route   POST /api/attendance/mark
// @access  Private/Student
const markAttendance = async (req, res) => {
    const { sessionId, location } = req.body; // location is optional

    try {
        const session = await AttendanceSession.findOne({ sessionId });
        if (!session) {
            return res.status(404).json({ message: 'Invalid Session ID' });
        }

        if (new Date() > session.expiresAt || !session.isActive) {
            return res.status(400).json({ message: 'Session Expired' });
        }

        // Check if student is enrolled in the class
        const classItem = await Class.findById(session.classId);
        if (!classItem.students.includes(req.user.rollNumber)) {
            return res.status(403).json({ message: 'You are not enrolled in this class' });
        }

        // Check if already marked
        const existingAttendance = await Attendance.findOne({
            sessionId,
            studentId: req.user._id
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance already marked' });
        }

        const attendance = await Attendance.create({
            sessionId,
            studentId: req.user._id,
            ipAddress: req.ip,
            deviceHash: req.headers['user-agent']
        });

        res.status(201).json({ message: 'Attendance Marked Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get session status and count
// @route   GET /api/attendance/session/:sessionId
// @access  Private
const getSessionStatus = async (req, res) => {
    try {
        const session = await AttendanceSession.findOne({ sessionId: req.params.sessionId });
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const count = await Attendance.countDocuments({ sessionId: req.params.sessionId });
        res.json({ ...session.toObject(), count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get report for a class
// @route   GET /api/attendance/report
// @access  Private/Teacher
const getReport = async (req, res) => {
    const { classId, date } = req.query;

    try {
        // Find sessions for this class (and optionally date)
        let query = { classId, teacherId: req.user._id };

        if (date) {
            const start = new Date(date);
            const end = new Date(date);
            end.setDate(end.getDate() + 1);
            query.createdAt = { $gte: start, $lt: end };
        }

        const sessions = await AttendanceSession.find(query).sort({ createdAt: -1 });
        const sessionIds = sessions.map(s => s.sessionId);

        const attendance = await Attendance.find({ sessionId: { $in: sessionIds } })
            .populate('studentId', 'name rollNumber email');

        res.json({ sessions, attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { startSession, markAttendance, getSessionStatus, getReport };
