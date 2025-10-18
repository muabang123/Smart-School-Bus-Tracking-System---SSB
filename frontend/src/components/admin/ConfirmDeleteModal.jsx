import React from 'react';
import './RouteModal.css'; // Dùng chung CSS với modal kia cho tiện

function ConfirmDeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="rt-mgnt-modal-backdrop">
      <div className="rt-mgnt-modal-content" style={{ maxWidth: '450px' }}>
        <h2 style={{ marginTop: 0 }}>Xác nhận xóa</h2>
        <p>Bạn có chắc chắn muốn xóa tuyến đường này không? Hành động này không thể hoàn tác.</p>
        
        <div className="rt-mgnt-modal-actions">
          <button 
            onClick={onClose} 
            className="rt-mgnt-btn-cancel"
          >
            Hủy
          </button>
          <button 
            onClick={onConfirm} 
            className="rt-mgnt-btn-save" 
            style={{ backgroundColor: '#ff6347' }} 
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;