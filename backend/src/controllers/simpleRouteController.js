// Dữ liệu mẫu routes
let routes = [
  { id: 1, routeName: "Tuyến 1", startPoint: "Trường THPT ABC", endPoint: "Khu vực A" },
  { id: 2, routeName: "Tuyến 2", startPoint: "Trường THPT XYZ", endPoint: "Khu vực B" }
];

export const getAllRoutes = (req, res) => res.json(routes);

export const getRouteById = (req, res) => {
  const route = routes.find(r => r.id == req.params.id);
  if (!route) return res.status(404).json({ message: "Không tìm thấy tuyến đường" });
  res.json(route);
};

export const createRoute = (req, res) => {
  const { routeName, startPoint, endPoint } = req.body;
  const newRoute = {
    id: routes.length ? Math.max(...routes.map(r=>r.id))+1 : 1,
    routeName, startPoint, endPoint
  };
  routes.push(newRoute);
  res.status(201).json(newRoute);
};

export const updateRoute = (req, res) => {
  const routeIndex = routes.findIndex(r => r.id == req.params.id);
  if (routeIndex === -1) return res.status(404).json({ message: "Không tìm thấy tuyến đường" });
  const { routeName, startPoint, endPoint } = req.body;
  routes[routeIndex] = { ...routes[routeIndex], routeName, startPoint, endPoint };
  res.json(routes[routeIndex]);
};

export const deleteRoute = (req, res) => {
  const routeIndex = routes.findIndex(r => r.id == req.params.id);
  if (routeIndex === -1) return res.status(404).json({ message: "Không tìm thấy tuyến đường" });
  const deletedRoute = routes.splice(routeIndex, 1)[0];
  res.json(deletedRoute);
};
