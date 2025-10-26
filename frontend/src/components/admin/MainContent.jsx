import React, { useState, useEffect } from 'react';
import './MainContent.css';

// Component Icon cho thanh tìm kiếm
const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.2917 13.2917L10 10M11.6667 6.25C11.6667 8.73528 9.73528 10.8333 7.25 10.8333C4.76472 10.8333 2.83333 8.73528 2.83333 6.25C2.83333 3.76472 4.76472 1.66667 7.25 1.66667C9.73528 1.66667 11.6667 3.76472 11.6667 6.25Z" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

function MainContent() {
    // Dữ liệu cho các card
    const dashboardData = [
        { label: 'Tổng số xe', value: 20 },
        { label: 'Số tuyến đường', value: 15 },
        { label: 'Số học sinh', value: 350 },
        { label: 'Số tài xế', value: 18 },
        { label: 'Phụ Huynh', value: 320 }
    ];

    // Dữ liệu mẫu đầy đủ
    const allUsersData = [
        { name: 'Jane Cooper', role: 'Tài xế', phone: '(225) 555-0118', status: 'Active' },
        { name: 'Floyd Miles', role: 'Phụ huynh', phone: '(205) 555-0100', status: 'Inactive' },
        { name: 'Ronald Richards', role: 'Admin', phone: '(302) 555-0107', status: 'Inactive' },
        { name: 'Cameron Williamson', role: 'Tài xế', phone: '(316) 555-0116', status: 'Inactive' },
        { name: 'Brooklyn Simmons', role: 'Phụ huynh', phone: '(217) 555-0122', status: 'Active' },
        { name: 'Robert Fox', role: 'Tài xế', phone: '(480) 555-0103', status: 'Active' },
        { name: 'Esther Howard', role: 'Admin', phone: '(207) 555-0119', status: 'Active' },
        { name: 'Annette Black', role: 'Phụ huynh', phone: '(603) 555-0123', status: 'Inactive' },
        { name: 'Darlene Robertson', role: 'Tài xế', phone: '(219) 555-0114', status: 'Active' },
        { name: 'Wade Warren', role: 'Phụ huynh', phone: '(308) 555-0121', status: 'Active' },
        { name: 'Guy Hawkins', role: 'Admin', phone: '(239) 555-0108', status: 'Inactive' },
        { name: 'Kristin Watson', role: 'Tài xế', phone: '(269) 555-0115', status: 'Active' },
        { name: 'Cody Fisher', role: 'Phụ huynh', phone: '(406) 555-0120', status: 'Inactive' },
        { name: 'Theresa Webb', role: 'Tài xế', phone: '(775) 555-0102', status: 'Active' },
        { name: 'Eleanor Pena', role: 'Phụ huynh', phone: '(303) 555-0117', status: 'Active' },
        { name: 'Leslie Alexander', role: 'Admin', phone: '(302) 555-0109', status: 'Inactive' },
        { name: 'Jacob Jones', role: 'Tài xế', phone: '(267) 555-0113', status: 'Active' },
        { name: 'Kristen Ramos', role: 'Phụ huynh', phone: '(410) 555-0124', status: 'Inactive' },
        { name: 'Lindsay Walton', role: 'Tài xế', phone: '(302) 555-0110', status: 'Active' },
        { name: 'Courtney Henry', role: 'Phụ huynh', phone: '(434) 555-0125', status: 'Active' }
        
    ];

    // --- State cho bộ lọc và dữ liệu đã lọc ---
    const [filteredUsers, setFilteredUsers] = useState(allUsersData);
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // useEffect để áp dụng bộ lọc và tìm kiếm
    useEffect(() => {
        let result = allUsersData;

        // Lọc theo vai trò
        if (roleFilter !== 'All') {
            result = result.filter(user => user.role === roleFilter);
        }

        // Lọc theo trạng thái
        if (statusFilter !== 'All') {
            result = result.filter(user => user.status === statusFilter);
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
    }, [roleFilter, statusFilter, searchQuery]); 
    
    // Logic tính toán cho phân trang
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const activeMembersCount = allUsersData.filter(user => user.status === 'Active').length;

    return (
        <div className="main-content-container">
            <div className="content-header">
                <h2>Trang tổng quan</h2>
            </div>
            
            <div className="dashboard-grid">
                {dashboardData.map((card, index) => (
                    <div key={index} className="dashboard-card">
                        <span className="card-title">{card.label}</span>
                        <span className="card-value">{card.value}</span>
                    </div>
                ))}
            </div>

            <div className="user-list-container">
                <header className="user-list-header">
                    <div className="list-title">
                        <h3>Tất cả người dùng</h3>
                        <p>{activeMembersCount} Người dùng đang hoạt động</p>
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
    
                          {/* Bọc select thứ hai */}
                        <div className="custom-select-wrapper">
                          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="All">Tất cả trạng thái</option>
                            <option value="Active">Hoạt động</option>
                            <option value="Inactive">Không hoạt động</option>
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
                        <span>Status</span>
                    </div>
                    
                    {currentUsers.map((user, index) => (
                        <div key={index} className="user-row">
                            <span>{user.name}</span>
                            <span>{user.role}</span>
                            <span>{user.phone}</span>
                            <div>
                                <span className={`status-badge ${user.status.toLowerCase()}`}>
                                    {user.status}
                                </span>
                            </div>
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