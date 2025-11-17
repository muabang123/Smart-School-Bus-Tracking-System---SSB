import React from 'react'
import Header from '../../components/admin/Header'
import Sidebar from '../../components/admin/Sidebar'
import './Dashboard.css'

function AdminInfoPage() {
  const [newAdmin, setNewAdmin] = React.useState({ fullName: '', email: '', phoneNumber: '', status: 'Active', password: '' })
  const [adminPassword, setAdminPassword] = React.useState('')
  const [message, setMessage] = React.useState('')

  const createAdmin = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const res = await fetch('http://localhost:5000/api/sql/auth/create-admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAdmin) })
      if (!res.ok) { const j = await res.json(); setMessage(j.message || 'Tạo thất bại'); return }
      setMessage('Tạo tài khoản admin thành công')
      setNewAdmin({ fullName: '', email: '', phoneNumber: '', status: 'Active', password: '' })
    } catch { setMessage('Không thể kết nối máy chủ') }
  }

  const changeAdminPassword = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const userId = localStorage.getItem('authUserId')
      const res = await fetch('http://localhost:5000/api/sql/auth/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: 'Admin', userId, newPassword: adminPassword }) })
      if (!res.ok) { const j = await res.json(); setMessage(j.message || 'Đổi mật khẩu thất bại'); return }
      setMessage('Đổi mật khẩu admin thành công')
      setAdminPassword('')
    } catch { setMessage('Không thể kết nối máy chủ') }
  }
  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar />
        <div className="main-content-container" style={{ padding: '24px' }}>
          <div className="content-header">
            <h2>Thông tin admin</h2>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, maxWidth: 720 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 12, columnGap: 16 }}>
              <span style={{ color: '#6b7280' }}>Tên</span>
              <span>Admin SSB</span>
              <span style={{ color: '#6b7280' }}>Mã QL</span>
              <span>ADM001</span>
              <span style={{ color: '#6b7280' }}>Email</span>
              <span>admin@ssb.local</span>
              <span style={{ color: '#6b7280' }}>Số điện thoại</span>
              <span>0901 234 567</span>
              <span style={{ color: '#6b7280' }}>Vai trò</span>
              <span>Quản trị hệ thống</span>
            </div>
          </div>
          <div style={{ marginTop: 24, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, maxWidth: 720 }}>
            <h3 style={{ marginTop: 0 }}>Tạo tài khoản Admin</h3>
            <form onSubmit={createAdmin} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', rowGap: 12, columnGap: 16 }}>
              <label>Họ tên</label>
              <input value={newAdmin.fullName} onChange={e => setNewAdmin({ ...newAdmin, fullName: e.target.value })} />
              <label>Email</label>
              <input value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} />
              <label>SĐT</label>
              <input value={newAdmin.phoneNumber} onChange={e => setNewAdmin({ ...newAdmin, phoneNumber: e.target.value })} />
              <label>Trạng thái</label>
              <select value={newAdmin.status} onChange={e => setNewAdmin({ ...newAdmin, status: e.target.value })}>
                <option>Active</option>
                <option>Locked</option>
              </select>
              <label>Mật khẩu</label>
              <input type="password" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} />
              <div></div>
              <button type="submit">Tạo</button>
            </form>
          </div>
          <div style={{ marginTop: 24, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, maxWidth: 720 }}>
            <h3 style={{ marginTop: 0 }}>Đổi mật khẩu Admin</h3>
            <form onSubmit={changeAdminPassword} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', rowGap: 12, columnGap: 16 }}>
              <label>Mật khẩu mới</label>
              <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} />
              <div></div>
              <button type="submit">Đổi mật khẩu</button>
            </form>
          </div>
          {message && <div style={{ marginTop: 16, color: '#374151' }}>{message}</div>}
        </div>
      </div>
    </div>
  )
}

export default AdminInfoPage