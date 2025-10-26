import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './AccountManager.css';

// --- Component Modal Xác Nhận Xóa ---
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

// --- Component Modal Chỉnh Sửa ---
function EditAccountModal({ closeModal, onSave, parentData }) {
  const [parentName, setParentName] = useState(parentData.name);
  const [parentPhone, setParentPhone] = useState(parentData.phone);
  const [students, setStudents] = useState(parentData.children);
  
  const handleSaveChanges = () => {
    const updatedParentData = {
      ...parentData,
      name: parentName,
      phone: parentPhone,
      children: students
    };
    onSave(updatedParentData);
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">CHỈNH SỬA TÀI KHOẢN</h2>
        <div className="modal-section">
          <div className="form-row">
            <label>Mã phụ huynh:</label>
            <input type="text" value={parentData.id} disabled />
          </div>
          <div className="form-row">
            <label htmlFor="edit-parent-name">Tên:</label>
            <input type="text" id="edit-parent-name" value={parentName} onChange={e => setParentName(e.target.value)} />
          </div>
          <div className="form-row">
            <label htmlFor="edit-phone-number">Số điện thoại:</label>
            <input type="text" id="edit-phone-number" value={parentPhone} onChange={e => setParentPhone(e.target.value)} />
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


// --- Component Modal Thêm Mới ---
function AddAccountModal({ closeModal, onAddParent }) {
  const [parentId, setParentId] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [studentIdInput, setStudentIdInput] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSelectStudent = (studentId) => {
    setSelectedStudentIds(prev => prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]);
  };
  const handleDeleteStudents = () => {
    setStudents(prev => prev.filter(student => !selectedStudentIds.includes(student.id)));
    setSelectedStudentIds([]);
  };
  const handleAddStudent = () => {
    if (studentIdInput.trim() === '') return;
    const newStudent = { id: studentIdInput.trim(), name: `hs_${studentIdInput.trim()}` };
    setStudents([...students, newStudent]);
    setStudentIdInput('');
  };
  const handleComplete = () => {
    const newParentData = {
      id: parentId.trim() || `PH${Math.floor(Math.random() * 1000)}`,
      name: parentName,
      phone: parentPhone,
      children: students
    };
    onAddParent(newParentData);
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {showDeleteConfirm && (
          <ConfirmationModal
            message={`Bạn có chắc muốn xóa ${selectedStudentIds.length} học sinh đã chọn?`}
            onConfirm={() => { handleDeleteStudents(); setShowDeleteConfirm(false); }}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
        <h2 className="modal-title">ACCOUNT</h2>
        <div className="modal-section parent-section">
          <div className="form-row"><label htmlFor="parent-id">Mã phụ huynh:</label><input type="text" id="parent-id" value={parentId} onChange={e => setParentId(e.target.value)} /></div>
          <div className="form-row"><label htmlFor="parent-name">Tên:</label><input type="text" id="parent-name" value={parentName} onChange={e => setParentName(e.target.value)} /></div>
          <div className="form-row"><label htmlFor="phone-number">Số điện thoại:</label><input type="text" id="phone-number" value={parentPhone} onChange={e => setParentPhone(e.target.value)} /></div>
        </div>
        <div className="modal-section student-section">
          <div className="form-row"><label htmlFor="student-id">Mã học sinh:</label><input type="text" id="student-id" className="red-border" value={studentIdInput} onChange={e => setStudentIdInput(e.target.value)} /><button className="modal-btn add-btn" onClick={handleAddStudent}>Thêm</button></div>
          <div className="student-table-container">
            <table>
              <thead><tr><th>Mã học sinh</th><th>Tên học sinh</th></tr></thead>
              <tbody>
                {students.map(student => (<tr key={student.id} onClick={() => handleSelectStudent(student.id)} className={selectedStudentIds.includes(student.id) ? 'selected' : ''}><td>{student.id}</td><td>{student.name}</td></tr>))}
              </tbody>
            </table>
          </div>
          <div className="student-actions">
            <button className="modal-btn delete-student-btn" onClick={() => { if (selectedStudentIds.length > 0) setShowDeleteConfirm(true); }}>Xóa</button>
            <button className="modal-btn cancel-btn" onClick={closeModal}>Hủy</button> 
            <button className="modal-btn complete-btn" onClick={handleComplete}>Hoàn tất</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Component Chính ---
function AccountManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [parentsData, setParentsData] = useState([
  { 
    id: 'PH001', 
    name: 'Nguyễn Văn A', 
    phone: '0901234567', 
    children: [
      { id: 'HS01', name: 'Nguyễn Thị B' },
      { id: 'HS02', name: 'Nguyễn Văn C' }
    ] 
  },
  { 
    id: 'PH002', 
    name: 'Trần Thị D', 
    phone: '0987654321', 
    children: [
      { id: 'HS03', name: 'Trần Văn E' }
    ] 
  }
]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [showParentDeleteConfirm, setShowParentDeleteConfirm] = useState(false);

  const handleAddParent = (newParentData) => {
    setParentsData(prevData => [...prevData, newParentData]);
    setSelectedParentId(newParentData.id);
  };
  
  const handleEditParent = (updatedParentData) => {
    setParentsData(prevData => 
      prevData.map(parent => parent.id === updatedParentData.id ? updatedParentData : parent)
    );
  };
  
  const handleDeleteParent = () => {
    if (!selectedParentId) return;
    setParentsData(prevData => prevData.filter(parent => parent.id !== selectedParentId));
    setSelectedParentId(null);
  };

  const selectedParent = parentsData.find(p => p.id === selectedParentId);

  return (
    <div className="main-content">
      {isModalOpen && <AddAccountModal closeModal={() => setIsModalOpen(false)} onAddParent={handleAddParent} />}
      {isEditModalOpen && selectedParent && (
        <EditAccountModal
          closeModal={() => setIsEditModalOpen(false)}
          onSave={handleEditParent}
          parentData={selectedParent}
        />
      )}
      {showParentDeleteConfirm && (
        <ConfirmationModal
          message={`Bạn có chắc muốn xóa phụ huynh "${selectedParent?.name || selectedParentId}"?`}
          onConfirm={() => { handleDeleteParent(); setShowParentDeleteConfirm(false); }}
          onCancel={() => setShowParentDeleteConfirm(false)}
        />
      )}

      <div className="account-header"><h2>Quản lý tài khoản</h2><span className="admin-status">ADMIN ONLINE : 1</span></div>
      
      <div className="info-section">
        <div className="info-cards-group">
            <div className="info-card"><div className="info-card-header">Tài xế</div><div className="info-card-content"></div></div>
            <div className="info-card"><div className="info-card-header">Phụ huynh</div><div className="info-card-content"></div></div>
        </div>
        <div className="info-actions">
            <NavLink to="/dashboard/accounts/parents" className={({ isActive }) => isActive ? 'info-btn active' : 'info-btn'}>
              Phụ Huynh
            </NavLink>
            <NavLink to="/dashboard/accounts/drivers" className={({ isActive }) => isActive ? 'info-btn active' : 'info-btn'}>
              Tài Xế
            </NavLink>
        </div>
      </div>

      <h3 className="sub-header">Tài khoản / Phụ huynh</h3>
      <div className="tables-section">
        <div className="table-container parent-table">
          <table>
            <thead><tr><th>Mã phụ huynh</th><th>Tên phụ huynh</th><th>Số điện thoại</th></tr></thead>
            <tbody>
              {parentsData.map(parent => (<tr key={parent.id} onClick={() => setSelectedParentId(parent.id)} className={selectedParentId === parent.id ? 'selected' : ''}><td>{parent.id}</td><td>{parent.name}</td><td>{parent.phone}</td></tr>))}
            </tbody>
          </table>
        </div>
        <div className="table-container children-table">
          <table>
            <thead><tr><th>Con cái</th></tr></thead>
            <tbody>
              {selectedParent && selectedParent.children.map(child => (<tr key={child.id}><td>{child.name}</td></tr>))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="action-buttons-footer">
        <div className="left-actions">
          <button className="action-btn" onClick={() => setIsModalOpen(true)}>Thêm</button>
          
          <button 
            className="action-btn" 
            onClick={() => { if (selectedParentId) setIsEditModalOpen(true); }}
            disabled={!selectedParentId}
          >
            Sửa
          </button>
        </div>
        <button 
          className="action-btn delete-btn" 
          onClick={() => { if (selectedParentId) setShowParentDeleteConfirm(true); }}
          disabled={!selectedParentId}
        >
          Xóa
        </button>
      </div>
    </div>
  );
}

export default AccountManager;

