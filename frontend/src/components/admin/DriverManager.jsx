import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './DriverManager.css';

// Dữ liệu mẫu ban đầu
const initialDrivers = [
  { id: 'TX001', name: 'Nguyễn Văn A', phone: '0901234567', license: 'B2' },
  { id: 'TX002', name: 'Trần Thị B', phone: '0987654321', license: 'C' },
  { id: 'TX003', name: 'Lê Văn C', phone: '0912345678', license: 'B2' },
  { id: 'TX003', name: 'Lê Văn C', phone: '0912345678', license: 'B2' },
  { id: 'TX003', name: 'Lê Văn C', phone: '0912345678', license: 'B2' },
  { id: 'TX003', name: 'Lê Văn C', phone: '0912345678', license: 'B2' },
  { id: 'TX003', name: 'Lê Văn C', phone: '0912345678', license: 'B2' },
  { id: 'TX003', name: 'Lê Văn C', phone: '0912345678', license: 'B2' },
  { id: 'TX003', name: 'Lê Văn C', phone: '0912345678', license: 'B2' },
  { id: 'TX003', name: 'Lê Văn C', phone: '0912345678', license: 'B2' },
  { id: 'TX003', name: 'Lê Văn C', phone: '0912345678', license: 'B2' },
  { id: 'TX003', name: 'Lê Văn C', phone: '0912345678', license: 'B2' },
  { id: 'TX003', name: 'Lê Văn C', phone: '0912345678', license: 'B2' },
];

// --- MODAL XÁC NHẬN --- (Không thay đổi)
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return ReactDOM.createPortal(
    <div className="driver-manager-modal-backdrop" onClick={onCancel}>
      <div className="driver-manager-confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <p className="driver-manager-confirmation-message">{message}</p>
        <div className="driver-manager-confirmation-actions">
          <button onClick={onConfirm} className="driver-manager-modal-btn driver-manager-confirm-btn--yes">Xác nhận</button>
          <button onClick={onCancel} className="driver-manager-modal-btn driver-manager-confirm-btn--no">Hủy</button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

// --- MODAL THÔNG BÁO THÀNH CÔNG --- (Không thay đổi)
const SuccessModal = ({ message, onClose }) => {
  return ReactDOM.createPortal(
    <div className="driver-manager-modal-backdrop" onClick={onClose}>
      <div className="driver-manager-success-modal" onClick={(e) => e.stopPropagation()}>
        <p className="driver-manager-success-message">{message}</p>
        <button onClick={onClose} className="driver-manager-modal-btn driver-manager-success-btn--ok">OK</button>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

// --- MODAL FORM THÊM/SỬA TÀI XẾ ---
const DriverFormModal = ({ driver, onSave, onClose }) => {
  // SỬA ĐỔI: Bỏ `id` khỏi state mặc định
  const [formData, setFormData] = useState({ name: '', phone: '', license: '' });
  const isEditing = !!driver;

  useEffect(() => {
    if (isEditing) {
      setFormData({ id: driver.id, name: driver.name, phone: driver.phone, license: driver.license });
    } else {
      // Reset form khi thêm mới
      setFormData({ name: '', phone: '', license: '' });
    }
  }, [driver, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // SỬA ĐỔI: Bỏ kiểm tra `id`
    if (!formData.name || !formData.phone || !formData.license) {
      alert('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    onSave(formData, isEditing ? driver.id : null);
  };

  return ReactDOM.createPortal(
    <div className="driver-manager-modal-backdrop" onClick={onClose}>
      <div className="driver-manager-form-modal" onClick={(e) => e.stopPropagation()}>
        <header className="driver-manager-form-header">
          <h2>{isEditing ? 'Sửa thông tin tài xế' : 'Thêm tài xế'}</h2>
          <button onClick={onClose} className="driver-manager-form-close-btn">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </header>
        <main className="driver-manager-form-body">
          <form onSubmit={handleSubmit}>
            {/* SỬA ĐỔI: Chỉ hiển thị Mã tài xế khi Sửa */}
            {isEditing && (
              <div className="driver-manager-form-group">
                <label htmlFor="id">Mã tài xế:</label>
                <input id="id" name="id" type="text" value={formData.id} disabled />
              </div>
            )}
            <div className="driver-manager-form-group">
              <label htmlFor="name">Tên tài xế:</label>
              <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} />
            </div>
            <div className="driver-manager-form-group">
              <label htmlFor="phone">Số điện thoại:</label>
              <input id="phone" name="phone" type="text" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="driver-manager-form-group">
              <label htmlFor="license">Bằng lái:</label>
              <input id="license" name="license" type="text" value={formData.license} onChange={handleChange} />
            </div>
            <hr className="driver-manager-form-divider" />
            <div className="driver-manager-form-footer">
              <button type="submit" className="driver-manager-form-submit-btn">{isEditing ? 'Lưu' : 'Thêm'}</button>
            </div>
          </form>
        </main>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

// --- COMPONENT CHÍNH ---
const DriverManager = () => {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSearchByChange = (e) => setSearchBy(e.target.value);

  const handleOpenAddModal = () => {
    setEditingDriver(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = () => {
    if (!selectedDriverId) return;
    const driverToEdit = drivers.find(d => d.id === selectedDriverId);
    setEditingDriver(driverToEdit);
    setIsFormModalOpen(true);
  };
  
  const handleCloseAllModals = () => {
    setIsFormModalOpen(false);
    setShowDeleteConfirm(false);
    setShowSuccessModal(false);
  };
  
  const handleDeleteDriver = () => {
    if (!selectedDriverId) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setDrivers(prev => prev.filter(d => d.id !== selectedDriverId));
    setSelectedDriverId(null);
    setShowDeleteConfirm(false);
    setModalMessage('Đã xóa tài xế thành công!');
    setShowSuccessModal(true);
  };

  // SỬA ĐỔI: Cập nhật logic lưu
  const handleSaveDriver = (formData, originalId) => {
    if (originalId) { // Chế độ Sửa
      setDrivers(prev => prev.map(driver => driver.id === originalId ? { ...driver, ...formData } : driver));
      setModalMessage('Đã sửa thông tin tài xế thành công!');
    } else { // Chế độ Thêm
      // Tự động tạo ID mới
      const maxIdNum = drivers.reduce((max, driver) => {
          const currentNum = parseInt(driver.id.substring(2), 10);
          return currentNum > max ? currentNum : max;
      }, 0);
      const newId = `TX${String(maxIdNum + 1).padStart(3, '0')}`;

      const newDriver = {
          id: newId,
          ...formData,
      };

      setDrivers(prev => [newDriver, ...prev]);
      setModalMessage('Đã thêm tài xế mới thành công!');
    }
    setIsFormModalOpen(false);
    setShowSuccessModal(true);
  };
  
  const filteredDrivers = drivers.filter(driver => {
    if (!searchQuery) return true;
    const valueToSearch = driver[searchBy];
    return String(valueToSearch).toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="driver-manager-container">
      <header className="driver-manager-header">
        <h1>Quản lý tài xế</h1>
        <span>ADMIN ONLINE : 1</span>
      </header>
      
      <main className="driver-manager-body">
        <hr className="driver-manager-divider" />
        <div className="driver-manager-info-card">
          <div className="driver-manager-info-card-header">Tổng số tài xế</div>
          <div className="driver-manager-info-card-content">{drivers.length}</div>
        </div>
        <hr className="driver-manager-divider" />
        
        <div className="driver-manager-list-section">
          <div className="driver-manager-controls">
            <h2>Danh sách tài xế</h2>
            <div className="driver-manager-filters">
              <div className="driver-manager-search">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input type="text" placeholder="Tìm kiếm..." value={searchQuery} onChange={handleSearchChange} />
              </div>
              <div className="driver-manager-sort">
                <label htmlFor="search-by-select">Search by: </label>
                <select id="search-by-select" className="driver-manager-sort-select" value={searchBy} onChange={handleSearchByChange}>
                  <option value="name">Tên</option>
                  <option value="id">Mã tài xế</option>
                  <option value="phone">Số điện thoại</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="driver-manager-table-container">
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
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id} className={selectedDriverId === driver.id ? 'driver-manager-row--selected' : ''} onClick={() => setSelectedDriverId(driver.id)}>
                    <td>{driver.id}</td>
                    <td>{driver.name}</td>
                    <td>{driver.phone}</td>
                    <td>{driver.license}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <footer className="driver-manager-footer-actions">
        <div className="driver-manager-left-actions">   
            <button className="driver-manager-btn driver-manager-btn--add" onClick={handleOpenAddModal}>Thêm</button>
            <button className="driver-manager-btn driver-manager-btn--edit" onClick={handleOpenEditModal} disabled={!selectedDriverId}>Sửa</button>
        </div>
        <button className="driver-manager-btn driver-manager-btn--delete" onClick={handleDeleteDriver} disabled={!selectedDriverId}>Xóa</button>
      </footer>

      {isFormModalOpen && <DriverFormModal driver={editingDriver} onSave={handleSaveDriver} onClose={handleCloseAllModals} />}
      {showDeleteConfirm && <ConfirmationModal message={`Bạn có chắc muốn xóa tài xế ${selectedDriverId}?`} onConfirm={confirmDelete} onCancel={handleCloseAllModals} />}
      {showSuccessModal && <SuccessModal message={modalMessage} onClose={handleCloseAllModals} />}
    </div>
  );
};

export default DriverManager;