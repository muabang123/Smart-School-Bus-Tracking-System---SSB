import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './ScheduleManager.css';

const statusMap = {
  1: { text: 'Sắp diễn ra', color: '#007bff' },
  2: { text: 'Đang chạy', color: '#ffc107' },
  3: { text: 'Đã hoàn thành', color: '#28a745' },
  4: { text: 'Đã hủy', color: '#dc3545' },
};

const initialSchedules = [
    {
    id: 'LT001',
    ngayThucHien: '2025-10-26',
    gioBatDau: '07:30',
    trangThai: 1,
    tuyen: 'TP.HCM - Vũng Tàu',
    taiXe: 'Nguyễn Văn A',
    bienSoXe: '51A-123.45',
  },
  {
    id: 'LT002',
    ngayThucHien: '2025-10-26',
    gioBatDau: '09:00',
    trangThai: 3,
    tuyen: 'TP.HCM - Đà Lạt',
    taiXe: 'Trần Thị B',
    bienSoXe: '51B-678.90',
  },
  {
    id: 'LT003',
    ngayThucHien: '2025-10-27',
    gioBatDau: '14:00',
    trangThai: 2,
    tuyen: 'TP.HCM - Cần Thơ',
    taiXe: 'Lê Văn C',
    bienSoXe: '51C-555.55',
  },
  {
    id: 'LT004',
    ngayThucHien: '2025-10-28',
    gioBatDau: '08:15',
    trangThai: 4,
    tuyen: 'TP.HCM - Nha Trang',
    taiXe: 'Phạm Thị D',
    bienSoXe: '51D-444.44',
  },
  {
    id: 'LT005',
    ngayThucHien: '2025-10-29',
    gioBatDau: '10:30',
    trangThai: 1,
    tuyen: 'TP.HCM - Phan Thiết',
    taiXe: 'Võ Văn E',
    bienSoXe: '51E-333.33',
  },
  {
    id: 'LT006',
    ngayThucHien: '2025-10-30',
    gioBatDau: '13:00',
    trangThai: 2,
    tuyen: 'TP.HCM - Long Hải',
    taiXe: 'Đặng Thị F',
    bienSoXe: '51F-222.22',
  },
  {
    id: 'LT007',
    ngayThucHien: '2025-10-31',
    gioBatDau: '15:45',
    trangThai: 3,
    tuyen: 'TP.HCM - Vũng Tàu',
    taiXe: 'Trương Văn G',
  },
  {
    id: 'LT008',
    ngayThucHien: '2025-11-01',
    gioBatDau: '07:00',
    trangThai: 4,
    tuyen: 'TP.HCM - Đà Lạt',
    taiXe: 'Ngô Thị H',
    bienSoXe: '51H-111.11',
  },
];

const ScheduleFormModal = ({ schedule, onSave, onClose }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (schedule) {
      setFormData({ ...schedule });
    } else {
      setFormData({
        ngayThucHien: '',
        gioBatDau: '',
        tuyen: '',
        taiXe: '',
        bienSoXe: '',
        trangThai: 1,
      });
    }
  }, [schedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'trangThai' ? parseInt(value, 10) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const isEditing = !!schedule;

  return ReactDOM.createPortal(
    <div className="schedule-manager-modal-backdrop" onClick={onClose}>
      <div className="schedule-manager-form-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? 'Chỉnh sửa lịch trình' : 'Thêm lịch trình mới'}</h2>
        <form onSubmit={handleSubmit}>
          {isEditing && (
            <div className="schedule-manager-form-group">
              <label>Mã lịch trình</label>
              <input type="text" value={formData.id || ''} disabled />
            </div>
          )}
          <div className="schedule-manager-form-group">
            <label>Ngày thực hiện</label>
            <input type="date" name="ngayThucHien" value={formData.ngayThucHien || ''} onChange={handleChange} required />
          </div>
          <div className="schedule-manager-form-group">
            <label>Giờ bắt đầu</label>
            <input type="time" name="gioBatDau" value={formData.gioBatDau || ''} onChange={handleChange} required />
          </div>
          <div className="schedule-manager-form-group">
            <label>Tuyến</label>
            <input type="text" name="tuyen" value={formData.tuyen || ''} onChange={handleChange} required />
          </div>
          <div className="schedule-manager-form-group">
            <label>Tài xế</label>
            <input type="text" name="taiXe" value={formData.taiXe || ''} onChange={handleChange} required />
          </div>
          <div className="schedule-manager-form-group">
            <label>Biển số xe</label>
            <input type="text" name="bienSoXe" value={formData.bienSoXe || ''} onChange={handleChange} required />
          </div>
          {/* {isEditing && (
            <div className="schedule-manager-form-group">
              <label>Trạng thái</label>
              <select name="trangThai" value={formData.trangThai || 1} onChange={handleChange}>
                {Object.keys(statusMap).map(key => (
                  <option key={key} value={key}>{statusMap[key].text}</option>
                ))}
              </select>
            </div>
          )} */}
          <div className="schedule-manager-form-actions">
            <button type="button" onClick={onClose} className="schedule-manager-btn--cancel">Hủy</button>
            <button type="submit" className="schedule-manager-btn--save">Lưu</button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

const ScheduleDetailModal = ({ schedule, onClose }) => {
    if (!schedule) return null;
    return ReactDOM.createPortal(
        <div className="schedule-manager-modal-backdrop" onClick={onClose}>
            <div className="schedule-manager-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Chi tiết lịch trình</h2>
                <p><strong>Mã lịch trình:</strong> {schedule.id}</p>
                <p><strong>Ngày thực hiện:</strong> {schedule.ngayThucHien}</p>
                <p><strong>Tuyến:</strong> {schedule.tuyen}</p>
                <p><strong>Giờ khởi hành:</strong> {schedule.gioBatDau}</p>
                <p><strong>Tài xế:</strong> {schedule.taiXe}</p>
                <p><strong>Biển số xe:</strong> {schedule.bienSoXe}</p>
                <p><strong>Trạng thái:</strong> {statusMap[schedule.trangThai]?.text}</p>
                <button onClick={onClose} className="schedule-manager-modal-close-btn">Đóng</button>
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const selectedSchedule = schedules.find(s => s.id === selectedScheduleId);

  const handleOpenAddModal = () => {
    setEditingSchedule(null);
    setIsFormModalOpen(true);
  };
  
  const handleOpenEditModal = () => {
    if (!selectedSchedule) return alert('Vui lòng chọn một lịch trình để sửa!');
    setEditingSchedule(selectedSchedule);
    setIsFormModalOpen(true);
  };
  
  const handleDelete = () => {
    if (!selectedSchedule) return alert('Vui lòng chọn một lịch trình để xóa!');
    if (window.confirm(`Bạn có chắc chắn muốn xóa lịch trình ${selectedSchedule.id} không?`)) {
      setSchedules(schedules.filter(s => s.id !== selectedScheduleId));
      setSelectedScheduleId(null);
    }
  };
  
  const handleViewDetails = () => {
    if (!selectedSchedule) return alert('Vui lòng chọn một lịch trình để xem chi tiết!');
    setIsDetailModalOpen(true);
  };

  const handleSaveSchedule = (scheduleData) => {
    if (editingSchedule) {
      setSchedules(schedules.map(s => s.id === editingSchedule.id ? { ...scheduleData } : s));
      alert('Cập nhật lịch trình thành công!');
    } else {
      const newSchedule = {
        ...scheduleData,
        id: `LT${Date.now()}`, 
      };
      setSchedules([newSchedule, ...schedules]);
      alert('Thêm lịch trình mới thành công!');
    }
    setIsFormModalOpen(false); 
    setEditingSchedule(null);
  };

  return (
    <div className="schedule-manager-container">
      <header className="schedule-manager-header">
        <h1>Quản lý lịch trình</h1>
        <span>ADMIN ONLINE : 1</span>
      </header>

      <div className="schedule-manager-body">
        <div className="schedule-manager-info-card">
          <div className="schedule-manager-info-card-header">Lịch trình</div>
          <div className="schedule-manager-info-card-content">2</div>
        </div>

        <hr className="schedule-manager-divider" />

        <div className="schedule-manager-main-content">
          <h2>Lịch trình</h2>
          <div className="schedule-manager-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Mã lịch trình</th>
                  <th>Ngày thực hiện</th>
                  <th>Giờ bắt đầu</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr
                    key={schedule.id}
                    className={`schedule-manager-table-row ${selectedScheduleId === schedule.id ? 'schedule-manager-table-row--selected' : ''}`}
                    onClick={() => setSelectedScheduleId(schedule.id)}
                  >
                    <td>{schedule.id}</td>
                    <td>{schedule.ngayThucHien}</td>
                    <td>{schedule.gioBatDau}</td>
                    <td>
                      <span 
                        className="schedule-manager-status-badge"
                        style={{ backgroundColor: statusMap[schedule.trangThai]?.color || '#6c757d' }}
                      >
                        {statusMap[schedule.trangThai]?.text || 'Không xác định'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="schedule-manager-actions">
            <button className="schedule-manager-btn schedule-manager-btn--blue" onClick={handleOpenAddModal}>Thêm</button>
            <button className="schedule-manager-btn schedule-manager-btn--blue" onClick={handleOpenEditModal} disabled={!selectedScheduleId}>Sửa</button>
            <button className="schedule-manager-btn schedule-manager-btn--red" onClick={handleDelete} disabled={!selectedScheduleId}>Xóa</button>
            <button className="schedule-manager-btn schedule-manager-btn--red" onClick={handleViewDetails} disabled={!selectedScheduleId}>Xem chi tiết</button>
          </div>
        </div>
      </div>
      
      {isDetailModalOpen && <ScheduleDetailModal schedule={selectedSchedule} onClose={() => setIsDetailModalOpen(false)} />}
      {isFormModalOpen && <ScheduleFormModal schedule={editingSchedule} onSave={handleSaveSchedule} onClose={() => setIsFormModalOpen(false)} />}
    </div>
  );
};

export default ScheduleManagement;