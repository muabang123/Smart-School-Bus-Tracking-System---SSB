// Dữ liệu mẫu cho buses (in-memory)
let buses = [
  { id: 1, busNumber: "BUS001", driverName: "Nguyễn Văn A", route: "Tuyến 1" },
  { id: 2, busNumber: "BUS002", driverName: "Trần Thị B", route: "Tuyến 2" }
];

export const getAllBuses = (req, res) => res.json(buses);

export const getBusById = (req, res) => {
  const bus = buses.find(b => b.id == req.params.id);
  if (!bus) return res.status(404).json({ message: "Không tìm thấy xe buýt" });
  res.json(bus);
};

export const createBus = (req, res) => {
  const { busNumber, driverName, route } = req.body;
  const newBus = {
    id: buses.length ? Math.max(...buses.map(b=>b.id))+1 : 1,
    busNumber,
    driverName,
    route
  };
  buses.push(newBus);
  res.status(201).json(newBus);
};

export const updateBus = (req, res) => {
  const busIndex = buses.findIndex(b => b.id == req.params.id);
  if (busIndex === -1) return res.status(404).json({ message: "Không tìm thấy xe buýt" });
  const { busNumber, driverName, route } = req.body;
  buses[busIndex] = { ...buses[busIndex], busNumber, driverName, route };
  res.json(buses[busIndex]);
};

export const deleteBus = (req, res) => {
  const busIndex = buses.findIndex(b => b.id == req.params.id);
  if (busIndex === -1) return res.status(404).json({ message: "Không tìm thấy xe buýt" });
  const deletedBus = buses.splice(busIndex, 1)[0];
  res.json(deletedBus);
};
