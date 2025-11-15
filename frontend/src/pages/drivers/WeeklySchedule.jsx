import React, { useEffect, useState } from 'react';
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [scheduleData, setScheduleData] = useState([]);
    const driverId = localStorage.getItem('driverId') || 'TX001'

    const weekdayVN = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy']

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/sql/schedules/routes/by-driver?driverId=${driverId}`)
                const rows = await res.json()
                const today = new Date()
                const generated = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date(today)
                    d.setDate(today.getDate() + i)
                    const dateStr = d.toLocaleDateString('vi-VN')
                    const dayName = weekdayVN[d.getDay()]
                    const routes = (Array.isArray(rows) ? rows : []).map(r => ({
                        time: r.name?.includes('Sáng') ? '07:00' : r.name?.includes('Chiều') ? '13:00' : '08:00',
                        routeName: r.name,
                        routeId: r.id
                    }))
                    return { dayName, date: dateStr, status: routes.length ? 'work' : 'empty', details: routes.length ? `${routes.length} tuyến` : '', routes }
                })
                setScheduleData(generated)
            } catch (e) {
                setScheduleData([])
            }
        }
        fetchRoutes()
    }, [driverId])

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
