import React, { useState, useEffect } from 'react';
import './ParentNotification.css';

// Chuẩn hóa các loại thông báo
const notificationTypes = {
  LATE: { text: 'Xe trễ giờ' },
  TRIP_START: { text: 'Bắt đầu hành trình' },
  TRIP_END: { text: 'Kết thúc hành trình' },
  BROKEN_DOWN_CAR: { text: 'Xe hỏng' },
  ROAD_BLOCK: { text: 'Kẹt xe' },
  TRAFFIC_ACCIDENT: { text: 'Tai nạn giao thông' },
  CHANGE_ROUTE: { text: 'Thay đổi lộ trình' },
};

// Dữ liệu mẫu (sẽ được dùng để giả lập phản hồi từ API)
const sampleNotifications = [
  {
    id: 1,
    title: 'Xe tuyến 03 đến trễ',
    type: 'ROAD_BLOCK',
    recipient: 'Tuyến 03',
    time: '18:36 11/9',
    content: 'Xe 03 đến trễ vì kẹt xe, dự kiến xe 03 có thể sẽ đến điểm đón muộn khoảng 6 phút.',
    route: 'Bến xe miền đông → Chợ Bến Thành → Trường ĐHSG'
  },
  {
    id: 2,
    title: 'Xe tuyến 01 thay đổi lộ trình',
    type: 'CHANGE_ROUTE',
    recipient: 'Tuyến 01',
    time: '12:20 13/10',
    content: 'Xe 01 thay đổi lộ trình do có sự cố trên đường. Lộ trình mới đã được cập nhật.',
    route: 'Công viên 23/9 → Nhà hát Thành phố → Dinh Độc Lập'
  },
  {
    id: 3,
    title: 'Xe tuyến 02 gặp tai nạn',
    type: 'TRAFFIC_ACCIDENT',
    recipient: 'Tuyến 02',
    time: '12:20 13/10',
    content: 'Xe 02 gặp tai nạn nhẹ, không có thiệt hại về người. Xe đang chờ xử lý.',
    route: 'Bến xe An Sương → Ngã tư Ga → Công viên phần mềm Quang Trung'
  },
   {
    id: 4,
    title: 'Xe tuyến 03 bắt đầu chạy',
    type: 'TRIP_START',
    recipient: 'Tuyến 03',
    time: '07:00 13/10',
    content: 'Xe 03 đã bắt đầu hành trình lúc 07:00. Phụ huynh vui lòng theo dõi lộ trình.',
    route: 'Bến xe miền đông → Chợ Bến Thành → Trường ĐHSG'
  },
];

// --- COMPONENT MODAL CHI TIẾT THÔNG BÁO ---
const NotificationDetailModal = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <div className="ph-notify-modal-backdrop" onClick={onClose}>
      <div className="ph-notify-detail-modal" onClick={(e) => e.stopPropagation()}>
        <header className="ph-notify-detail-header">
          <h2>Chi tiết thông báo</h2>
          <button onClick={onClose} className="ph-notify-detail-close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </header>
        <main className="ph-notify-detail-body">
          <p><strong>Tiêu đề thông báo:</strong> {notification.title}</p>
          <p><strong>Loại thông báo:</strong> {notificationTypes[notification.type]?.text}</p>
          <hr className="ph-notify-detail-divider" />
          <p><strong>Nội dung thông báo:</strong> {notification.content}</p>
          <p><strong>Người nhận:</strong> {notification.recipient}</p>
          <p><strong>Lộ trình:</strong> {notification.route}</p>
          <hr className="ph-notify-detail-divider" />
          <p><strong>Thời gian gửi:</strong> {notification.time}</p>
        </main>
      </div>
    </div>
  );
};

// --- COMPONENT MODAL GỬI THÔNG BÁO ---
const SendNotificationModal = ({ onClose, onSend, availableRoutes }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: Object.keys(notificationTypes)[0],
    content: '',
    recipient: 'ALL_ROUTES',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('Vui lòng nhập tiêu đề và nội dung thông báo.');
      return;
    }
    onSend(formData);
  };

  return (
    <div className="ph-notify-modal-backdrop" onClick={onClose}>
      <div className="ph-notify-send-modal" onClick={(e) => e.stopPropagation()}>
        <header className="ph-notify-detail-header">
          <h2>Gửi thông báo</h2>
          <button onClick={onClose} className="ph-notify-detail-close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </header>
        <main className="ph-notify-send-body">
          <form onSubmit={handleSubmit}>
            <div className="ph-notify-send-form-group">
              <label htmlFor="title">Tiêu đề thông báo:</label>
              <input 
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange} 
              />
            </div>
            <div className="ph-notify-send-form-group">
              <label htmlFor="type">Loại thông báo:</label>
              <select id="type" name="type" value={formData.type} onChange={handleChange}>
                {Object.entries(notificationTypes).map(([key, value]) => (
                  <option key={key} value={key}>{value.text}</option>
                ))}
              </select>
            </div>
            <div className="ph-notify-send-form-group">
              <label htmlFor="content">Nội dung thông báo:</label>
              <textarea 
                id="content"
                name="content"
                rows="4"
                value={formData.content}
                onChange={handleChange}
              ></textarea>
            </div>
             <div className="ph-notify-send-form-group">
              <label htmlFor="recipient">Người nhận:</label>
              <select id="recipient" name="recipient" value={formData.recipient} onChange={handleChange}>
                <option value="ALL_ROUTES">Tất cả các tuyến</option>
                {availableRoutes.map(route => (
                  <option key={route} value={route}>{route}</option>
                ))}
              </select>
            </div>
            <div className="ph-notify-send-footer">
              <button type="submit" className="ph-notify-send-submit-btn">Gửi</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};


// --- COMPONENT CHÍNH ---
const ParentNotification = () => {
  
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setNotifications(sampleNotifications);
      setIsLoading(false);
    }, 1000); 
  }, []);

  const uniqueRecipients = [...new Set(notifications.map(item => item.recipient))];

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setIsDetailModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsDetailModalOpen(false);
    setIsSendModalOpen(false);
    setSelectedNotification(null);
  };

  const handleSendNotification = (formData) => {
    const newNotificationFromServer = {
      id: Date.now(),
      title: formData.title,
      type: formData.type,
      recipient: formData.recipient === 'ALL_ROUTES' ? 'Tất cả các tuyến' : formData.recipient,
      time: new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }).format(new Date()),
      content: formData.content,
      route: formData.recipient !== 'ALL_ROUTES' ? sampleNotifications.find(n => n.recipient === formData.recipient)?.route || 'N/A' : 'N/A'
    };
    
    setNotifications([newNotificationFromServer, ...notifications]);
    handleCloseModals();
    alert('Gửi thông báo thành công!');
  };

  const filteredNotifications = notifications
    .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(item => {
      if (sortBy === 'ALL') return true;
      return item.type === sortBy;
    });

  return (
    <div className="ph-notify-container">
      <header className="ph-notify-header">
        <h1>Thông báo cho phụ huynh</h1>
      </header>

      <main className="ph-notify-main">
        <button 
          className="ph-notify-action-button"
          onClick={() => setIsSendModalOpen(true)}
        >
          Gửi thông báo
        </button>

        <section className="ph-notify-history">
          <div className="ph-notify-history-controls">
            <h2>Lịch sử gửi thông báo</h2>
            <div className="ph-notify-filters">
              <div className="ph-notify-search-bar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Tìm theo tiêu đề..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="ph-notify-sort-by">
                <label htmlFor="sort-select">Loại:</label>
                <select id="sort-select" className="ph-notify-sort-select" value={sortBy} onChange={handleSortChange}>
                  <option value="ALL">Tất cả</option>
                  {Object.entries(notificationTypes).map(([key, value]) => (
                    <option key={key} value={key}>{value.text}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="ph-notify-list">
            <div className="ph-notify-list-header">
              <span>Tiêu đề</span>
              <span>Loại</span>
              <span>Người nhận</span>
              <span>Thời gian</span>
            </div>
            
            {isLoading ? (
              <div className="ph-notify-loading-state">Đang tải dữ liệu...</div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((item) => (
                <div key={item.id} className="ph-notify-list-item">
                  <span className="ph-notify-item-title">{item.title}</span>
                  <span>{notificationTypes[item.type]?.text || item.type}</span>
                  <span>{item.recipient}</span>
                  <span>{item.time}</span>
                  <button 
                    className="ph-notify-view-button"
                    onClick={() => handleViewDetails(item)}
                  >
                    Xem
                  </button>
                </div>
              ))
            ) : (
              <div className="ph-notify-empty-state">Không có thông báo nào.</div>
            )}
          </div>
        </section>
      </main>

      {isDetailModalOpen && 
        <NotificationDetailModal 
          notification={selectedNotification} 
          onClose={handleCloseModals} 
        />
      }
      {isSendModalOpen &&
        <SendNotificationModal
          onClose={handleCloseModals}
          onSend={handleSendNotification}
          availableRoutes={uniqueRecipients}
        />
      }
    </div>
  );
};

export default ParentNotification;