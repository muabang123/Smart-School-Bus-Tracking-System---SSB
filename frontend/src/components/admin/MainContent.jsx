import React, { useState, useEffect } from 'react';
import './MainContent.css';

// Component Icon cho thanh tìm kiếm
const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.2917 13.2917L10 10M11.6667 6.25C11.6667 8.73528 9.73528 10.8333 7.25 10.8333C4.76472 10.8333 2.83333 8.73528 2.83333 6.25C2.83333 3.76472 4.76472 1.66667 7.25 1.66667C9.73528 1.66667 11.6667 3.76472 11.6667 6.25Z" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

function MainContent() {
    const [summary, setSummary] = useState({ vehicles: 0, drivers: 0, students: 0, schedulesToday: 0 });
    const [todaySchedules, setTodaySchedules] = useState([]);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/sql/dashboard/summary')
                const s = await res.json()
                setSummary({ vehicles: s.vehicles || 0, drivers: s.drivers || 0, students: s.students || 0, schedulesToday: s.schedulesToday || 0 })
            } catch {}
        }
        const fetchToday = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/sql/dashboard/today-schedules')
                const rows = await res.json()
                setTodaySchedules(Array.isArray(rows) ? rows : [])
            } catch {
                setTodaySchedules([])
            }
        }
        fetchSummary()
        fetchToday()
    }, [])

    return (
        <div className="main-content-container">
            <div className="content-header">
                <h2>Trang tổng quan</h2>
            </div>
            
            <div className="dashboard-grid">
                <div className="dashboard-card"><span className="card-title">Tổng số xe bus</span><span className="card-value">{summary.vehicles}</span></div>
                <div className="dashboard-card"><span className="card-title">Tổng số tài xế</span><span className="card-value">{summary.drivers}</span></div>
                <div className="dashboard-card"><span className="card-title">Tổng số học sinh</span><span className="card-value">{summary.students}</span></div>
                <div className="dashboard-card"><span className="card-title">Lịch trình hôm nay</span><span className="card-value">{summary.schedulesToday}</span></div>
            </div>

            <div className="user-list-container">
                <header className="user-list-header">
                    <div className="list-title">
                        <h3>Lịch trình hôm nay</h3>
                    </div>
                </header>
                <div className="user-table">
                    <div className="user-table-header" style={{gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr'}}>
                        <span>Tên xe</span>
                        <span>Tài xế</span>
                        <span>Giờ bắt đầu</span>
                        <span>Học sinh trên tuyến</span>
                        <span>Giờ đến trường (dự kiến)</span>
                    </div>
                    {todaySchedules.map((item, index) => (
                        <div key={index} className="user-row" style={{gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr'}}>
                            <span>{item.licensePlate}</span>
                            <span>{item.driverName}</span>
                            <span>{item.startTime}</span>
                            <span>{item.studentCount}</span>
                            <span>{item.eta}</span>
                        </div>
                    ))}
                    {todaySchedules.length === 0 && (
                        <div className="empty-row-message">Không có lịch trình nào hôm nay.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MainContent;