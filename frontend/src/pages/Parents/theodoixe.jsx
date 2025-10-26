import React from 'react';
import './theodoixe.css'; // Đảm bảo tên file CSS là 'theodoixe.css'
import Header from '../../components/Parents/Header'; 
import mapImage from '../../assets/a2 1.png'; // Đảm bảo đường dẫn đúng tới ảnh   

const TheodoiXePage = () => {
  return (
    <div className="tracking-container">
      <Header />
      <main className="tracking-content">
        {/* Phần bản đồ sẽ hiển thị ảnh a2 1.png */}
        <div className="map-area" style={{ backgroundImage: `url(${mapImage})` }}>
          {/* Thông tin trạng thái trên bản đồ */}
          <div className="status-overlay">
            <p className="bus-status">
              <span className="status-icon active"></span>
              Trạng thái xe : <strong>đang hoạt động</strong>
            </p>
            <p className="student-name">
              Tên học sinh : <span className="highlight"></span>
            </p>
          </div>
        </div>

        {/* Thanh thông tin phía dưới */}
        <footer className="info-bar">
          <div className="info-item">
            <strong>Tên tài xế:</strong> <span></span>
          </div>
          <div className="info-item">
            <strong>Tuyến:</strong> <span></span>
          </div>
          <div className="info-item">
            <strong>Giờ đón (dự kiến):</strong> <span></span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default TheodoiXePage;