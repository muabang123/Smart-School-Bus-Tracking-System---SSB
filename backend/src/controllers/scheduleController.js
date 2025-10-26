import Schedule from "../models/Schedule.js";

//  Tạo lịch trình mới (POST /api/schedules)
export const createSchedule = async (req, res) => {
  try {
    const newSchedule = new Schedule(req.body);
    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Lấy tất cả lịch trình (GET /api/schedules)
export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate("route")
      .populate("bus");
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Lấy lịch trình theo ID (GET /api/schedules/:id)
export const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate("route")
      .populate("bus");

    if (!schedule) {
      return res.status(404).json({ message: "Không tìm thấy lịch trình" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Cập nhật lịch trình (PUT /api/schedules/:id)
export const updateSchedule = async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({ message: "Không tìm thấy lịch trình" });
    }
    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Xóa lịch trình (DELETE /api/schedules/:id)
export const deleteSchedule = async (req, res) => {
  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!deletedSchedule) {
      return res.status(404).json({ message: "Không tìm thấy lịch trình" });
    }
    res.status(200).json({ message: "Xóa lịch trình thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
