import React, { useState, useEffect } from 'react';
import './MainContent.css';

// Component Icon cho thanh tìm kiếm
const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.2917 13.2917L10 10M11.6667 6.25C11.6667 8.73528 9.73528 10.8333 7.25 10.8333C4.76472 10.8333 2.83333 8.73528 2.83333 6.25C2.83333 3.76472 4.76472 1.66667 7.25 1.66667C9.73528 1.66667 11.6667 3.76472 11.6667 6.25Z" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

function MainContent() {
    const [summary, setSummary] = useState({ vehicles: 0, routes: 0, students: 0, drivers: 0, parents: 0 });
    const [allUsersData, setAllUsersData] = useState([]);

    // --- State cho bộ lọc và dữ liệu đã lọc ---
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // useEffect để áp dụng bộ lọc và tìm kiếm
    useEffect(() => {
        let result = allUsersData;

        if (roleFilter !== 'All') {
            result = result.filter(user => user.role === roleFilter);
        }
        if (searchQuery.trim() !== '') {
            const lowercasedQuery = searchQuery.toLowerCase();
            result = result.filter(user =>
                user.name.toLowerCase().includes(lowercasedQuery) ||
                user.phone.toLowerCase().includes(lowercasedQuery)
            );
        }

        setFilteredUsers(result);
        setCurrentPage(1);
    }, [roleFilter, searchQuery]);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/sql/dashboard/summary')
                const s = await res.json()
                setSummary(s)
            } catch {}
        }
        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/sql/dashboard/users')
                const u = await res.json()
                setAllUsersData(Array.isArray(u) ? u : [])
                setFilteredUsers(Array.isArray(u) ? u : [])
            } catch {
                setAllUsersData([])
                setFilteredUsers([])
            }
        }
        fetchSummary()
        fetchUsers()
    }, [])
    
    // Logic tính toán cho phân trang
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const activeMembersCount = undefined;

    return (
        <div className="main-content-container">
            <div className="content-header">
                <h2>Trang tổng quan</h2>
            </div>
            
            <div className="dashboard-grid">
                <div className="dashboard-card"><span className="card-title">Tổng số xe</span><span className="card-value">{summary.vehicles}</span></div>
                <div className="dashboard-card"><span className="card-title">Số tuyến đường</span><span className="card-value">{summary.routes}</span></div>
                <div className="dashboard-card"><span className="card-title">Số học sinh</span><span className="card-value">{summary.students}</span></div>
                <div className="dashboard-card"><span className="card-title">Số tài xế</span><span className="card-value">{summary.drivers}</span></div>
                <div className="dashboard-card"><span className="card-title">Phụ Huynh</span><span className="card-value">{summary.parents}</span></div>
            </div>

            <div className="user-list-container">
                <header className="user-list-header">
                    <div className="list-title">
                        <h3>Tất cả người dùng</h3>
                        
                    </div>
                    <div className="filter-controls">
                        {/* Bọc select đầu tiên */}
                        <div className="custom-select-wrapper">
                          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                              <option value="All">Tất cả vai trò</option>
                              <option value="Admin">Admin</option>
                              <option value="Tài xế">Tài xế</option>
                              <option value="Phụ huynh">Phụ huynh</option>
                          </select>
                        </div>
    
                          
                      </div>
                    <div className="list-controls">
                        <div className="search-bar">
                            <SearchIcon />
                            <input 
                                type="search" 
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                <div className="user-table">
                    <div className="user-table-header">
                        <span>Tên người dùng</span>
                        <span>Vai trò</span>
                        <span>Số điện thoại</span>
                        
                    </div>
                    
                    {currentUsers.map((user, index) => (
                        <div key={index} className="user-row">
                            <span>{user.name}</span>
                            <span>{user.role}</span>
                            <span>{user.phone}</span>
                            
                        </div>
                    ))}
                    {currentUsers.length === 0 && (
                        <div className="empty-row-message">Không tìm thấy người dùng nào.</div>
                    )}
                </div>

                <footer className="list-footer">
                    <span className="user-count-info">Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} / {filteredUsers.length} người dùng</span>
                    
                    <div className="pagination">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            &lt;
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <button 
                                key={number} 
                                onClick={() => handlePageChange(number)}
                                className={currentPage === number ? 'active' : ''}
                            >
                                {number}
                            </button>
                        ))}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            &gt;
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default MainContent;