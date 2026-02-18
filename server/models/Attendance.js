const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        ref: 'AttendanceSession'
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    markedAt: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String
    },
    deviceHash: {
        type: String
    }
}, { timestamps: true });

// Prevent duplicate attendance for same session and student
AttendanceSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
