
export const getAllBuses = (req, res) => {
  res.json({ message: "Danh sách tất cả các xe buýt" });
};

export const createBus = (req, res) => {
  res.json({ message: "Tạo mới xe buýt" });
};

export const updateBus = (req, res) => {
  res.json({ message: `Cập nhật xe buýt có id: ${req.params.id}` });
};

export const deleteBus = (req, res) => {
  res.json({ message: `Xóa xe buýt có id: ${req.params.id}` });
};
