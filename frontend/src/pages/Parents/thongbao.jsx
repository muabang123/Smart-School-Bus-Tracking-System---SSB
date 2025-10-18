import React, { useState } from 'react';
import './thongbao.css'; // Đảm bảo đường dẫn CSS đúng

// Dữ liệu ban đầu cho thông báo
const initialNotifications = [
  { id: 1, title: 'Hệ thống cập nhật phiên bản mới', detail: 'Nội dung chi tiết của thông báo 1. Phiên bản 2.0 đã được cập nhật với nhiều tính năng bảo mật và cải thiện hiệu năng.', status: 'unread' },
  { id: 2, title: 'Lịch bảo trì đột xuất', detail: 'Hệ thống sẽ tiến hành bảo trì từ 2:00 AM đến 3:00 AM ngày mai. Mong quý khách thông cảm.', status: 'unread' },
  { id: 3, title: 'Thông báo nghỉ lễ 30/4', detail: 'Công ty sẽ nghỉ lễ từ ngày 30/4 đến hết ngày 1/5. Kính chúc quý khách một kỳ nghỉ vui vẻ!', status: 'read' },
  { id: 4, title: 'Khuyến mãi đặc biệt tháng 10', detail: 'Nhân dịp tháng 10, chúng tôi có chương trình khuyến mãi giảm giá 50% cho tất cả các dịch vụ.', status: 'read' },
  { id: 5, title: 'Mời tham gia khảo sát', detail: 'Chúng tôi rất mong nhận được ý kiến đóng góp của bạn để cải thiện chất lượng dịch vụ. Vui lòng tham gia khảo sát tại đây.', status: 'read' },
  { id: 6, title: 'Cảnh báo tài khoản', detail: 'Chúng tôi phát hiện có hoạt động đăng nhập bất thường từ một địa điểm lạ. Vui lòng kiểm tra và bảo mật tài khoản của bạn.', status: 'read' },
];

const ThongBaoPopup = ({ onClose }) => {
  // 1. Quản lý danh sách thông báo bằng State để có thể thay đổi được
  const [notificationList, setNotificationList] = useState(initialNotifications);
  const [selectedNotification, setSelectedNotification] = useState(null);

 const handlePopupClick = (e) => {
   e.stopPropagation();
  };

  const handleNotificationClick = (clickedNotification) => {
    // 2. Cập nhật trạng thái của thông báo đã nhấn thành "read"
    // Chúng ta tạo ra một mảng mới thay vì sửa trực tiếp mảng cũ
    const updatedList = notificationList.map(notification =>
      notification.id === clickedNotification.id
     ? { ...notification, status: 'read' } // Nếu đúng ID, đổi status
      : notification // Nếu không thì giữ nguyên
   );
     setNotificationList(updatedList); // Cập nhật lại state của danh sách

    // Hiển thị chi tiết thông báo
    setSelectedNotification(clickedNotification);
 };

  const handleBackClick = () => {
   setSelectedNotification(null);
  };

  return (
   <div className="notification-overlay" onClick={onClose}>
    <div className="notification-popup" onClick={handlePopupClick}>
      {selectedNotification ? (
       <div className="notification-detail">
          <h3 className="detail-title">{selectedNotification.title}</h3>
           <p className="detail-content">{selectedNotification.detail}</p>
            <button className="back-button" onClick={handleBackClick}>
              Quay lại
            </button>
          </div>
       ) : (
         <>
          <h2 className="notification-title">THÔNG BÁO</h2>
            <div className="notification-list">
              {/* 3. Render danh sách từ state thay vì từ biến const ban đầu */}
               ` {notificationList.map((notification) => (
             <div
                 key={notification.id}
                 className={`notification-item ${notification.status}`}
                 onClick={() => handleNotificationClick(notification)}
               >
                     {notification.title}
                 </div>
             ))}
         </div>
         </>
        )}
         </div>
     </div>
 );
};

export default ThongBaoPopup;