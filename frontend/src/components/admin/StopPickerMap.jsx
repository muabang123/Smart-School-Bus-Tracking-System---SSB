import React, { useState } from "react";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Đặt API Key của bạn vào đây

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = {
  width: "100%",

  height: "400px",

  borderRadius: "10px",
};

const center = {
  lat: 10.7769,

  lng: 106.7009,
};

function StopPickerMap({ onChange }) {
  const [stops, setStops] = useState([]);

  // Hàm này được gọi khi click lên bản đồ

  const onMapClick = (event) => {
    const newStop = {
      lat: event.latLng.lat(),

      lng: event.latLng.lng(),
    };

    const updatedStops = [...stops, newStop];

    setStops(updatedStops);

    onChange(updatedStops);
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        onClick={onMapClick}
      >
        {/* Render tất cả các điểm dừng đã chọn */}

        {stops.map((stop, index) => (
          <Marker
            key={index}
            position={{ lat: stop.lat, lng: stop.lng }}
            label={(index + 1).toString()} // Đánh số cho điểm dừng
          />
        ))}
      </GoogleMap>

      <p>Click lên bản đồ để thêm điểm dừng.</p>
    </LoadScript>
  );
}

export default StopPickerMap;
