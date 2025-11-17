import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './ScheduleManager.css';

const statusColor = {
  'Sắp diễn ra': '#007bff',
  'Đang chạy': '#ffc107',
  'Đã hoàn thành': '#28a745',
  'Đã hủy': '#dc3545',
};

const initialSchedules = [];

const ScheduleFormModal = ({ schedule, onSave, onClose }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (schedule) {
      setFormData({
        id: schedule.id,
        Date: schedule.date,
        StartTime: schedule.startTime,
        EndTime: schedule.endTime || '',
        RouteId: schedule.routeId || '',
        DriverId: schedule.driverId || '',
        VehicleId: schedule.vehicleId || '',
        Status: schedule.status || 'Sắp diễn ra',
        Notes: schedule.notes || ''
      });
    } else {
      setFormData({ Date: '', StartTime: '', EndTime: '', RouteId: '', DriverId: '', VehicleId: '', Status: 'Sắp diễn ra', Notes: '' });
    }
  }, [schedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
            <input type="date" name="Date" value={formData.Date || ''} onChange={handleChange} required />
          </div>
          <div className="schedule-manager-form-group">
            <label>Giờ bắt đầu</label>
            <input type="time" name="StartTime" value={formData.StartTime || ''} onChange={handleChange} required />
          </div>
          <div className="schedule-manager-form-group">
            <label>Giờ kết thúc</label>
            <input type="time" name="EndTime" value={formData.EndTime || ''} onChange={handleChange} />
          </div>
          <div className="schedule-manager-form-group">
            <label>Mã tuyến</label>
            <input type="text" name="RouteId" value={formData.RouteId || ''} onChange={handleChange} required />
          </div>
          <div className="schedule-manager-form-group">
            <label>Mã tài xế</label>
            <input type="text" name="DriverId" value={formData.DriverId || ''} onChange={handleChange} required />
          </div>
          <div className="schedule-manager-form-group">
            <label>Mã xe</label>
            <input type="text" name="VehicleId" value={formData.VehicleId || ''} onChange={handleChange} required />
          </div>
          <div className="schedule-manager-form-group">
            <label>Trạng thái</label>
            <select name="Status" value={formData.Status || 'Sắp diễn ra'} onChange={handleChange}>
              {Object.keys(statusColor).map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
          <div className="schedule-manager-form-group">
            <label>Ghi chú</label>
            <input type="text" name="Notes" value={formData.Notes || ''} onChange={handleChange} />
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
                <p><strong>Ngày thực hiện:</strong> {schedule.date}</p>
                <p><strong>Tuyến:</strong> {schedule.routeName}</p>
                <p><strong>Giờ khởi hành:</strong> {schedule.startTime}</p>
                <p><strong>Tài xế:</strong> {schedule.driverName}</p>
                <p><strong>Biển số xe:</strong> {schedule.licensePlate}</p>
                <p><strong>Trạng thái:</strong> {schedule.status}</p>
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

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/sql/admin/schedules')
        const rows = await res.json()
        setSchedules(Array.isArray(rows) ? rows : [])
      } catch (e) {
        setSchedules([])
      }
    }
    fetchSchedules()
  }, [])

  const handleOpenAddModal = () => {
    setEditingSchedule(null);
    setIsFormModalOpen(true);
  };
  
  const handleOpenEditModal = () => {
    if (!selectedSchedule) return alert('Vui lòng chọn một lịch trình để sửa!');
    setEditingSchedule(selectedSchedule);
    setIsFormModalOpen(true);
  };
  
  const handleDelete = async () => {
    if (!selectedSchedule) return alert('Vui lòng chọn một lịch trình để xóa!');
    if (window.confirm(`Bạn có chắc chắn muốn xóa lịch trình ${selectedSchedule.id} không?`)) {
      try {
        await fetch(`http://localhost:5000/api/sql/admin/schedules/${selectedSchedule.id}`, { method: 'DELETE' })
        setSchedules(schedules.filter(s => s.id !== selectedScheduleId));
        setSelectedScheduleId(null);
      } catch {}
    }
  };
  
  const handleViewDetails = () => {
    if (!selectedSchedule) return alert('Vui lòng chọn một lịch trình để xem chi tiết!');
    setIsDetailModalOpen(true);
  };

  const handleSaveSchedule = async (scheduleData) => {
    try {
      if (editingSchedule) {
        await fetch(`http://localhost:5000/api/sql/admin/schedules/${editingSchedule.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...scheduleData, ChangedBy: 'admin' })
        })
      } else {
        const res = await fetch('http://localhost:5000/api/sql/admin/schedules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...scheduleData, CreatedBy: 'admin' })
        })
        const created = await res.json()
      }
      const refresh = await fetch('http://localhost:5000/api/sql/admin/schedules')
      const rows = await refresh.json()
      setSchedules(Array.isArray(rows) ? rows : [])
      alert('Lưu lịch trình thành công!')
    } catch {
      alert('Có lỗi khi lưu lịch trình')
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
                  <th>Tuyến</th>
                  <th>Tài xế</th>
                  <th>Xe</th>
                  <th>Số điểm dừng</th>
                  <th>Số học sinh</th>
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
                    <td>{schedule.date}</td>
                    <td>{schedule.startTime}</td>
                    <td>{schedule.routeName}</td>
                    <td>{schedule.driverName}</td>
                    <td>{schedule.licensePlate}</td>
                    <td>{schedule.stopCount}</td>
                    <td>{schedule.studentCount}</td>
                    <td>
                      <span 
                        className="schedule-manager-status-badge"
                        style={{ backgroundColor: statusColor[schedule.status] || '#6c757d' }}
                      >
                        {schedule.status || 'Không xác định'}
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