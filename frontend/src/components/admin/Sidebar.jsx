import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const menuItems = [
    { name: 'Trang tổng quan', path: '/dashboard' },
    { name: 'Quản lý tài khoản', path: '/dashboard/accounts' }, 
    { name: 'Quản lý lịch trình', path: '/dashboard/schedules' },
    { name: 'Quản lý tuyến đường', path: '/dashboard/routes' },
    { name: 'Quản lý xe', path: '/dashboard/vehicles' },
    { name: 'Quản lý tài xế', path: '/dashboard/drivers' },
    { name: 'Quản lý học sinh', path: '/dashboard/students' },
    { name: 'Thông báo', path: '/dashboard/notifications' },
    { name: 'Gửi tin nhắn', path: '/dashboard/message' }
  ];

  return (
    <div className="sidebar">
      <div className="admin-info">
        <h3>Thông tin quản lý</h3>
        <div className="info-item">
          <span className="label">Tên:</span>
        </div>
        <div className="info-item">
          <span className="label">Mã QL:</span>
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