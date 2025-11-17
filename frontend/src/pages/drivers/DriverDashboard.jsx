import React, { useEffect, useState } from 'react';
import './DriverDashboard.css';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import '../admin/Dashboard.css';
import { Link } from 'react-router-dom';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
);

const ScheduleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM3.55 13.5c.3-.79.48-1.64.48-2.5 0-3.53 2.61-6.43 6-6.92V1.05C5.02 1.55 1 6.24 1 12c0 1.45.32 2.83.88 4.07l2.6-1.53zM12 20c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z"/>
    </svg>
);


function DriverDashboard() {
    const [todayScheduleData, setTodayScheduleData] = useState([])
    const driverId = localStorage.getItem('driverId') || 'TX001'

    useEffect(() => {
        const fetchToday = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/sql/schedules/today?driverId=${driverId}`)
                const rows = await res.json()
                setTodayScheduleData(Array.isArray(rows) ? rows : [])
            } catch (e) {
                setTodayScheduleData([])
            }
        }
        fetchToday()
    }, [driverId])

    return (
        <div className="app">
            <Header />
            <div className="app-body">
                <Sidebar />
                <div className="main-content-container">
                <section className="account-info">
                    <div className="section-header">
                        <UserIcon />
                        <h2>Thông tin tài khoản</h2>
                    </div>
                    <div className="info-boxes">
                        <div className="info-box">Họ và tên</div>
                        <div className="info-box">Liên hệ:</div>
                        <div className="info-box">Vai trò:</div>
                    </div>
                </section>


                <section className="schedule-section">
                    <div className="section-header">
                        <ScheduleIcon />
                        <h2>Lịch làm việc hôm nay</h2>
                    </div>
                    <div className="schedule-list">
                        {todayScheduleData.map((item, index) => (
                            <div key={index} className="schedule-item">
                                <span className="schedule-time">{item.startTime}</span>
                                <span className="schedule-details">Tuyến: {item.routeName}</span>
                                <span className="schedule-details">Xe: {item.licensePlate}</span>
                                <span className="schedule-details">Học sinh: {item.studentCount}</span>
                                <span className="schedule-details">Điểm dừng: {item.pickupPoints}</span>
                                <Link 
                                    to={`/driver/route/${item.routeId}`} 
                                    className="view-button"
                                >
                                    Xem chi tiết
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>


                <section className="upcoming-schedule">
                    <div className="section-header">
                        <ScheduleIcon />
                        <h2>Lịch làm việc thời gian tới</h2>
                    </div>
                    <Link to="/driver/schedule" className="view-button large">
                        Xem lịch
                    </Link>
                </section>
                </div>
            </div>
        </div>
    );
}

export default DriverDashboard;