import React from 'react';


const formatTimeAgo = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds} giây trước`;
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} tiếng trước`;
  return `${days} ngày trước`;
};


function NotificationItem({ notification, onShowDetails }){
  const renderReportContent = () => {
    const { type, details } = notification.report;
    switch (type) {
      case 'LATE':
        return (
          <span className="report-content">
            <span className="icon">🕘</span> Xe trễ giờ
          </span>
        );
      case 'TRIP_START':
        return (
          <span className="report-content">
            <span className="icon green">🟢</span> Xe bắt đầu hành trình | {details.time}
          </span>
        );
      case 'TRIP_END':
        return (
          <span className="report-content">
            <span className="icon red">🔴</span> Xe kết thúc hành trình | {details.time}
          </span>
        );
        case 'BROKEN_DOWN_CAR':
        return (
          <span className="report-content">
            <span className="icon">🔧</span> Xe hỏng
          </span>
        );
        case 'ROAD_BLOCK':
        return (
          <span className="report-content">
            <span className="icon">🚧</span> Kẹt Xe
          </span>
        );
        case 'TRAFFIC_ACCIDENT':
        return (
          <span className="report-content">
            <span className="icon">💥</span> Tai nạn giao thông
          </span>
        );
        case 'CHANGE_ROUTE':
        return (
          <span className="report-content">
            <span className="icon">🔀</span> Thay đổi lộ trình
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="notification-item">
      <div className="item-header">
        <span className="license-plate">Xe {notification.licensePlate}</span>
        <span className="timestamp">{formatTimeAgo(notification.timestamp)}</span>
      </div>
      <div className="item-meta">
        Mã tuyến: {notification.routeCode} | TX: {notification.driverName}
      </div>
      <div className="item-report">
        <span>Báo cáo: </span>
        {renderReportContent()}
      </div>
      {notification.hasDetailsLink && (
        <div 
          className="item-details-link" 
          onClick={() => onShowDetails(notification)}
        >
          Click để xem chi tiết
        </div>
      )}
    </div>
  );
}

export default NotificationItem;