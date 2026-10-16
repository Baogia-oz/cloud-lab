
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5000',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }

    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

// Kiểm tra backend
app.get('/', (req, res) => {
  res.status(200).send('Backend đang hoạt động!');
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend đang hoạt động!' });
});

// Lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Thêm sinh viên
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Sửa sinh viên
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: 'Không tìm thấy sinh viên'
      });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({
        message: 'Không tìm thấy sinh viên'
      });
    }

    res.json({ message: 'Đã xóa sinh viên thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Khởi động backend sau khi kết nối MongoDB
async function startServer() {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('Chưa cấu hình biến môi trường MONGODB_URI');
    }

    await mongoose.connect(uri);
    console.log('Kết nối MongoDB Atlas thành công!');

    
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend đang chạy tại cổng ${PORT}`);
    });
  } catch (error) {
    console.error('Lỗi khởi động backend:', error);
    process.exit(1);
  }
}

startServer();
