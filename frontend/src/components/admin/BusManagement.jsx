import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './BusManagement.css';

// Dữ liệu mẫu ban đầu
const initialBuses = [
   { licensePlate: '51A-123.45', route: 'Tuyến 01', seats: 45, speed: 50 },
   { licensePlate: '51B-678.90', route: 'Tuyến 02', seats: 29, speed: 45 },
   { licensePlate: '51C-555.55', route: 'Tuyến 03', seats: 45, speed: 55 }
];

// --- COMPONENT MODAL XÁC NHẬN ---
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
   return ReactDOM.createPortal(
     <div className="bus-manager-modal-backdrop" onClick={onCancel}>
        <div className="bus-manager-confirmation-modal" onClick={(e) => e.stopPropagation()}>
          <p className="bus-manager-confirmation-message">{message}</p>
          <div className="bus-manager-confirmation-actions">
             <button onClick={onConfirm} className="bus-manager-modal-btn bus-manager-confirm-btn--yes">Xác nhận</button>
             <button onClick={onCancel} className="bus-manager-modal-btn bus-manager-confirm-btn--no">Hủy</button>
          </div>
        </div>
     </div>,
     document.getElementById('modal-root')
   );
};

// --- COMPONENT MODAL THÔNG BÁO THÀNH CÔNG ---
const SuccessModal = ({ message, onClose }) => {
   return ReactDOM.createPortal(
     <div className="bus-manager-modal-backdrop" onClick={onClose}>
        <div className="bus-manager-success-modal" onClick={(e) => e.stopPropagation()}>
          <p className="bus-manager-success-message">{message}</p>
          <button onClick={onClose} className="bus-manager-modal-btn bus-manager-success-btn--ok">OK</button>
        </div>
     </div>,
     document.getElementById('modal-root')
   );
};


// --- COMPONENT MODAL THÊM/SỬA XE BUÝT ---
const BusFormModal = ({ bus, onSave, onClose }) => {
   const [formData, setFormData] = useState({ licensePlate: '', seats: '', speed: '' });
   const isEditing = !!bus;

   useEffect(() => {
     if (isEditing) {
      setFormData({ licensePlate: bus.licensePlate, seats: bus.seats, speed: bus.speed });
    } else {
      setFormData({ licensePlate: '', seats: '', speed: '' });
    }
   }, [bus, isEditing]);

   const handleChange = (e) => {
     const { name, value } = e.target;
     setFormData(prev => ({ ...prev, [name]: value }));
   };

   const handleSubmit = (e) => {
     e.preventDefault();
     if (!formData.licensePlate || !formData.seats || !formData.speed) {
        alert('Vui lòng nhập đầy đủ thông tin.');
        return;
     }
    const seats = parseInt(formData.seats, 10);
    const speed = parseInt(formData.speed, 10);

     if (seats < 14 || seats > 50) {
        alert('Số ghế hợp lệ trong khoảng từ 14 đến 50 chỗ.');
        return;
     }

    if (speed <= 0 || speed > 100) {
      alert('Tốc độ xe hợp lệ trong khoảng từ 1 đến 100 km/h.');
      return;
    }

     onSave(formData, isEditing ? bus.licensePlate : null);
   };

   return ReactDOM.createPortal(
     <div className="bus-manager-modal-backdrop" onClick={onClose}>
        <div className="bus-manager-form-modal" onClick={(e) => e.stopPropagation()}>
          <header className="bus-manager-form-header">
             <h2>{isEditing ? 'Sửa xe buýt' : 'Thêm xe buýt'}</h2>
             <button onClick={onClose} className="bus-manager-form-close-btn">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
             </button>
          </header>
          <main className="bus-manager-form-body">
             <form onSubmit={handleSubmit}>
               <div className="bus-manager-form-group">
                  <label htmlFor="licensePlate">Biển số xe:</label>
                  <input id="licensePlate" name="licensePlate" type="text" value={formData.licensePlate} onChange={handleChange} />
               </div>
               <div className="bus-manager-form-group">
                  <label htmlFor="seats">Số ghế:</label>
                  <input id="seats" name="seats" type="number" min="0" value={formData.seats} onChange={handleChange} />
               </div>
            <div className="bus-manager-form-group">
                  <label htmlFor="speed">Tốc độ (km/h):</label>
                  <input id="speed" name="speed" type="number" min="0" value={formData.speed} onChange={handleChange} />
               </div>
               <hr className="bus-manager-form-divider" />
               <div className="bus-manager-form-footer">
                  <button type="submit" className="bus-manager-form-submit-btn">{isEditing ? 'Lưu' : 'Thêm'}</button>
               </div>
             </form>
          </main>
        </div>
     </div>,
     document.getElementById('modal-root')
   );
};


// --- COMPONENT CHÍNH ---
const BusManagement = () => {
   const [buses, setBuses] = useState(initialBuses);
   const [searchQuery, setSearchQuery] = useState('');
   const [searchBy, setSearchBy] = useState('licensePlate');
   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
   const [editingBus, setEditingBus] = useState(null);
   const [selectedBusPlate, setSelectedBusPlate] = useState(null);

   // States cho các modal mới
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
   const [showSuccessModal, setShowSuccessModal] = useState(false);
   const [modalMessage, setModalMessage] = useState('');

   const handleSearchChange = (e) => setSearchQuery(e.target.value);
   const handleSearchByChange = (e) => setSearchBy(e.target.value);

   const handleOpenAddModal = () => {
     setEditingBus(null);
     setIsFormModalOpen(true);
   };

   const handleOpenEditModal = () => {
     if (!selectedBusPlate) return;
     const busToEdit = buses.find(b => b.licensePlate === selectedBusPlate);
     setEditingBus(busToEdit);
     setIsFormModalOpen(true);
   };

   const handleCloseAllModals = () => {
     setIsFormModalOpen(false);
     setShowDeleteConfirm(false);
     setShowSuccessModal(false);
   };

   // Hàm chỉ để mở modal xác nhận xóa
   const handleDeleteBus = () => {
     if (!selectedBusPlate) return;
     setShowDeleteConfirm(true);
   };

   // Hàm thực hiện xóa sau khi xác nhận
   const confirmDelete = () => {
     setBuses(prev => prev.filter(b => b.licensePlate !== selectedBusPlate));
     setSelectedBusPlate(null);
     setShowDeleteConfirm(false);
     setModalMessage('Đã xóa xe thành công!');
     setShowSuccessModal(true);
   };

   const handleSaveBus = (formData, originalPlate) => {
     if (originalPlate) { // Sửa
        setBuses(prev => prev.map(bus => bus.licensePlate === originalPlate ? { ...bus, ...formData } : bus));
        setSelectedBusPlate(formData.licensePlate);
        setModalMessage('Đã sửa thông tin xe thành công!');
     } else { // Thêm
        if (buses.some(bus => bus.licensePlate === formData.licensePlate)) {
          alert('Biển số xe đã tồn tại!');
          return;
        }
        const newBus = { ...formData, route: 'Chưa xếp tuyến' };
        setBuses(prev => [newBus, ...prev]);
        setModalMessage('Đã thêm xe mới thành công!');
     }
     setIsFormModalOpen(false);
     setShowSuccessModal(true);
   };

   const filteredBuses = buses.filter(bus => {
     if (!searchQuery) return true;
     const valueToSearch = bus[searchBy];
     return String(valueToSearch).toLowerCase().includes(searchQuery.toLowerCase());
   });

   return (
     <div className="bus-manager-container">
        <header className="bus-manager-header">
          <h1>Quản lý xe buýt</h1>
          <span>ADMIN ONLINE : 1</span>
        </header>

        <main className="bus-manager-body">
          <hr className="bus-manager-divider" />
          <div className="bus-manager-info-card">
             <div className="bus-manager-info-card-header">Tổng số xe</div>
             <div className="bus-manager-info-card-content">{buses.length}</div>
          </div>
          <hr className="bus-manager-divider" />

          <div className="bus-manager-list-section">
             <div className="bus-manager-controls">
               <h2>Danh sách xe buýt</h2>
               <div className="bus-manager-filters">
                  <div className="bus-manager-search">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                       <path d="M21 21L16.65 16.65" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input type="text" placeholder="Tìm kiếm..." value={searchQuery} onChange={handleSearchChange} />
                  </div>
                  <div className="bus-manager-sort">
                    <label htmlFor="search-by-select">Search by: </label>
                    <select id="search-by-select" className="bus-manager-sort-select" value={searchBy} onChange={handleSearchByChange}>
                       <option value="licensePlate">Biển số xe</option>
                       <option value="route">Tuyến</option>
                       <option value="seats">Số ghế</option>
                  <option value="speed">Tốc độ</option>
                    </select>
                  </div>
               </div>
             </div>
     
             <div className="bus-manager-table-container">
               <table>
                  <thead>
                    <tr>
                       <th>Biển số xe</th>
                       <th>Tuyến</th>
                       <th>Số ghế</th>
                  <th>Tốc độ (km/h)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBuses.map((bus) => (
                       <tr key={bus.licensePlate} className={selectedBusPlate === bus.licensePlate ? 'bus-manager-row--selected' : ''} onClick={() => setSelectedBusPlate(bus.licensePlate)}>
                         <td>{bus.licensePlate}</td>
                         <td>{bus.route}</td>
                         <td>{bus.seats}</td>
                    <td>{bus.speed}</td>
                       </tr>
                    ))}
                  </tbody>
               </table>
             </div>
          </div>
        </main>
        
        <footer className="bus-manager-footer-actions">
          <div className="bus-manager-left-actions">
               <button className="bus-manager-btn bus-manager-btn--add" onClick={handleOpenAddModal}>Thêm</button>
               <button className="bus-manager-btn bus-manager-btn--edit" onClick={handleOpenEditModal} disabled={!selectedBusPlate}>Sửa</button>
          </div>
          <button className="bus-manager-btn bus-manager-btn--delete" onClick={handleDeleteBus} disabled={!selectedBusPlate}>Xóa</button>
        </footer>

        {isFormModalOpen && <BusFormModal bus={editingBus} onSave={handleSaveBus} onClose={handleCloseAllModals} />}
        {showDeleteConfirm && <ConfirmationModal message={`Bạn có chắc muốn xóa xe ${selectedBusPlate}?`} onConfirm={confirmDelete} onCancel={handleCloseAllModals} />}
        {showSuccessModal && <SuccessModal message={modalMessage} onClose={handleCloseAllModals} />}
     </div>
   );
};

export default BusManagement;