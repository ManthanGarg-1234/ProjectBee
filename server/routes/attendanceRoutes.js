const express = require('express');
const router = express.Router();
const { startSession, markAttendance, getSessionStatus, getReport } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/start', protect, authorize('teacher'), startSession);
router.post('/mark', protect, authorize('student'), markAttendance);
router.get('/report', protect, authorize('teacher'), getReport);
router.get('/session/:sessionId', protect, getSessionStatus);

module.exports = router;
