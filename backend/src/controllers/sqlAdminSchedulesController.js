import { sqlPool } from '../config/sql.js'

export const listSchedules = async (_req, res) => {
  try {
    const [rows] = await sqlPool.query(
      `SELECT s.Id AS id,
              DATE(s.Date) AS date,
              s.StartTime AS startTime,
              s.EndTime AS endTime,
              s.Status AS status,
              s.Notes AS notes,
              s.RouteId AS routeId,
              s.DriverId AS driverId,
              s.VehicleId AS vehicleId,
              r.Name AS routeName,
              d.FullName AS driverName,
              v.LicensePlate AS licensePlate,
              (SELECT COUNT(*) FROM pickuppoints p WHERE p.RouteId = s.RouteId) AS stopCount,
              (SELECT COUNT(*) FROM schedule_assignments sa WHERE sa.ScheduleId = s.Id) AS studentCount
       FROM schedules s
       LEFT JOIN routes r ON r.Id = s.RouteId
       LEFT JOIN drivers d ON d.Id = s.DriverId
       LEFT JOIN vehicles v ON v.Id = s.VehicleId
       ORDER BY s.Date DESC, s.StartTime DESC`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const createSchedule = async (req, res) => {
  try {
    const { Date: date, StartTime: startTime, EndTime: endTime, RouteId: routeId, DriverId: driverId, VehicleId: vehicleId, Status: status, Notes: notes, CreatedBy: createdBy } = req.body
    const [result] = await sqlPool.query(
      `INSERT INTO schedules (Date, StartTime, EndTime, RouteId, DriverId, VehicleId, Status, Notes, CreatedBy, CreatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [date, startTime, endTime, routeId, driverId, vehicleId, status || 'Sắp diễn ra', notes || '', createdBy || 'admin']
    )
    const scheduleId = result.insertId
    await sqlPool.query(
      `INSERT INTO schedule_changes (ScheduleId, ChangedBy, ChangedAt, ChangeSummary)
       VALUES (?, ?, NOW(), ?)`,
      [scheduleId, createdBy || 'admin', 'Tạo lịch trình mới']
    )
    res.status(201).json({ id: scheduleId })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params
    const { Date: date, StartTime: startTime, EndTime: endTime, RouteId: routeId, DriverId: driverId, VehicleId: vehicleId, Status: status, Notes: notes, ChangedBy: changedBy } = req.body
    await sqlPool.query(
      `UPDATE schedules SET Date = ?, StartTime = ?, EndTime = ?, RouteId = ?, DriverId = ?, VehicleId = ?, Status = ?, Notes = ?, UpdatedAt = NOW() WHERE Id = ?`,
      [date, startTime, endTime, routeId, driverId, vehicleId, status, notes || '', id]
    )
    await sqlPool.query(
      `INSERT INTO schedule_changes (ScheduleId, ChangedBy, ChangedAt, ChangeSummary)
       VALUES (?, ?, NOW(), ?)`,
      [id, changedBy || 'admin', 'Cập nhật lịch trình']
    )
    res.json({ id })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params
    await sqlPool.query(`DELETE FROM schedules WHERE Id = ?`, [id])
    await sqlPool.query(
      `INSERT INTO schedule_changes (ScheduleId, ChangedBy, ChangedAt, ChangeSummary)
       VALUES (?, ?, NOW(), ?)`,
      [id, 'admin', 'Xóa lịch trình']
    )
    res.json({ id })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const listAssignments = async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await sqlPool.query(
      `SELECT sa.Id AS id,
              sa.Status AS status,
              sa.PickupTime AS pickupTime,
              sa.DropoffTime AS dropoffTime,
              hs.MaHocSinh AS studentId,
              hs.HoTen AS studentName
       FROM schedule_assignments sa
       LEFT JOIN hocsinh hs ON hs.MaHocSinh = sa.StudentId
       WHERE sa.ScheduleId = ?
       ORDER BY sa.Id ASC`,
      [id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const addAssignment = async (req, res) => {
  try {
    const { id } = req.params
    const { StudentId, Status, PickupTime, DropoffTime } = req.body
    const [result] = await sqlPool.query(
      `INSERT INTO schedule_assignments (ScheduleId, StudentId, Status, PickupTime, DropoffTime)
       VALUES (?, ?, ?, ?, ?)`,
      [id, StudentId, Status || 'Đang chờ', PickupTime || null, DropoffTime || null]
    )
    await sqlPool.query(
      `INSERT INTO schedule_changes (ScheduleId, ChangedBy, ChangedAt, ChangeSummary)
       VALUES (?, ?, NOW(), ?)`,
      [id, 'admin', `Thêm học sinh ${StudentId} vào lịch trình`]
    )
    res.status(201).json({ id: result.insertId })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const removeAssignment = async (req, res) => {
  try {
    const { id, assignmentId } = req.params
    await sqlPool.query(`DELETE FROM schedule_assignments WHERE Id = ? AND ScheduleId = ?`, [assignmentId, id])
    await sqlPool.query(
      `INSERT INTO schedule_changes (ScheduleId, ChangedBy, ChangedAt, ChangeSummary)
       VALUES (?, ?, NOW(), ?)`,
      [id, 'admin', `Xóa phân công học sinh ${assignmentId}`]
    )
    res.json({ id: assignmentId })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}