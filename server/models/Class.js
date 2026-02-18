const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    classId: {
        type: String,
        required: true,
        unique: true
    },
    subject: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    students: [{
        type: String, // Storing roll numbers for easier management or ObjectIds if referencing User directly
        ref: 'User'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Class', ClassSchema);
