import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './RouteDetailsPage.css';
import Header from '../../components/drivers/Header';
import { Link } from 'react-router-dom';

// --- Icons ---
const BusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 16c0 .88.39 1.67 1 2.22V21h3v-2h8v2h3v-2.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM18 11H6V6h12v5z"/>
    </svg>
);

const ListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="success-icon" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
    </svg>
);

// --- Component chính ---
function RouteDetailsPage() {
    const { routeId } = useParams(); // Lấy ID từ URL

    // State cho dữ liệu tuyến và học sinh
    const [routeInfo, setRouteInfo] = useState(null);
    const [students, setStudents] = useState([
        { id: 'HS001', name: 'Nguyễn Văn An', pickupPoint: '123 Đường ABC', status: 'picked-up' },
        { id: 'HS002', name: 'Trần Thị Bình', pickupPoint: '456 Đường XYZ', status: 'absent' },
        { id: 'HS003', name: 'Lê Văn Cường', pickupPoint: '789 Đường QWE', status: 'dropped-off' },
        { id: 'HS004', name: 'Phạm Thị Dung', pickupPoint: '321 Đường DEF', status: 'pending' },
        { id: 'HS005', name: 'Võ Văn Em', pickupPoint: '654 Đường GHI', status: 'pending' },
        { id: 'HS006', name: 'Võ Văn Anh', pickupPoint: '654 Đường akdakdh', status: 'pending' },
        { id: 'HS007', name: 'Võ Văn Chị', pickupPoint: '654 Đường GHI', status: 'pending' },
        { id: 'HS008', name: 'Võ Văn Chú', pickupPoint: '654 Đường GHI', status: 'pending' }, 
        { id: 'HS009', name: 'Võ Văn Cháu', pickupPoint: '654 Đường GHI', status: 'pending' }, 
    ]);
    const [isLoading, setIsLoading] = useState(true);

    // --- State cho Modal Trạng thái ---
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null); 
    const [newStatus, setNewStatus] = useState(''); 

    // --- State cho Modal Báo cáo sự cố ---
    const [showReportModal, setShowReportModal] = useState(false);
    const [incidentType, setIncidentType] = useState('Tắc đường'); // Giá trị mặc định
    const [incidentDescription, setIncidentDescription] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Modal xác nhận gửi thành công

    const [showBulkUpdateConfirmModal, setShowBulkUpdateConfirmModal] = useState(false);
    const [bulkUpdateStatus, setBulkUpdateStatus] = useState(''); 

    const [tripStatus, setTripStatus] = useState('not-started'); // 'not-started' hoặc 'in-progress'
    const [showTripConfirmModal, setShowTripConfirmModal] = useState(false);
    const [tripAction, setTripAction] = useState(''); // 'start' hoặc 'end'

    const [showConfirmModal, setShowConfirmModal] = useState(false);


    const statusMap = {
        'picked-up': { text: 'Đã đón', className: 'status-picked-up' },
        'absent': { text: 'Vắng', className: 'status-absent' },
        'dropped-off': { text: 'Đã trả', className: 'status-dropped-off' },
        'pending': { text: 'Chưa đón', className: 'status-pending' }
    };
    

    const statusOptions = ['picked-up', 'absent', 'dropped-off', 'pending'];

    const incidentOptions = ['Tắc đường', 'Xe hỏng','Xe trễ giờ','Thay đổi lộ trình', 'Học sinh có vấn đề sức khỏe', 'Tai nạn', 'Khác'];


    useEffect(() => {
        const fetchRouteData = async () => {

            await new Promise(resolve => setTimeout(resolve, 500)); 
            
            console.log(`Đang lấy dữ liệu cho tuyến: ${routeId}`);

            const fakeApiData = {
                info: {
                    number: '05',
                    name: 'Tuyến số 5 - Quận 1',
                    time: '6:00 AM',
                    path: 'ĐH Bách Khoa => Chợ Bến Thành => Nhà hát Lớn'
                },

            };
            
            setRouteInfo(fakeApiData.info);
            setIsLoading(false);
        };

        fetchRouteData();
    }, [routeId]);


    const handleStatusClick = (student) => {
        setSelectedStudent(student);
        setNewStatus(student.status);
        setShowStatusModal(true);
    };

    const closeStatusModal = () => {
        setShowStatusModal(false);
        setSelectedStudent(null);
        setNewStatus('');
    };

    const confirmChangeStatus = () => {
        setShowStatusModal(false); 
        setShowConfirmModal(true); 
    };

    const applyStatusChange = () => {
        if (selectedStudent && newStatus) {
            console.log(`Cập nhật trạng thái của ${selectedStudent.name} thành ${newStatus}`);

            setStudents(prevStudents => 
                prevStudents.map(s => 
                    s.id === selectedStudent.id ? { ...s, status: newStatus } : s
                )
            );
        }
        setShowConfirmModal(false); 
        setSelectedStudent(null);
        setNewStatus('');
    };

    const cancelConfirm = () => {
        setShowConfirmModal(false);
        setSelectedStudent(null);
        setNewStatus('');
    };
    // --- Các hàm xử lý Modal Báo cáo sự cố ---
    const handleOpenReportModal = () => {
        setShowReportModal(true);
    };
    // --- CÁC HÀM XỬ LÝ CẬP NHẬT TRẠNG THÁI HÀNG LOẠT ---
    const handleUpdateAllStatus = (newStatus) => {

        setBulkUpdateStatus(newStatus);
        setShowBulkUpdateConfirmModal(true); 
    };
    const applyBulkUpdate = () => {
        console.log(`Cập nhật trạng thái của tất cả học sinh thành: ${bulkUpdateStatus}`);
        setStudents(prevStudents => 
            prevStudents.map(student => ({ ...student, status: bulkUpdateStatus }))
        );
        cancelBulkUpdate();
    };
    
    // Hàm này được dùng để đóng modal và reset state
    const cancelBulkUpdate = () => {
        setShowBulkUpdateConfirmModal(false);
        setBulkUpdateStatus('');
    };
    const handleCloseReportModal = () => {
        setShowReportModal(false);
        // Reset form khi đóng
        setIncidentType('Tắc đường');
        setIncidentDescription('');
    };

    const handleSubmitReport = () => {
        // Đây là nơi bạn sẽ gọi API để gửi báo cáo về backend
        console.log('Báo cáo sự cố:', { type: incidentType, description: incidentDescription });
        
        handleCloseReportModal(); 
        setShowSuccessModal(true);
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
    };

    const handleTripButtonClick = () => {
        if (tripStatus === 'not-started') {
            setTripAction('start');
        } else {
            setTripAction('end');
        }
        setShowTripConfirmModal(true);
    };

    const confirmTripAction = () => {
        if (tripAction === 'start') {
            console.log("Gửi thông báo: Tài xế đã BẮT ĐẦU hành trình.");
            setTripStatus('in-progress');
        } else if (tripAction === 'end') {
            console.log("Gửi thông báo: Tài xế đã KẾT THÚC hành trình.");
            setTripStatus('not-started');
        }
        cancelTripAction();
    };

    const cancelTripAction = () => {
        setShowTripConfirmModal(false);
        setTripAction('');
    };


    if (isLoading) {
        return <div className="loading-page"><h1>Đang tải dữ liệu...</h1></div>;
    }

    if (!routeInfo) {
        return <div className="error-page"><h1>Không tìm thấy thông tin tuyến xe.</h1></div>;
    }

    return (
        <div className="route-details-page">
            <Header />
            <section className="route-info-section">
                <h2 className="section-title">
                    <BusIcon /> Thông tin tuyến xe
                </h2>
                <div className="info-grid">
                    <p><strong>Tuyến số:</strong> {routeInfo.number}</p>
                    <p><strong>Tên tuyến:</strong> {routeInfo.name}</p>
                    <p><strong>Giờ chạy:</strong> {routeInfo.time}</p>
                    <p><strong>Lộ trình:</strong> {routeInfo.path}</p>
                </div>
            </section>

            <section className="student-list-section">
                <div className="list-header">
                    <h2 className="section-title">
                        <ListIcon /> Danh sách học sinh
                    </h2>
                     <div className="bulk-actions">
                        <button 
                            className="bulk-action-btn picked-up"
                            onClick={() => handleUpdateAllStatus('picked-up')}
                        >
                            Đã đón tất cả
                        </button>
                        <button 
                            className="bulk-action-btn dropped-off"
                            onClick={() => handleUpdateAllStatus('dropped-off')}
                        >
                            Đã trả tất cả
                        </button>
                    </div>
                    <div className="student-count">
                        <strong>Số lượng:</strong> <span>{students.length}</span>
                    </div>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Mã học sinh</th>
                                <th>Tên học sinh</th>
                                <th>Điểm đón</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td>{student.pickupPoint}</td>
                                    <td>
                                        {/* Thêm onClick vào span trạng thái */}
                                        <span 
                                            className={`status-badge ${statusMap[student.status].className}`}
                                            onClick={() => handleStatusClick(student)} 
                                        >
                                            {statusMap[student.status].text}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <footer className="action-buttons">
                {tripStatus === 'not-started' ? (
                    <button className="start-trip-btn" onClick={handleTripButtonClick}>
                     Bắt đầu hành trình
                </button>
                ) : (
                    <button className="end-trip-btn" onClick={handleTripButtonClick}>
                        Kết thúc hành trình
                    </button>
            )}
    
            <button className="report-incident-btn" onClick={handleOpenReportModal}>
                Báo cáo sự cố
            </button>
    </footer>

            {showStatusModal && selectedStudent && (
                <div className="modal-overlay">
                    <div className="modal-content status-modal">
                        <h3>Cập nhật trạng thái: <br/>{selectedStudent.name} ({selectedStudent.id})</h3>
                        <div className="status-options">
                            {statusOptions.map(option => (
                                <button
                                    key={option}
                                    className={`status-option-btn ${statusMap[option].className} ${newStatus === option ? 'selected' : ''}`}
                                    onClick={() => setNewStatus(option)}
                                >
                                    {statusMap[option].text}
                                </button>
                            ))}
                        </div>
                        <div className="modal-actions">
                            <button className="modal-cancel-btn" onClick={closeStatusModal}>Hủy</button>
                            <button 
                                className="modal-confirm-btn" 
                                onClick={confirmChangeStatus}
                                disabled={newStatus === selectedStudent.status} 
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="modal-content confirm-modal">
                        <h3>Xác nhận thay đổi trạng thái?</h3>
                        <p>Bạn có chắc muốn cập nhật trạng thái của **{selectedStudent?.name}** thành **{statusMap[newStatus]?.text}** không?</p>
                        <div className="modal-actions">
                            <button className="modal-cancel-btn" onClick={cancelConfirm}>Hủy</button>
                            <button className="modal-confirm-btn primary" onClick={applyStatusChange}>Đồng ý</button>
                        </div>
                    </div>
                </div>
            )}
            {/* --- Modal Báo cáo sự cố --- */}
            {showReportModal && (
                <div className="modal-overlay">
                    <div className="modal-content report-modal-content">
                        <div className="report-modal-header">
                            <h3>Gửi báo cáo sự cố</h3>
                        </div>
                        <div className="report-modal-body">
                            <div className="report-form-group">
                                <label htmlFor="incident-type">Chọn loại sự cố:</label>
                                <select 
                                    id="incident-type" 
                                    className="report-modal-select"
                                    value={incidentType}
                                    onChange={(e) => setIncidentType(e.target.value)}
                                >
                                    {incidentOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="report-form-group">
                                <label htmlFor="incident-description">Mô tả:</label>
                                <textarea 
                                    id="incident-description" 
                                    className="report-modal-textarea"
                                    rows="5"
                                    value={incidentDescription}
                                    onChange={(e) => setIncidentDescription(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <div className="report-modal-actions">
                            <button className="report-cancel-btn" onClick={handleCloseReportModal}>Hủy</button>
                            <button className="report-submit-btn" onClick={handleSubmitReport}>Gửi</button>
                        </div>
                    </div>
                </div>
            )}
            {/* --- Modal Gửi thành công --- */}
            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-content success-modal-content">
                        <CheckCircleIcon />
                        <h3>Gửi thành công!</h3>
                        <p>Báo cáo của bạn đã được gửi đến quản lý viên.</p>
                        <button className="modal-close-btn" onClick={handleCloseSuccessModal}>Đóng</button>
                    </div>
                </div>
            )}
            {showBulkUpdateConfirmModal && (
                <div className="modal-overlay">
                    <div className="modal-content confirm-modal">
                        <h3>Xác nhận hành động?</h3>
                        <p>
                            Bạn có chắc muốn cập nhật trạng thái của <strong>tất cả học sinh</strong> thành
                            <strong> "{statusMap[bulkUpdateStatus]?.text}"</strong> không?
                        </p>
                        <div className="modal-actions">
                            <button className="modal-cancel-btn" onClick={cancelBulkUpdate}>Hủy</button>
                            <button className="modal-confirm-btn primary" onClick={applyBulkUpdate}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            )}
            {showTripConfirmModal && (
                <div className="modal-overlay">
                    <div className="modal-content confirm-modal">
                        <h3>
                            {tripAction === 'start' 
                                ? 'Xác nhận Bắt đầu Hành trình?' 
                                : 'Xác nhận Kết thúc Hành trình?'}
                        </h3>
                        <p>
                            {tripAction === 'start' 
                                ? 'Hệ thống sẽ gửi thông báo đến quản lý viên.' 
                                : 'Bạn có chắc chắn muốn kết thúc hành trình này?'}
                        </p>
                        <div className="modal-actions">
                            <button className="modal-cancel-btn" onClick={cancelTripAction}>Hủy</button>
                            <button className="modal-confirm-btn primary" onClick={confirmTripAction}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RouteDetailsPage;