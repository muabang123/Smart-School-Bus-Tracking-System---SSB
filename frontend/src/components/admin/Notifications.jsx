import React, { useState, useEffect } from 'react';
import NotificationItem from './NotificationItem';
import NotificationDetailModal from './NotificationDetailModal';
import './Notifications.css';

// --- DỮ LIỆU MẪU ---
// Backend sẽ trả về một mảng các object có cấu trúc tương tự như thế này.
const mockNotifications = [
 {
   id: 1,
   licensePlate: '51B-31568',
   routeCode: '03',
   driverName: 'Lương Chước Minh',
   timestamp: new Date('2025-10-15T12:25:00').toISOString(),
   report: {
     type: 'LATE',
   },
   hasDetailsLink: true,
   details: {
       routePath: 'Bến xe miền đông ⇒ Chợ Bến Thành ⇒ Trường ĐHSG',
       incidentType: 'Xe đến trễ',
       incidentDescription: 'Do tình hình kẹt xe nghiêm trọng tại khu vực ngã tư Hàng Xanh, xe buýt tuyến 03 đã không thể đến điểm đón đúng giờ dự kiến.'
   }
 },
 {
    id: 2,
    licensePlate: '51B-31568',
    routeCode: '03',
    driverName: 'Lương Chước Minh',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 giờ trước
    report: {
      type: 'TRIP_START',
      details: { time: '09:30' },
    },
    hasDetailsLink: false, // Không có chi tiết
 },
 {
    id: 3,
    licensePlate: '51B-31868',
    routeCode: '01',
    driverName: 'Lương Mon',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 giờ trước
    report: {
      type: 'TRIP_END',
      details: { time: '08:23' },
    },
    hasDetailsLink: false, // Không có chi tiết
  },
 {
   id: 4,
   licensePlate: '36B-36363',
   routeCode: '01',
   driverName: 'Ngô Quang Liêm',
   timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 - 10000).toISOString(),
   report: {
     type: 'CHANGE_ROUTE',
   },
   hasDetailsLink: true,
   details: {
       routePath: 'Công viên Gia Định ⇒ Sân bay Tân Sơn Nhất',
       incidentType: 'Thay đổi lộ trình',
       incidentDescription: 'Do sự kiện đặc biệt tại trung tâm thành phố, tuyến 01 sẽ thay đổi lộ trình như sau: Bắt đầu từ Công viên Gia Định, đi qua đường Phổ Quang, rẽ vào Trường Sơn và kết thúc tại Sân bay Tân Sơn Nhất. Vui lòng thông báo cho hành khách về sự thay đổi này.'
   }
 },
 {
    id: 5,
    licensePlate: '69C-987.65',
    routeCode: '05',
    driverName: 'Trần Trung Kiên',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 giờ trước
    report: {
      type: 'LATE',
    },
    hasDetailsLink: true,
    details: {
        routePath: 'Khu công nghệ cao ⇒ Ngã tư Thủ Đức',
        incidentType: 'Sự cố kỹ thuật',
        incidentDescription: 'Xe gặp sự cố nhỏ về động cơ, đã khắc phục và tiếp tục hành trình trễ 15 phút.'
    }
  },
  {
    id: 6,
    licensePlate: '51C-987.65',
    routeCode: '05',
    driverName: 'Trần Văn Bê',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 ngày trước
    report: {
      type: 'BROKEN_DOWN_CAR',
    },
    hasDetailsLink: true,
    details: {
        routePath: 'Khu công nghệ cao ⇒ Ngã tư Thủ Đức',
        incidentType: 'Xe bị hỏng',
        incidentDescription: 'Xe buýt tuyến 05 đã bị hỏng giữa đường do sự cố về hệ thống phanh, hiện đang được sửa chữa.'
    }
  },
];

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  // --- STATE MỚI ĐỂ QUẢN LÝ MODAL ---
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const handleShowDetails = (notification) => {
    setSelectedNotification(notification);
  };

  const handleCloseDetails = () => {
    setSelectedNotification(null);
  };

  const filteredNotifications = notifications.filter(noti => {
    if (filter === 'all') return true;
    return noti.report.type === filter;
  });

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Thông báo</h1>
        <div className="filter-container">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="notification-filter">
                <option value="all">Lọc: Tất cả</option>
                <option value="LATE">Xe trễ giờ</option>
                <option value="TRIP_START">Bắt đầu hành trình</option>
                <option value="TRIP_END">Kết thúc hành trình</option>
                <option value="BROKEN_DOWN_CAR">Xe hỏng</option>
                <option value="ROAD_BLOCK">Kẹt xe</option>
                <option value="TRAFFIC_ACCIDENT">Tai nạn giao thông</option>
                <option value="CHANGE_ROUTE">Thay đổi lộ trình</option>
            </select>
        </div>
      </div>
      <div className="notifications-list">
        {filteredNotifications.map(notification => (
          <NotificationItem 
            key={notification.id} 
            notification={notification} 
            // --- TRUYỀN HÀM XỬ LÝ XUỐNG COMPONENT CON ---
            onShowDetails={handleShowDetails} 
          />
        ))}
      </div>

      {/* --- RENDER MODAL KHI CÓ DỮ LIỆU --- */}
      <NotificationDetailModal 
        notification={selectedNotification} 
        onClose={handleCloseDetails} 
      />
    </div>
  );
}

export default Notifications;