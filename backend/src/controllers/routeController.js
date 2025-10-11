// Dữ liệu mẫu cho routes
let routes = [
  { id: 1, routeName: "Tuyến 1", startPoint: "Trường THPT ABC", endPoint: "Khu vực A" },
  { id: 2, routeName: "Tuyến 2", startPoint: "Trường THPT XYZ", endPoint: "Khu vực B" }
];

// GET /api/routes - Lấy tất cả tuyến đường
export const getAllRoutes = (req, res) => {
  res.json(routes);
};

// GET /api/routes/:id - Lấy tuyến đường theo ID
export const getRouteById = (req, res) => {
  const route = routes.find(r => r.id == req.params.id);
  if (!route) {
    return res.status(404).json({ message: "Không tìm thấy tuyến đường" });
  }
  res.json(route);
};

// POST /api/routes - Tạo tuyến đường mới
export const createRoute = (req, res) => {
  const { routeName, startPoint, endPoint } = req.body;
  const newRoute = {
    id: routes.length + 1,
    routeName,
    startPoint,
    endPoint
  };
  routes.push(newRoute);
  res.status(201).json(newRoute);
};

// PUT /api/routes/:id - Cập nhật tuyến đường
export const updateRoute = (req, res) => {
  const routeIndex = routes.findIndex(r => r.id == req.params.id);
  if (routeIndex === -1) {
    return res.status(404).json({ message: "Không tìm thấy tuyến đường" });
  }
  
  const { routeName, startPoint, endPoint } = req.body;
  routes[routeIndex] = { ...routes[routeIndex], routeName, startPoint, endPoint };
  res.json(routes[routeIndex]);
};

// DELETE /api/routes/:id - Xóa tuyến đường
export const deleteRoute = (req, res) => {
  const routeIndex = routes.findIndex(r => r.id == req.params.id);
  if (routeIndex === -1) {
    return res.status(404).json({ message: "Không tìm thấy tuyến đường" });
  }
  
  const deletedRoute = routes.splice(routeIndex, 1)[0];
  res.json(deletedRoute);
};

// GET /api/routes/:id/buses - Lấy danh sách xe buýt theo tuyến đường
export const getBusesByRoute = (req, res) => {
  const route = routes.find(r => r.id == req.params.id);
  if (!route) {
    return res.status(404).json({ message: "Không tìm thấy tuyến đường" });
  }
  
  // Import buses từ busController để lấy dữ liệu
  const { buses } = require('./busController.js');
  const routeBuses = buses.filter(b => b.route === route.routeName);
  res.json(routeBuses);
};
