import { sqlPool } from '../config/sql.js'

export const getTodayByDriver = async (req, res) => {
  try {
    const { driverId } = req.query
    if (!driverId) return res.status(400).json({ message: 'Thiếu driverId' })

    const [rows] = await sqlPool.query(
      `SELECT s.Id AS scheduleId,
              DATE(s.Date) AS date,
              s.StartTime AS startTime,
              s.EndTime AS endTime,
              s.Status AS status,
              s.Notes AS notes,
              s.RouteId AS routeId,
              s.DriverId AS driverId,
              s.VehicleId AS vehicleId,
              r.Name AS routeName,
              v.LicensePlate AS licensePlate,
              (SELECT COUNT(*) FROM schedule_assignments sa WHERE sa.ScheduleId = s.Id) AS studentCount,
              (SELECT GROUP_CONCAT(p.PointName SEPARATOR ', ') FROM pickuppoints p WHERE p.RouteId = s.RouteId) AS pickupPoints
       FROM schedules s
       LEFT JOIN routes r ON r.Id = s.RouteId
       LEFT JOIN vehicles v ON v.Id = s.VehicleId
       WHERE s.DriverId = ? AND DATE(s.Date) = CURDATE()
       ORDER BY s.StartTime ASC`,
      [driverId]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getUpcomingByDriver = async (req, res) => {
  try {
    const { driverId, days } = req.query
    if (!driverId) return res.status(400).json({ message: 'Thiếu driverId' })
    const rangeDays = Number(days || 14)

    const [rows] = await sqlPool.query(
      `SELECT s.Id AS scheduleId,
              DATE(s.Date) AS date,
              s.StartTime AS startTime,
              s.EndTime AS endTime,
              s.Status AS status,
              s.Notes AS notes,
              s.RouteId AS routeId,
              s.DriverId AS driverId,
              s.VehicleId AS vehicleId,
              r.Name AS routeName,
              v.LicensePlate AS licensePlate,
              (SELECT GROUP_CONCAT(p.PointName SEPARATOR ', ') FROM pickuppoints p WHERE p.RouteId = s.RouteId) AS pickupPoints,
              s.CreatedBy AS createdBy
       FROM schedules s
       LEFT JOIN routes r ON r.Id = s.RouteId
       LEFT JOIN vehicles v ON v.Id = s.VehicleId
       WHERE s.DriverId = ? AND DATE(s.Date) > CURDATE() AND DATE(s.Date) <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
       ORDER BY s.Date ASC, s.StartTime ASC`,
      [driverId, rangeDays]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getAllSchedules = async (req, res) => {
  try {
    const [rows] = await sqlPool.query(
      `SELECT s.id AS id,
              DATE(s.date) AS date,
              s.start_time AS startTime,
              s.status AS status,
              s.route_id AS routeId,
              s.driver_id AS driverId
       FROM schedules s
       ORDER BY s.date DESC, s.start_time DESC`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getTables = async (req, res) => {
  try {
    const [rows] = await sqlPool.query(
      `SELECT table_name AS name FROM information_schema.tables WHERE table_schema = DATABASE()`
    )
    res.json(rows.map(r => r.name))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getSample = async (req, res) => {
  try {
    const { table } = req.query
    if (!table) return res.status(400).json({ message: 'Thiếu tên bảng' })
    const [rows] = await sqlPool.query(`SELECT * FROM \`${table}\` LIMIT 5`)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getRoutesByDriver = async (req, res) => {
  try {
    const { driverId } = req.query
    if (!driverId) return res.status(400).json({ message: 'Thiếu driverId' })
    const [rows] = await sqlPool.query(
      `SELECT r.Id AS id,
              r.MaTuyen AS code,
              r.Name AS name,
              r.DriverId AS driverId,
              r.VehicleId AS vehicleId,
              r.Status AS status
       FROM routes r
       WHERE r.DriverId = ?
       ORDER BY r.Id ASC`,
      [driverId]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getAllRoutes = async (_req, res) => {
  try {
    const [rows] = await sqlPool.query(
      `SELECT r.Id AS id,
              r.MaTuyen AS code,
              r.Name AS name,
              r.DriverId AS driverId,
              r.VehicleId AS vehicleId,
              r.Status AS status
       FROM routes r
       ORDER BY r.Id ASC`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}