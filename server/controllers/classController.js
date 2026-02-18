const Class = require('../models/Class');
const User = require('../models/User');

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private/Teacher
const createClass = async (req, res) => {
    const { classId, subject, semester, studentRollNumbers } = req.body;

    try {
        // Parse studentRollNumbers from comma-separated string or array
        let students = [];
        if (typeof studentRollNumbers === 'string') {
            students = studentRollNumbers.split(',').map(s => s.trim()).filter(s => s);
        } else if (Array.isArray(studentRollNumbers)) {
            students = studentRollNumbers;
        }

        const newClass = await Class.create({
            classId,
            subject,
            semester,
            teacherId: req.user._id,
            students: students
        });

        res.status(201).json(newClass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get classes for logged in teacher
// @route   GET /api/classes/teacher
// @access  Private/Teacher
const getTeacherClasses = async (req, res) => {
    try {
        const classes = await Class.find({ teacherId: req.user._id });
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get classes where student is enrolled
// @route   GET /api/classes/student
// @access  Private/Student
const getStudentClasses = async (req, res) => {
    try {
        // Find classes where student's roll number is in the students array
        const classes = await Class.find({ students: req.user.rollNumber });
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single class by ID
// @route   GET /api/classes/:id
// @access  Private
const getClassById = async (req, res) => {
    try {
        const classItem = await Class.findById(req.params.id);
        if (classItem) {
            res.json(classItem);
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createClass, getTeacherClasses, getStudentClasses, getClassById };
