import React, { useState, useEffect } from 'react';
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
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({ fullName: '', email: '', phoneNumber: '', avatarUrl: '', role: 'Admin', status: 'Active' })
  const selectedUser = users.find(u => u.id === selectedUserId)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/sql/users')
        const rows = await res.json()
        setUsers(Array.isArray(rows) ? rows : [])
      } catch {
        setUsers([])
      }
    }
    fetchUsers()
  }, [])

  const openAdd = () => { setSelectedUserId(null); setFormData({ fullName: '', email: '', phoneNumber: '', avatarUrl: '', role: 'Admin', status: 'Active' }); setIsFormOpen(true) }
  const openEdit = () => { if (!selectedUser) return; setFormData({ fullName: selectedUser.fullName, email: selectedUser.email, phoneNumber: selectedUser.phoneNumber, avatarUrl: selectedUser.avatarUrl, role: selectedUser.role, status: selectedUser.status }); setIsFormOpen(true) }

  const saveUser = async () => {
    try {
      if (selectedUser) {
        await fetch(`http://localhost:5000/api/sql/users/${selectedUser.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      } else {
        await fetch('http://localhost:5000/api/sql/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      }
      const res = await fetch('http://localhost:5000/api/sql/users')
      const rows = await res.json()
      setUsers(Array.isArray(rows) ? rows : [])
      setIsFormOpen(false)
    } catch {}
  }

  const deleteUser = async () => {
    if (!selectedUser) return
    if (!window.confirm(`Xóa tài khoản ${selectedUser.fullName}?`)) return
    try {
      await fetch(`http://localhost:5000/api/sql/users/${selectedUser.id}`, { method: 'DELETE' })
      setUsers(users.filter(u => u.id !== selectedUser.id))
      setSelectedUserId(null)
    } catch {}
  }

  const toggleStatus = async () => {
    if (!selectedUser) return
    const next = selectedUser.status === 'Active' ? 'Locked' : 'Active'
    try {
      await fetch(`http://localhost:5000/api/sql/users/${selectedUser.id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) })
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: next } : u))
    } catch {}
  }

  return (
    <div className="main-content">
      <div className="account-header"><h2>Quản lý tài khoản</h2><span className="admin-status">ADMIN ONLINE : 1</span></div>
      <div className="tables-section">
        <div className="table-container parent-table">
          <table>
            <thead><tr><th>Tên</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>SĐT</th><th>Ngày tạo</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} onClick={() => setSelectedUserId(u.id)} className={selectedUserId === u.id ? 'selected' : ''}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.status}</td>
                  <td>{u.phoneNumber}</td>
                  <td>{u.createdAt?.slice(0,10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="action-buttons-footer">
        <div className="left-actions">
          <button className="action-btn" onClick={openAdd}>Thêm</button>
          <button className="action-btn edit-btn" onClick={openEdit} disabled={!selectedUserId}>Sửa</button>
        </div>
        <button className="action-btn delete-btn" onClick={deleteUser} disabled={!selectedUserId}>Xóa</button>
        <button className="action-btn" onClick={toggleStatus} disabled={!selectedUserId}>Khóa/Mở khóa</button>
      </div>

      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{selectedUser ? 'SỬA TÀI KHOẢN' : 'THÊM TÀI KHOẢN'}</h2>
            <div className="form-grid">
              <div className="form-group"><label>Tên</label><input type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} /></div>
              <div className="form-group"><label>Email</label><input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
              <div className="form-group"><label>SĐT</label><input type="text" value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} /></div>
              <div className="form-group"><label>Avatar URL</label><input type="text" value={formData.avatarUrl} onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })} /></div>
              <div className="form-group"><label>Vai trò</label><select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}><option>Admin</option><option>Tài xế</option><option>Phụ huynh</option><option>Nhân viên hỗ trợ</option></select></div>
              <div className="form-group"><label>Trạng thái</label><select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}><option>Active</option><option>Locked</option></select></div>
            </div>
            <div className="edit-modal-footer"><button className="modal-btn cancel-btn" onClick={() => setIsFormOpen(false)}>Hủy</button><button className="modal-btn save-changes-btn" onClick={saveUser}>Lưu</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountManager;

