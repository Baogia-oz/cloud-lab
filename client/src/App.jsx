import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [formData, setFormData] = useState({
    mssv: '',
    fullname: '',
    email: ''
  })

  // Đổi port 5000 thành port backend của bạn nếu khác
  const API_URL = 'http://localhost:5000/api/students'

  // Câu 47: Lấy danh sách sinh viên từ Backend API
  const fetchStudents = async () => {
    try {
      const res = await axios.get(API_URL)
      setStudents(res.data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sinh viên:', error)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Câu 48: Xử lý thay đổi dữ liệu trong Form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Câu 49: Gửi dữ liệu qua POST API
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(API_URL, formData)
      alert('Thêm sinh viên thành công!')
      setFormData({ mssv: '', fullname: '', email: '' })
      fetchStudents() // Tải lại danh sách sau khi thêm
    } catch (error) {
      console.error('Lỗi khi thêm sinh viên:', error)
      alert('Thêm sinh viên thất bại!')
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Quản lý Sinh viên</h2>

      {/* Câu 48 & 49: Form nhập thông tin sinh viên */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="mssv"
            placeholder="MSSV"
            value={formData.mssv}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="fullname"
            placeholder="Họ và tên"
            value={formData.fullname}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Thêm sinh viên
        </button>
      </form>

      {/* Câu 47: Hiển thị danh sách sinh viên */}
      <h3>Danh sách Sinh viên</h3>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ và tên</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id || student.mssv}>
              <td>{student.mssv}</td>
              <td>{student.fullname}</td>
              <td>{student.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App