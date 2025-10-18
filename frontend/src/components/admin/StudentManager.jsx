import React, { useState } from 'react';
import './StudentManager.css'; 
import searchIcon from '../../assets/search-icon.png';

// --- Reusable Confirmation Modal Component
function ConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <p className="confirmation-message">{message}</p>
        <div className="confirmation-actions">
          <button onClick={onConfirm} className="modal-btn confirm-btn-yes">Xác nhận</button>
          <button onClick={onCancel} className="modal-btn confirm-btn-no">Hủy</button>
        </div>
      </div>
    </div>
  );
}

const routeData = {
  "Tuyến 1": {
    licensePlate: "51G-123.45",
    pickupPoints: ["Chung cư A", "Ngã tư B", "Trường tiểu học C"]
  },
  "Tuyến 2": {
    licensePlate: "51G-567.89",
    pickupPoints: ["Siêu thị X", "Công viên Y", "Bệnh viện Z"]
  },
  "Tuyến 3": {
    licensePlate: "51G-999.99",
    pickupPoints: ["Nhà văn hóa K", "Bưu điện L"]
  }
};

const classData = ["Lớp 6A", "Lớp 6B", "Lớp 7A", "Lớp 8C", "Lớp 9B"];

// --- Add Student Modal Component ---
function AddStudentModal({ closeModal, onAddStudent }) {
    const [formData, setFormData] = useState({
        studentId: '',
        studentName: '',
        studentClass: '',
        parentName: '',
        parentPhone: '',
        route: '',
        pickupPoint: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'route') {
            setFormData(prev => ({ ...prev, route: value, pickupPoint: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleComplete = () => {
        if (!formData.studentId || !formData.studentName || !formData.studentClass || !formData.route || !formData.pickupPoint) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc (MHS, Tên, Lớp, Tuyến, Điểm đón).");
            return;
        }

        const newStudentData = {
            id: formData.studentId, // ĐÃ SỬA
            name: formData.studentName,
            class: formData.studentClass,
            parent: {
                name: formData.parentName,
                phone: formData.parentPhone,
            },
            route: formData.route,
            pickupPoint: formData.pickupPoint,
            licensePlate: routeData[formData.route].licensePlate,
            status: 'Chưa đón'
        };
        
        onAddStudent(newStudentData);
        closeModal();
    };

    const availablePickupPoints = formData.route ? routeData[formData.route].pickupPoints : [];

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content add-student-modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">THÊM HỌC SINH</h2>
                
                <div className="modal-section">
                    <div className="form-section">
                        <h3 className="form-section-title">Thông tin học sinh</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Họ và tên:</label>
                                <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Lớp:</label>
                                <select name="studentClass" value={formData.studentClass} onChange={handleChange}>
                                    <option value="">-- Chọn lớp --</option>
                                    {classData.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Mã số học sinh:</label>
                                {/* ĐÃ SỬA name="studentId" */}
                                <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Thông tin phụ huynh</h3>
                         <div className="form-grid">
                            <div className="form-group">
                                <label>Họ và tên:</label>
                                <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Số điện thoại:</label>
                                <input type="text" name="parentPhone" value={formData.parentPhone} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Thông tin di chuyển</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Tuyến đường:</label>
                                <select name="route" value={formData.route} onChange={handleChange}>
                                    <option value="">-- Chọn tuyến --</option>
                                    {Object.keys(routeData).map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Địa điểm đón/trả:</label>
                                <select name="pickupPoint" value={formData.pickupPoint} onChange={handleChange} disabled={!formData.route}>
                                    <option value="">-- Chọn địa điểm --</option>
                                    {availablePickupPoints.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="edit-modal-footer">
                    <button className="modal-btn save-changes-btn" onClick={handleComplete}>Hoàn tất</button>
                    <button className="modal-btn cancel-btn" onClick={closeModal}>Hủy</button>
                </div>
            </div>
        </div>
    );
}

// --- Edit Student Modal Component ---
function EditStudentModal({ closeModal, onSave, studentData }) {
    const [formData, setFormData] = useState({
        studentId: studentData.id,
        studentName: studentData.name,
        studentClass: studentData.class,
        parentName: studentData.parent?.name || '',
        parentPhone: studentData.parent?.phone || '',
        route: studentData.route,
        pickupPoint: studentData.pickupPoint,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'route') {
            setFormData(prev => ({ ...prev, route: value, pickupPoint: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSaveChanges = () => {
         const updatedStudentData = {
            ...studentData,
            id: formData.studentId, // ID không thay đổi, nhưng vẫn lấy từ state
            name: formData.studentName,
            class: formData.studentClass,
            parent: {
                name: formData.parentName,
                phone: formData.parentPhone,
            },
            route: formData.route,
            pickupPoint: formData.pickupPoint,
            licensePlate: routeData[formData.route].licensePlate,
        };
        onSave(updatedStudentData);
        closeModal();
    };

    const availablePickupPoints = formData.route ? routeData[formData.route].pickupPoints : [];

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content edit-student-modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">CHỈNH SỬA HỌC SINH</h2>
                <div className="modal-section">
                    <div className="form-section">
                        <h3 className="form-section-title">Thông tin học sinh</h3>
                         <div className="form-grid">
                            <div className="form-group">
                                <label>Họ và tên:</label>
                                <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} 
                                readOnly
                                className="readonly-input"/>
                            </div>
                            <div className="form-group">
                                <label>Lớp:</label>
                                <select name="studentClass" value={formData.studentClass} onChange={handleChange}>
                                    <option value="">-- Chọn lớp --</option>
                                    {classData.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Mã số học sinh:</label>
                                {/* ĐÃ SỬA: Thêm readOnly và sửa thuộc tính */}
                                <input 
                                    type="text" 
                                    name="studentId" 
                                    value={formData.studentId} 
                                    readOnly 
                                    className="readonly-input"
                                />
                            </div>
                        </div>
                    </div>
                     <div className="form-section">
                        <h3 className="form-section-title">Thông tin phụ huynh</h3>
                         <div className="form-grid">
                            <div className="form-group">
                                <label>Họ và tên:</label>
                                <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} readOnly 
                                className="readonly-input" />
                            </div>
                            <div className="form-group">
                                <label>Số điện thoại:</label>
                                <input type="text" name="parentPhone" value={formData.parentPhone} onChange={handleChange} 
                                readOnly 
                                className="readonly-input"/>
                            </div>
                        </div>
                    </div>
                     <div className="form-section">
                        <h3 className="form-section-title">Thông tin di chuyển</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Tuyến đường:</label>
                                <select name="route" value={formData.route} onChange={handleChange}>
                                    <option value="">-- Chọn tuyến --</option>
                                    {Object.keys(routeData).map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Địa điểm đón/trả:</label>
                                <select name="pickupPoint" value={formData.pickupPoint} onChange={handleChange} disabled={!formData.route}>
                                    <option value="">-- Chọn địa điểm --</option>
                                    {availablePickupPoints.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="edit-modal-footer">
                    <button className="modal-btn save-changes-btn" onClick={handleSaveChanges}>Lưu thay đổi</button>
                    <button className="modal-btn cancel-btn" onClick={closeModal}>Hủy</button>
                </div>
            </div>
        </div>
    );
}


// --- Main Student Manager Component ---
function StudentManager() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    const [studentsData, setStudentsData] = useState([
    { 
        id: 'HS001', name: 'Nguyễn Văn An', class: 'Lớp 6A', 
        parent: { name: 'Nguyễn Văn B', phone: '0901234567' },
        route: 'Tuyến 1', pickupPoint: 'Chung cư A', licensePlate: '51G-123.45', status: 'Đã đón' 
    },
    { 
        id: 'HS002', name: 'Trần Thị Bình', class: 'Lớp 7A', 
        parent: { name: 'Trần Văn C', phone: '0987654321' },
        route: 'Tuyến 2', pickupPoint: 'Siêu thị X', licensePlate: '51G-567.89', status: 'Chưa đón' 
    }
]);
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('name');
    

    const handleAddStudent = (newStudent) => {
        // Optional: Check for duplicate IDs before adding
        const isDuplicate = studentsData.some(student => student.id === newStudent.id);
        if (isDuplicate) {
            alert(`Mã số học sinh "${newStudent.id}" đã tồn tại!`);
            return;
        }
        setStudentsData(prevData => [...prevData, newStudent]);
    };

    const handleEditStudent = (updatedStudent) => {
        setStudentsData(prevData =>
            prevData.map(s => s.id === updatedStudent.id ? updatedStudent : s)
        );
    };

    const handleDeleteStudent = () => {
        if (!selectedStudentId) return;
        setStudentsData(prevData => prevData.filter(s => s.id !== selectedStudentId));
        setSelectedStudentId(null);
    };

    const selectedStudent = studentsData.find(s => s.id === selectedStudentId);
    
    const getStatusClass = (status) => {
        switch (status) {
            case 'Đã đón': return 'status-picked-up';
            case 'Chưa đón': return 'status-waiting';
            case 'Vắng': return 'status-absent';
            default: return '';
        }
    };

    const filteredStudents = studentsData.filter(student => {
        if (searchTerm === '') {
            return true;
        }

        const term = searchTerm.toLowerCase();
        const valueToSearch = searchBy === 'name' 
            ? student.name.toLowerCase() 
            : student.id.toLowerCase();

        return valueToSearch.includes(term);
    });

    return (
        <div className="main-content student-manager-bg">
            {isAddModalOpen && <AddStudentModal closeModal={() => setIsAddModalOpen(false)} onAddStudent={handleAddStudent} />}
            {isEditModalOpen && selectedStudent && (
                <EditStudentModal
                    closeModal={() => setIsEditModalOpen(false)}
                    onSave={handleEditStudent}
                    studentData={selectedStudent}
                />
            )}
            {showDeleteConfirm && (
                <ConfirmationModal
                    message={`Bạn có chắc muốn xóa học sinh "${selectedStudent?.name || selectedStudentId}"?`}
                    onConfirm={() => { handleDeleteStudent(); setShowDeleteConfirm(false); }}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}

            <div className="account-header">
                <h2>Quản lý học sinh</h2>
                <span className="admin-status">ADMIN ONLINE : 1</span>
            </div>

            <div className="student-info-section">
                <div className="student-info-card">
                    <div className="student-info-card-header">Tổng số học sinh</div>
                    <div className="student-info-card-content">{studentsData.length}</div>
                </div>
            </div>

            <div className="list-header">
                <h3>Danh sách học sinh</h3>
                <div className="search-controls">
                    <div className="search-container">
                        <img src={searchIcon} alt="Search" className="search-icon"/>
                        <input type="text" placeholder="Search" className="search-input" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="search-select"
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                    >
                        <option value="name">Search by: Name</option>
                        <option value="id">Search by: MHS</option>
                    </select>
                </div>
            </div>
            
            <div className="table-container student-table">
                <table>
                    <thead>
                        <tr>
                            <th>MHS</th>
                            <th>Tên học sinh</th>
                            <th>Lớp</th>
                            <th>Tuyến</th>
                            <th>Biển số xe</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map(student => (
                            <tr
                                key={student.id}
                                onClick={() => setSelectedStudentId(student.id)}
                                className={selectedStudentId === student.id ? 'selected' : ''}
                            >
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.class}</td>
                                <td>{student.route}</td>
                                <td>{student.licensePlate}</td>
                                <td>
                                    <span className={`status-pill ${getStatusClass(student.status)}`}>
                                        {student.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="action-buttons-footer">
                <div className="left-actions">
                    <button className="action-btn add-btn" onClick={() => setIsAddModalOpen(true)}>Thêm</button>
                    <button
                        className="action-btn edit-btn"
                        onClick={() => { if (selectedStudentId) setIsEditModalOpen(true); }}
                        disabled={!selectedStudentId}
                    >
                        Sửa
                    </button>
                </div>
                <button
                    className="action-btn delete-btn"
                    onClick={() => { if (selectedStudentId) setShowDeleteConfirm(true); }}
                    disabled={!selectedStudentId}
                >
                    Xóa
                </button>
            </div>
        </div>
    );
}

export default StudentManager;