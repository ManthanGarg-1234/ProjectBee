const express = require('express');
const router = express.Router();
const { createClass, getTeacherClasses, getStudentClasses, getClassById } = require('../controllers/classController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('teacher'), createClass);
router.get('/teacher', protect, authorize('teacher'), getTeacherClasses);
router.get('/student', protect, authorize('student'), getStudentClasses);
router.get('/:id', protect, getClassById);

module.exports = router;
