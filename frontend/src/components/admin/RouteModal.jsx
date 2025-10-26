import React, { useState, useEffect } from "react"; 

import StopPickerMap from "./StopPickerMap";

import "./RouteModal.css";

// 1. Modal giờ nhận thêm prop 'editingRoute'

function RouteModal({ isOpen, onClose, onSave, editingRoute }) {
  const [routeName, setRouteName] = useState("");

  const [busPlate, setBusPlate] = useState("");

  const [driver, setDriver] = useState("");

  const [stops, setStops] = useState([]);


  useEffect(() => {
    if (isOpen) {

      if (editingRoute) {


        setRouteName(editingRoute.name);

        setBusPlate(editingRoute.bus);

        setDriver(editingRoute.driver);

        setStops(editingRoute.stops); 
      } else {


        setRouteName("");

        setBusPlate("");

        setDriver("");

        setStops([]);
      }
    }
  }, [editingRoute, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const newRouteData = {
      name: routeName,

      bus: busPlate,

      driver: driver,

      stops: stops, 
    };


    onSave(newRouteData, editingRoute ? editingRoute.id : null);

  };

  const handleStopsChange = (newStops) => {
    setStops(newStops);
  };

  return (
    <div className="rt-mgnt-modal-backdrop">
      <div className="rt-mgnt-modal-content">


        <h2>{editingRoute ? "Sửa tuyến đường" : "Thêm tuyến đường mới"}</h2>

        <div className="rt-mgnt-form-group">
          <label>Tên tuyến:</label>

          <input
            type="text"
            placeholder="Ví dụ: Tuyến Đại học Bách Khoa"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
          />
        </div>

        <div className="rt-mgnt-form-group">
          <label>Biển số xe:</label>

          <input
            type="text"
            placeholder="Ví dụ: 51F-123.45"
            value={busPlate}
            onChange={(e) => setBusPlate(e.target.value)}
          />
        </div>

        <div className="rt-mgnt-form-group">
          <label>Tài xế:</label>

          <input
            type="text"
            placeholder="Ví dụ: Nguyễn Văn A"
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
          />
        </div>

        <div className="rt-mgnt-form-group">


          <label>Các điểm dừng (Số điểm dừng: {stops.length})</label>

          <StopPickerMap onChange={handleStopsChange} />

          {/* Lưu ý: Vì API Map hỏng, bạn sẽ phải pick lại điểm dừng mỗi khi Sửa.

            Nếu bạn muốn giữ lại điểm dừng cũ, bạn cần sửa StopPickerMap

            để nhận 'initialStops' và hiển thị chúng, điều này phức tạp hơn.

          */}
        </div>

        <div className="rt-mgnt-modal-actions">
          <button onClick={onClose} className="rt-mgnt-btn-cancel">
            Hủy
          </button>

          <button onClick={handleSave} className="rt-mgnt-btn-save">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

export default RouteModal;
