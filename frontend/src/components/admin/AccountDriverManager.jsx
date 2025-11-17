import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './AccountDriverManager.css';

// --- Reusable Confirmation Modal Component ---
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

// --- Add Driver Modal Component ---
function AddDriverModal({ closeModal, onAddDriver }) {
  const [driverId, setDriverId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [license, setLicense] = useState('');

  const handleComplete = () => {
    if (!driverId || !name || !phone || !license) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
    }
    const newDriverData = {
      id: driverId,
      name,
      phone,
      license
    };
    onAddDriver(newDriverData);
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content add-driver-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">ACCOUNT</h2>
        <div className="modal-section">
          <div className="form-row">
            <label htmlFor="driver-id">Mã tài xế:</label>
            <input type="text" id="driver-id" value={driverId} onChange={e => setDriverId(e.target.value)} />
          </div>
          <div className="form-row">
            <label htmlFor="driver-name">Tên:</label>
            <input type="text" id="driver-name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-row">
            <label htmlFor="driver-phone">Số điện thoại:</label>
            <input type="text" id="driver-phone" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="form-row">
            <label htmlFor="driver-license">Bằng lái:</label>
            <input type="text" id="driver-license" value={license} onChange={e => setLicense(e.target.value)} />
          </div>
        </div>
        <div className="add-driver-footer">
          <button className="modal-btn driver-action-btn" onClick={closeModal}>Quay Lại</button>
          <button className="modal-btn driver-action-btn" onClick={handleComplete}>Hoàn tất</button>
        </div>
      </div>
    </div>
  );
}


// --- Edit Driver Modal Component ---
function EditDriverModal({ closeModal, onSave, driverData }) {
  const [name, setName] = useState(driverData.name);
  const [phone, setPhone] = useState(driverData.phone);
  const [license, setLicense] = useState(driverData.license);
  
  const handleSaveChanges = () => {
    const updatedDriverData = {
      ...driverData,
      name,
      phone,
      license
    };
    onSave(updatedDriverData);
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">CHỈNH SỬA TÀI KHOẢN TÀI XẾ</h2>
        <div className="modal-section">
          <div className="form-row">
            <label>Mã tài xế:</label>
            <input type="text" value={driverData.id} disabled />
          </div>
          <div className="form-row">
            <label htmlFor="edit-driver-name">Tên:</label>
            <input type="text" id="edit-driver-name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-row">
            <label htmlFor="edit-driver-phone">Số điện thoại:</label>
            <input type="text" id="edit-driver-phone" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
           <div className="form-row">
            <label htmlFor="edit-driver-license">Bằng lái:</label>
            <input type="text" id="edit-driver-license" value={license} onChange={e => setLicense(e.target.value)} />
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


// --- Main Driver Account Manager Component ---
function AccountDriversManager() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [driversData, setDriversData] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isCreateAccOpen, setIsCreateAccOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ fullName: '', phoneNumber: '', license: '', password: '' });
  const [message, setMessage] = useState('');

  const handleAddDriver = (newDriverData) => {
    setDriversData(prevData => [...prevData, newDriverData]);
  };
  
  const handleEditDriver = (updatedDriverData) => {
    setDriversData(prevData => 
      prevData.map(driver => driver.id === updatedDriverData.id ? updatedDriverData : driver)
    );
  };
  
  const handleDeleteDriver = () => {
    if (!selectedDriverId) return;
    setDriversData(prevData => prevData.filter(driver => driver.id !== selectedDriverId));
    setSelectedDriverId(null);
  };

  const selectedDriver = driversData.find(d => d.id === selectedDriverId);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/sql/accounts/drivers')
        const rows = await res.json()
        setDriversData(Array.isArray(rows) ? rows : [])
      } catch {
        setDriversData([])
      }
    }
    fetchDrivers()
  }, [])

  return (
    <div className="main-content">
      {isAddModalOpen && <AddDriverModal closeModal={() => setIsAddModalOpen(false)} onAddDriver={handleAddDriver} />}
      {isEditModalOpen && selectedDriver && (
        <EditDriverModal
          closeModal={() => setIsEditModalOpen(false)}
          onSave={handleEditDriver}
          driverData={selectedDriver}
        />
      )}
      {isPwdModalOpen && selectedDriver && (
        <div className="modal-overlay" onClick={() => setIsPwdModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Đặt mật khẩu tài xế</h2>
            <div className="form-row">
              <label>Tài xế</label>
              <input value={`${selectedDriver.name} (${selectedDriver.id})`} disabled />
            </div>
            <div className="form-row">
              <label>Mật khẩu mới</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div className="edit-modal-footer">
              <button className="modal-btn save-changes-btn" onClick={async () => {
                setMessage('')
                try {
                  const res = await fetch('http://localhost:5000/api/sql/auth/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: 'Driver', userId: selectedDriver.id, newPassword }) })
                  if (!res.ok) { const j = await res.json(); setMessage(j.message || 'Thất bại'); return }
                  setMessage('Đặt mật khẩu thành công')
                  setIsPwdModalOpen(false)
                  setNewPassword('')
                } catch { setMessage('Không thể kết nối máy chủ') }
              }}>Lưu</button>
              <button className="modal-btn cancel-btn" onClick={() => setIsPwdModalOpen(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
      {isCreateAccOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateAccOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Tạo tài khoản tài xế</h2>
            <div className="form-row">
              <label>Họ tên</label>
              <input value={createForm.fullName} onChange={e => setCreateForm({ ...createForm, fullName: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Số điện thoại</label>
              <input value={createForm.phoneNumber} onChange={e => setCreateForm({ ...createForm, phoneNumber: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Bằng lái</label>
              <input value={createForm.license} onChange={e => setCreateForm({ ...createForm, license: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Mật khẩu</label>
              <input type="password" value={createForm.password} onChange={e => setCreateForm({ ...createForm, password: e.target.value })} />
            </div>
            <div className="edit-modal-footer">
              <button className="modal-btn save-changes-btn" onClick={async () => {
                setMessage('')
                try {
                  const res = await fetch('http://localhost:5000/api/sql/auth/create-driver', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(createForm) })
                  if (!res.ok) { const j = await res.json(); setMessage(j.message || 'Tạo thất bại'); return }
                  const j = await res.json()
                  setIsCreateAccOpen(false)
                  setCreateForm({ fullName: '', phoneNumber: '', license: '', password: '' })
                  const resList = await fetch('http://localhost:5000/api/sql/accounts/drivers')
                  const rows = await resList.json()
                  setDriversData(Array.isArray(rows) ? rows : [])
                  setSelectedDriverId(j.id)
                  setMessage('Tạo tài khoản tài xế thành công')
                } catch { setMessage('Không thể kết nối máy chủ') }
              }}>Tạo</button>
              <button className="modal-btn cancel-btn" onClick={() => setIsCreateAccOpen(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <ConfirmationModal
          message={`Bạn có chắc muốn xóa tài xế "${selectedDriver?.name || selectedDriverId}"?`}
          onConfirm={() => { handleDeleteDriver(); setShowDeleteConfirm(false); }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      <div className="account-header">
        <h2>Quản lý tài khoản</h2>
        <span className="admin-status">ADMIN ONLINE : 1</span>
      </div>
      
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

      <h3 className="sub-header">Tài khoản / Tài xế</h3>
      <div className="table-container drivers-table">
        <table>
          <thead>
            <tr>
              <th>Mã tài xế</th>
              <th>Tên tài xế</th>
              <th>Số điện thoại</th>
              <th>Bằng lái</th>
            </tr>
          </thead>
          <tbody>
            {driversData.map(driver => (
              <tr 
                key={driver.id} 
                onClick={() => setSelectedDriverId(driver.id)}
                className={selectedDriverId === driver.id ? 'selected' : ''}
              >
                <td>{driver.id}</td>
                <td>{driver.name}</td>
                <td>{driver.phone}</td>
                <td>{driver.license}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="action-buttons-footer">
        <div className="left-actions">
          <button className="action-btn" onClick={() => setIsAddModalOpen(true)}>Thêm</button>
          <button 
            className="action-btn" 
            onClick={() => { if (selectedDriverId) setIsEditModalOpen(true); }}
            disabled={!selectedDriverId}
          >
            Sửa
          </button>
        </div>
        <button 
          className="action-btn delete-btn" 
          onClick={() => { if (selectedDriverId) setShowDeleteConfirm(true); }}
          disabled={!selectedDriverId}
        >
          Xóa
        </button>
        <button 
          className="action-btn" 
          onClick={() => { if (selectedDriverId) setIsPwdModalOpen(true); }}
          disabled={!selectedDriverId}
        >
          Đặt mật khẩu
        </button>
        <button 
          className="action-btn" 
          onClick={() => setIsCreateAccOpen(true)}
        >
          Tạo tài khoản tài xế
        </button>
      </div>
      {message && <div style={{ marginTop: 12 }}>{message}</div>}
    </div>
  );
}

export default AccountDriversManager;