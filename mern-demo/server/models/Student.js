const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { 
    type: String, 
    required: [true, 'Mã sinh viên là bắt buộc'], 
    unique: true 
  },
  name: { 
    type: String, 
    required: [true, 'Tên sinh viên là bắt buộc'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email là bắt buộc'] 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Student', studentSchema, 'students');