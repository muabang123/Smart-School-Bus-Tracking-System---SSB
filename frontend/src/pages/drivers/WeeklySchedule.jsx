import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/drivers/Header';
import './WeeklySchedule.css';

// Component này sẽ hiển thị chi tiết lịch làm của một ngày
function DailyScheduleModal({ dayData, onClose }) {
    if (!dayData) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="daily-schedule-modal" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    Lịch làm {dayData.dayName} ({dayData.date})
                </header>
                <div className="modal-body">
                    {dayData.routes.map((route, index) => (
                        <div className="modal-route-item" key={index}>
                            <span className="modal-route-time">{route.time}</span>
                            <span className="modal-route-name">Tên tuyến:</span>
                            {/* Nút "Xem" này sẽ điều hướng đến trang chi tiết tuyến xe */}
                            <Link to={`/driver/route/${route.routeId}`} className="modal-view-button">
                                Xem
                            </Link>
                        </div>
                    ))}
                </div>
                <footer className="modal-footer">
                    <button className="modal-exit-button" onClick={onClose}>
                        Thoát
                    </button>
                </footer>
            </div>
        </div>
    );
}


// --- COMPONENT CHÍNH ---
function WeeklySchedule() {
    // State để quản lý modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);

    // Dữ liệu mẫu đã được cập nhật để chứa thông tin cho modal

    const scheduleData = [
        {
            dayName: "Thứ Hai",
            date: "17/10/2025",
            status: "work",
            details: "4 tuyến",
            routes: [ // Dữ liệu chi tiết cho modal
                { time: '6:00 AM', routeName: 'Tuyến số 5', routeId: 'tuyen-005' },
                { time: '11:30 AM', routeName: 'Tuyến số 2', routeId: 'tuyen-002' },
                { time: '13:00 PM', routeName: 'Tuyến số 2 (về)', routeId: 'tuyen-002-ve' },
                { time: '17:30 AM', routeName: 'Tuyến số 5 (về)', routeId: 'tuyen-005-ve' }
            ]
        },
        { dayName: "Thứ Ba", date: "18/10/2025", status: "off", details: "Nghỉ", routes: [] },
        { dayName: "Thứ Tư", date: "19/10/2025", status: "empty", details: "", routes: [] },
        { dayName: "Thứ Năm", date: "20/10/2025", status: "empty", details: "", routes: [] },
        { dayName: "Thứ Sáu", date: "21/10/2025", status: "empty", details: "", routes: [] },
        { dayName: "Thứ Bảy", date: "22/10/2025", status: "empty", details: "", routes: [] },
        { dayName: "Chủ Nhật", date: "23/10/2025", status: "empty", details: "", routes: [] }
    ];

    // Hàm để mở modal
    const handleOpenModal = (day) => {
        setSelectedDay(day);
        setIsModalOpen(true);
    };

    // Hàm để đóng modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDay(null);
    };

    return (
        <> {/* Dùng Fragment để chứa cả trang và modal */}
            <Header />
            <div className="weekly-schedule-container">
                <header className="weekly-schedule-header">
                    Lịch làm việc tuần này (17/10/2025 - 24/10/2025)
                </header>
                <div className="weekly-schedule-body">
                    {scheduleData.map((day, index) => (
                        <div className="schedule-row" key={index}>
                            <div className="day-info">
                                <span className="day-name">{day.dayName}</span>
                                <span className="day-date">({day.date})</span>
                            </div>
                            <div className={`schedule-details ${day.status}`}>
                                {day.details}
                            </div>
                            <div className="schedule-action">
                                {/* Thay Link bằng button và thêm onClick */}
                                {day.status === "work" && (
                                    <button className="details-button" onClick={() => handleOpenModal(day)}>
                                        Xem chi tiết
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Render Modal nếu isModalOpen là true */}
            {isModalOpen && <DailyScheduleModal dayData={selectedDay} onClose={handleCloseModal} />}
        </>
    );
}

export default WeeklySchedule;