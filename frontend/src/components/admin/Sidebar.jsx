import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const role = localStorage.getItem('authRole')
  const menuItems = role === 'Driver'
    ? [
        { name: 'Trang tổng quan', path: '/driver/dashboard' },
        { name: 'Lịch làm việc', path: '/driver/schedule' },
        { name: 'Thông báo', path: '/driver/notifications' },
        { name: 'Gửi tin nhắn', path: '/driver/messages' }
      ]
    : [
        { name: 'Trang tổng quan', path: '/dashboard' },
        { name: 'Thông tin admin', path: '/dashboard/admin-info' },
        { name: 'Quản lý tài khoản', path: '/dashboard/accounts' }, 
        { name: 'Quản lý lịch trình', path: '/dashboard/schedules' },
        { name: 'Quản lý tuyến đường', path: '/dashboard/routes' },
        { name: 'Quản lý xe', path: '/dashboard/vehicles' },
        { name: 'Quản lý tài xế', path: '/dashboard/drivers' },
        { name: 'Quản lý học sinh', path: '/dashboard/students' },
        { name: 'Thông báo', path: '/dashboard/notifications' },
        { name: 'Gửi tin nhắn', path: '/dashboard/message' }
      ]

  return (
    <div className="sidebar">
      <div className="admin-info">
        <h3>{role === 'Driver' ? 'Thông tin tài xế' : 'Thông tin quản lý'}</h3>
        <div className="info-item">
          <span className="label">Tên:</span>
        </div>
        <div className="info-item">
          <span className="label">{role === 'Driver' ? 'Mã TX:' : 'Mã QL:'}</span>
        </div>
      </div>

      <div className="menu-section">
        <h3>Bảng thao tác</h3>
        <div className="menu-items">
          {menuItems.map((item, index) => (
            <NavLink 
              key={index} 
              to={item.path}
              end={item.path === '/dashboard'} 
              className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;