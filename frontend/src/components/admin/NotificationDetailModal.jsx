// NotificationDetailModal.js (File mới)

import React from 'react';

// Helper function để định dạng ngày giờ cho modal
const formatModalTimestamp = (isoString) => {
    const date = new Date(isoString);
    const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const day = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    return `${time} ngày ${day}`;
};

function NotificationDetailModal({ notification, onClose }) {
  // Nếu không có notification, không render gì cả
  if (!notification) return null;

  return (
    // Lớp phủ toàn màn hình
    <div className="modal-overlay" onClick={onClose}>
      {/* Nội dung modal, ngăn sự kiện click lan ra lớp phủ */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Chi tiết thông báo</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="detail-row">
            <strong>Thời gian:</strong> {formatModalTimestamp(notification.timestamp)}
          </div>
          <div className="detail-row">
            <strong>Tuyến xe:</strong> {notification.routeCode}
          </div>
          <div className="detail-row">
            <strong>Lộ trình:</strong> {notification.details?.routePath || 'Không có thông tin'}
          </div>
          <div className="detail-row">
            <strong>Biển số xe:</strong> {notification.licensePlate}
          </div>
          <div className="detail-row">
            <strong>Lái xe:</strong> {notification.driverName}
          </div>
          
          <div className="detail-row incident-box">
            <label>Loại sự cố:</label>
            <div className="incident-content">
                {notification.details?.incidentType || 'Chưa xác định'}
            </div>
          </div>

          <div className="detail-row incident-box">
            <label>Mô tả sự cố:</label>
            <div className="incident-content description">
                {notification.details?.incidentDescription || 'Không có mô tả chi tiết.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationDetailModal;