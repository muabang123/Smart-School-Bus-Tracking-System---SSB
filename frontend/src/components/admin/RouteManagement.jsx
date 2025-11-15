import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom"; // 1. Bỏ import 'Link'
import "./RouteManagement.css";
import RouteModal from "./RouteModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import RouteViewModal from "./RouteViewModal"; // 2. Thêm import cho modal mới

const initialRoutes = [];

function RouteManagement() {
   const [routes, setRoutes] = useState(initialRoutes);
   const [searchTerm, setSearchTerm] = useState("");
   const [filterKey, setFilterKey] = useState("name");

   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [editingRoute, setEditingRoute] = useState(null); 
   const [selectedRouteId, setSelectedRouteId] = useState(null); 

  // 3. State mới để quản lý modal xem chi tiết
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingRoute, setViewingRoute] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/sql/routes/details')
        const rows = await res.json()
        setRoutes(Array.isArray(rows) ? rows : [])
      } catch (e) {
        setRoutes([])
      }
    }
    fetchRoutes()
  }, [])

   const filteredRoutes = routes.filter((route) => {
     if (filterKey === "stops") {
        const valueString = String(route.stops.length).toLowerCase();
        const searchTermLower = searchTerm.toLowerCase();
        return valueString.includes(searchTermLower);
     }

     const routeValue = route[filterKey];
     const valueString = String(routeValue).toLowerCase();
     const searchTermLower = searchTerm.toLowerCase();
     return valueString.includes(searchTermLower);
   });

   const routeCount = filteredRoutes.length;
  
  // 4. Hàm mới để mở modal xem chi tiết
  const handleOpenViewModal = (route) => {
    setViewingRoute(route);
    setIsViewModalOpen(true);
  };

   const handleOpenAddModal = () => {
     setEditingRoute(null); 
     setIsModalOpen(true);
   };

   const handleOpenEditModal = () => {
     if (!selectedRouteId) {
        alert("Vui lòng chọn một tuyến để sửa.");
        return;
     }
     const routeToEdit = routes.find((r) => r.id === selectedRouteId);
     setEditingRoute(routeToEdit); 
     setIsModalOpen(true);
   };

   const handleOpenDeleteModal = () => {
     if (!selectedRouteId) {
        alert("Vui lòng chọn một tuyến để xóa.");
        return;
     }
     setIsDeleteModalOpen(true);
   };

   const handleSaveRoute = (routeData, routeId) => {
     if (routeId) {
        setRoutes(
          routes.map((route) =>
             route.id === routeId
               ? { ...route, ...routeData, id: routeId }
               : route
          )
        );
     } else {
        const lastIdNum =
          routes.length > 0
             ? parseInt(routes[routes.length - 1].id.replace("T", ""), 10)
             : 0;
        const newIdNum = lastIdNum + 1;
        const newId = `T${String(newIdNum).padStart(3, "0")}`;

        const finalNewRoute = {
          ...routeData,
          id: newId,
        };
        setRoutes([...routes, finalNewRoute]);
     }
     setIsModalOpen(false);
     setEditingRoute(null);
   };

   const handleDeleteRoute = () => {
     if (!selectedRouteId) return;
     setRoutes(routes.filter((route) => route.id !== selectedRouteId));
     setSelectedRouteId(null); 
     setIsDeleteModalOpen(false); 
   };

   return (
     <div className="rt-mgnt-container">
        <header className="rt-mgnt-header">
          <h1>Quản lý tuyến đường</h1>
          <span className="rt-mgnt-admin-status">ADMIN ONLINE : 1</span>
        </header>

        <section className="rt-mgnt-info-section">
          <hr className="rt-mgnt-divider" />
          <div className="rt-mgnt-info-card">
             <h4>Tổng số tuyến</h4>
             <div className="rt-mgnt-info-count-box">{routeCount}</div>
          </div>
          <hr className="rt-mgnt-divider" />
        </section>

        <main className="rt-mgnt-table-section">
          <div className="rt-mgnt-table-controls">
             <h2>Danh sách tuyến đường</h2>
             <div className="rt-mgnt-search-filter">
               <div className="rt-mgnt-search-wrapper">
                  <span className="rt-mgnt-search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <select
                  className="rt-mgnt-filter-dropdown"
                  value={filterKey}
                  onChange={(e) => setFilterKey(e.target.value)}
               >
                  <option value="id">Search by: Mã tuyến</option>
                  <option value="name">Search by: Tên tuyến</option>
                  <option value="bus">Search by: Biển số xe</option>
                  <option value="driver">Search by: Tài xế</option>
                  <option value="stops">Search by: Số điểm dừng</option>
               </select>
             </div>
          </div>

          <div className="rt-mgnt-table-wrapper">
             <table className="rt-mgnt-table">
               <thead>
                  <tr>
                    <th>Mã tuyến</th>
                    <th>Tên tuyến</th>
                    <th>Biển số xe</th>
                    <th>Tài xế</th>
                    <th>Số điểm dừng</th>
                    <th></th>
                  </tr>
               </thead>
               <tbody>
                  {filteredRoutes.map((route) => (
                    <tr
                       key={route.id}
                       onClick={() => setSelectedRouteId(route.id)}
                       className={
                         route.id === selectedRouteId ? "rt-mgnt-selected-row" : ""
                       }
                    >
                       <td>{route.id}</td>
                       <td>{route.name}</td>
                       <td>{route.bus}</td>
                       <td>{route.driver}</td>
                       <td>{route.stops.length}</td>
                       <td>
                    {/* 5. Thay thế Link bằng button */}
                         <button
                            className="rt-mgnt-btn-view" 
                            onClick={(e) => {
                          e.stopPropagation(); // Ngăn click vào hàng
                          handleOpenViewModal(route);
                        }} 
                         >
                            Xem
                         </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>
        </main>
        <footer className="rt-mgnt-action-buttons">
          <button
             className="rt-mgnt-btn rt-mgnt-btn-add"
             onClick={handleOpenAddModal}
          >
             Thêm
          </button>
          <button
             className="rt-mgnt-btn rt-mgnt-btn-edit"
             onClick={handleOpenEditModal}
          >
             Sửa
          </button>
          <button
             className="rt-mgnt-btn rt-mgnt-btn-delete"
             onClick={handleOpenDeleteModal}
          >
             Xóa
          </button>
        </footer>

        <RouteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveRoute}
          editingRoute={editingRoute} 
        />

        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteRoute}
        />

      {/* 6. Render modal xem chi tiết */}
      <RouteViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        route={viewingRoute}
      />
     </div>
   );
}

export default RouteManagement;