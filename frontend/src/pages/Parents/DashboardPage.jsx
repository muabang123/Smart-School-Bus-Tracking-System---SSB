import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

// SỬA LỖI ĐƯỜNG DẪN Ở ĐÂY
import Header from '../../components/Parents/Header';
import ThongBaoPopup from './thongbao'; // thongbao.jsx nằm cùng thư mục

const DashboardPage = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleTrackBus = () => {
    navigate('/tracking'); 
  };

  return (
    <div className="dashboard-background">
      <Header />
      <main className="dashboard-content">
        <div className="left-panels">
          <div className="info-panel">
            <h2 className="info-panel-title">Thông tin tài khoản</h2>
            <p><strong>Tên:</strong></p>
            <p><strong>Mã PH:</strong></p>
            <p><strong>SĐT:</strong></p>
          </div>
          <div className="info-panel">
            <h2 className="info-panel-title">Thông tin con</h2>
            <p><strong>Tên:</strong></p>
            <p><strong>Lớp:</strong></p>
            <p><strong>MSHS:</strong></p>
            <p><strong>Tình trạng:</strong></p>
            <p><strong>Điểm đón:</strong></p>
          </div>
        </div>
        
        <div className="action-panel">
          <h2 className="info-panel-title">Bảng thao tác</h2>
          <div className="button-container">
            <button className="action-button" onClick={handleTrackBus}>
              Theo dõi xe
            </button>
            <button 
              className="action-button" 
              onClick={() => setShowNotifications(true)}
            >
              Thông báo
            </button>
          </div>
        </div>
      </main>

      {showNotifications && (
        <ThongBaoPopup 
          onClose={() => setShowNotifications(false)} 
          onNavigateToTracking={handleTrackBus}
        />
      )}
    </div>
  );
};

export default DashboardPage;
