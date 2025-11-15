import React from 'react'
import Header from '../../components/admin/Header'
import Sidebar from '../../components/admin/Sidebar'
import './Dashboard.css'

function AdminInfoPage() {
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
        </div>
      </div>
    </div>
  )
}

export default AdminInfoPage