import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './Header.css';

const formatTimeAgo = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);

    if (seconds < 0) return `Sắp diễn ra`;

    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds} giây trước`;
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} tiếng trước`;
    return `${days} ngày trước`;
};

function NotificationBellModal({ isOpen, notifications, onClose }) { 
  const [modalContainer, setModalContainer] = useState(null);

  useEffect(() => {
    setModalContainer(document.getElementById('modal-root'));
  }, []);

  if (!modalContainer) {
    return null;
  }
  
  if (!isOpen) {
      return null;
  }

  return ReactDOM.createPortal(
    <div className="bell-modal-wrapper" onClick={onClose}>
        <div className="notification-bell-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bell-modal-header">
                <h3>Thông báo mới</h3>
                <button className="bell-modal-close-button" onClick={onClose}>×</button>
            </div>
            {notifications && notifications.length > 0 ? (
                <div className="bell-modal-list">
                    {notifications.map(noti => (
                        <div key={noti.id} className="bell-modal-item">
                            <span className="bell-modal-message">
                                <strong>{noti.licensePlate}:</strong> {noti.message}
                            </span>
                            <span className="bell-modal-timestamp">{formatTimeAgo(noti.timestamp)}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-notifications">Không có thông báo mới.</p>
            )}
            <Link to="/dashboard/notifications" className="view-all-link" onClick={onClose}>
                Xem tất cả thông báo
            </Link>
        </div>
    </div>,
    modalContainer
  );
}

export default NotificationBellModal;