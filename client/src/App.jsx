import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  })
  // Thêm state để quản lý trạng thái đang sửa sinh viên nào
  const [editingId, setEditingId] = useState(null)

  const getApiUrl = () => {
    const origin = window.location.origin;
    if (origin.includes('github.dev') || origin.includes('app.github.dev')) {
      return origin.replace('-5173', '-5000') + '/api/students';
    }
    return 'http://localhost:5000/api/students';
  };

  const API_URL = getApiUrl();

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Cập nhật handleSubmit: Xử lý cả THÊM (POST) và CẬP NHẬT (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        // Gọi API PUT để cập nhật sinh viên
        await axios.put(`${API_URL}/${editingId}`, formData)
        alert('Cập nhật sinh viên thành công!')
        setEditingId(null)
      } else {
        // Giữ nguyên logic POST thêm sinh viên
        await axios.post(API_URL, formData)
        alert('Thêm sinh viên thành công!')
      }
      setFormData({ studentId: '', name: '', email: '' })
      fetchStudents() 
    } catch (error) {
      console.error('Lỗi khi xử lý dữ liệu:', error)
      alert(editingId ? 'Cập nhật thất bại!' : 'Thêm sinh viên thất bại!')
    }
  }

  // Hàm đổ dữ liệu sinh viên lên Form để sửa
  const handleEdit = (student) => {
    setEditingId(student._id)
    setFormData({
      studentId: student.studentId || student.code || '',
      name: student.name || '',
      email: student.email || ''
    })
  }

  // Hàm hủy trạng thái chỉnh sửa
  const handleCancelEdit = () => {
    setEditingId(null)
    setFormData({ studentId: '', name: '', email: '' })
  }

  // Hàm gọi API DELETE để xóa sinh viên
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      try {
        await axios.delete(`${API_URL}/${id}`)
        alert('Xóa sinh viên thành công!')
        fetchStudents()
      } catch (error) {
        console.error('Lỗi khi xóa sinh viên:', error)
        alert('Xóa sinh viên thất bại!')
      }
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: '#000' }}>
      <h2>Quản lý Sinh viên</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="studentId"
            placeholder="Mã sinh viên (studentId)"
            value={formData.studentId}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
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
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: editingId ? '#28a745' : '#007bff', color: '#fff', border: 'none', borderRadius: '4px', marginRight: '10px' }}>
          {editingId ? 'Cập nhật sinh viên' : 'Thêm sinh viên'}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px' }}>
            Hủy
          </button>
        )}
      </form>

      <h3>Danh sách Sinh viên</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
        {students.length === 0 ? (
          <p>Chưa có sinh viên nào trong danh sách.</p>
        ) : (
          students.map((student) => (
            <div 
              key={student._id || student.studentId} 
              style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '15px', 
                backgroundColor: '#fff', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                textAlign: 'left'
              }}
            >
              <h4 style={{ margin: '0 0 8px 0', color: '#007bff' }}>
                {student.studentId || student.code}
              </h4>
              <p style={{ margin: '4px 0', fontWeight: 'bold' }}>
                {student.name}
              </p>
              <p style={{ margin: '4px 0', color: '#555', fontSize: '0.9em', wordBreak: 'break-all' }}>
                {student.email}
              </p>
              
              {/* Thêm các nút thao tác Sửa và Xóa vào từng thẻ */}
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleEdit(student)}
                  style={{ padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#000' }}
                >
                  Sửa
                </button>
                <button 
                  onClick={() => handleDelete(student._id)}
                  style={{ padding: '5px 10px', backgroundColor: '#dc3545', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#fff' }}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App