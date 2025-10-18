import React, { useState, useEffect } from 'react'; 
import './Header.css';
import { Link } from 'react-router-dom';
import NotificationBellModal from './NotificationBellModal';

const mockNewNotifications = [
    { 
        id: 'bell-1', 
        licensePlate: '51B-12345', 
        message: 'Xe tuyến 01 trễ 10 phút', 
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        isNew: true,
    },
    { 
        id: 'bell-2', 
        licensePlate: '51C-67890', 
        message: 'Xe tuyến 05 đã bắt đầu hành trình', 
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), 
        isNew: true,
    },
    { 
        id: 'bell-3', 
        licensePlate: '51D-00000', 
        message: 'Học sinh Nguyễn Văn A vắng mặt', 
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isNew: true,
    },
    { 
        id: 'bell-4', 
        licensePlate: '51E-11111', 
        message: 'Xe tuyến 02 đã kết thúc hành trình', 
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        isNew: false,
    },
];

function Header() {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Trong thực tế: Fetch thông báo mới nhất từ API ở đây
    // Ví dụ:
    // fetch('/api/latest-notifications')
    //   .then(res => res.json())
    //   .then(data => {
    //     setNotifications(data);
    //     setUnreadCount(data.filter(n => n.isNew).length);
    //   });
    const newNoti = mockNewNotifications.filter(n => n.isNew);
    setNotifications(newNoti.slice(0, 3));
    setUnreadCount(newNoti.length); 
  }, []);

  const toggleNotificationModal = () => {
    setShowNotificationModal(prev => !prev);
    if (!showNotificationModal) {
      setUnreadCount(0);
    }
  };

  const closeNotificationModal = () => {
    setShowNotificationModal(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/dashboard" className="home-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </Link>
      </div>
      <div className="header-center">
        <h1>SMART SCHOOL BUS</h1>
      </div>
      <div className="header-right">
        <div className="notification-bell-container">
          <div className="notification-bell" onClick={toggleNotificationModal}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.93 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>
          <NotificationBellModal 
            isOpen={showNotificationModal}
            notifications={notifications} 
            onClose={closeNotificationModal} 
          />
        </div>
        <Link to="/" className="logout-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
        </Link>
      </div>
    </header>
  )
}

export default Header;