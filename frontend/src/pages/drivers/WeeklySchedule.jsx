import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import '../admin/Dashboard.css';
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

    const weekdayVN = React.useMemo(() => ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'], [])

    useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/sql/schedules/upcoming?driverId=${driverId}&days=14`)
                const rows = await res.json()
                // Group by date for weekly view
                const byDate = {}
                for (const r of Array.isArray(rows) ? rows : []) {
                    const dateStr = r.date
                    if (!byDate[dateStr]) byDate[dateStr] = []
                    byDate[dateStr].push(r)
                }
                const dates = Object.keys(byDate).sort((a,b) => new Date(a) - new Date(b))
                const generated = dates.map(dateStr => {
                    const d = new Date(dateStr)
                    const dayName = weekdayVN[d.getDay()]
                    const routes = byDate[dateStr].map(r => ({
                        time: r.startTime,
                        routeName: r.routeName,
                        routeId: r.routeId,
                        licensePlate: r.licensePlate,
                        pickupPoints: r.pickupPoints,
                        createdBy: r.createdBy
                    }))
                    return { dayName, date: dateStr, status: routes.length ? 'work' : 'empty', details: `${routes.length} tuyến`, routes }
                })
                setScheduleData(generated)
            } catch {
                setScheduleData([])
            }
        }
        fetchUpcoming()
    }, [driverId, weekdayVN])

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
        <>
            <div className="app">
                <Header />
                <div className="app-body">
                    <Sidebar />
                    <div className="main-content-container">
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
                    </div>
                </div>
            </div>

            {/* Render Modal nếu isModalOpen là true */}
            {isModalOpen && <DailyScheduleModal dayData={selectedDay} onClose={handleCloseModal} />}
        </>
    );
}

export default WeeklySchedule;