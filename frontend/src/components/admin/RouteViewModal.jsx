import React from "react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_CENTER_DEFAULT = "10.7769,106.7009"; 

/**
 * Hàm này tạo URL cho Google Static Map API
 * @param {Array} stops - 
 * @returns {string} 
 */
function generateStaticMapUrl(stops) {
  const baseUrl = "https://maps.googleapis.com/maps/api/staticmap?";

  if (!GOOGLE_MAPS_API_KEY) {
    return `https://placehold.co/640x480/e9e9e9/333?text=API+Key+Not+Found`;
  }

  if (!stops || stops.length === 0) {
    return `${baseUrl}center=${MAP_CENTER_DEFAULT}&zoom=12&size=640x480&key=${GOOGLE_MAPS_API_KEY}`;
  }

  const markers = stops
    .map(
      (stop, index) =>
        `markers=color:red|label:${index + 1}|${stop.lat},${stop.lng}`
    )
    .join("&");

  let path = "";
  if (stops.length > 1) {
    const pathPoints = stops.map((stop) => `${stop.lat},${stop.lng}`).join("|");
    path = `&path=color:0x0000ff|weight:4|${pathPoints}`;
  }

  // Kết hợp tất cả lại để tạo URL cuối cùng
  return `${baseUrl}size=640x480&${markers}${path}&key=${GOOGLE_MAPS_API_KEY}`;
}

function RouteViewModal({ isOpen, onClose, route }) {
  if (!isOpen || !route) return null;

  const mapUrl = generateStaticMapUrl(route.stops);

  return (
    <>
      <style>{`
        .rt-view-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
        }
        .rt-view-modal-content {
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          position: relative;
          width: 80vw;
          height: 80vh;
          max-width: 1000px;
          max-height: 700px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .rt-view-modal-close-btn {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          font-size: 2.5rem;
          color: #333;
          cursor: pointer;
          line-height: 1;
          z-index: 1060;
        }
        .rt-view-modal-close-btn:hover {
          color: #ff0000;
        }
        .rt-view-modal-info-panel {
          position: absolute;
          top: 20px;
          left: 20px;
          background-color: rgba(255, 255, 255, 0.9);
          padding: 15px 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          z-index: 1055;
          max-width: 300px;
        }
        .rt-view-modal-info-panel h2 {
          margin-top: 0;
          margin-bottom: 12px;
          color: #0056b3;
          font-size: 1.4rem;
        }
        .rt-view-modal-info-panel p {
          margin: 6px 0;
          font-size: 0.95rem;
          color: #333;
        }
        .rt-view-modal-info-panel strong {
          color: #000;
        }
        .rt-view-modal-map-container {
          width: 100%;
          height: 100%;
          background-color: #e9e9e9;
        }
        .rt-view-modal-map-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>

      <div className="rt-view-modal-backdrop" onClick={onClose}>
        <div className="rt-view-modal-content" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="rt-view-modal-close-btn">
            &times;
          </button>

          <div className="rt-view-modal-info-panel">
            <h2>{route.name}</h2>
            <p>
              <strong>Mã tuyến:</strong> {route.id}
            </p>
            <p>
              <strong>Tài xế:</strong> {route.driver}
            </p>
            <p>
              <strong>Biển số xe:</strong> {route.bus}
            </p>
            <p>
              <strong>Số điểm dừng:</strong> {route.stops.length}
            </p>
          </div>

          <div className="rt-view-modal-map-container">
            <img src={mapUrl} alt={`Bản đồ tuyến ${route.name}`} />
          </div>
        </div>
      </div>
    </>
  );
}

export default RouteViewModal;

