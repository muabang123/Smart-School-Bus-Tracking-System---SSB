import { sqlPool } from '../config/sql.js'

export const getSummary = async (_req, res) => {
  try {
    const [[drivers]] = await sqlPool.query('SELECT COUNT(*) AS count FROM drivers')
    const [[parents]] = await sqlPool.query('SELECT COUNT(*) AS count FROM phuhuynh')
    const [[routes]] = await sqlPool.query('SELECT COUNT(*) AS count FROM routes')
    const [[vehicles]] = await sqlPool.query('SELECT COUNT(*) AS count FROM vehicles')
    const [[students]] = await sqlPool.query('SELECT COUNT(*) AS count FROM hocsinh')
    const [[schedulesToday]] = await sqlPool.query('SELECT COUNT(*) AS count FROM schedules WHERE DATE(date) = CURDATE()')
    res.json({ drivers: drivers.count, parents: parents.count, routes: routes.count, vehicles: vehicles.count, students: students.count, schedulesToday: schedulesToday.count })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getUsers = async (_req, res) => {
  try {
    const [driverRows] = await sqlPool.query('SELECT FullName AS name, PhoneNumber AS phone FROM drivers')
    const [parentRows] = await sqlPool.query('SELECT HoTen AS name, SoDienThoai AS phone FROM phuhuynh')
    const users = [
      ...driverRows.map(r => ({ name: r.name, role: 'Tài xế', phone: r.phone })),
      ...parentRows.map(r => ({ name: r.name, role: 'Phụ huynh', phone: r.phone }))
    ]
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getTodaySchedulesSummary = async (_req, res) => {
  try {
    const [rows] = await sqlPool.query(
      `SELECT s.id AS scheduleId,
              r.Name AS routeName,
              d.FullName AS driverName,
              v.LicensePlate AS licensePlate,
              s.start_time AS startTime,
              COALESCE((
                SELECT COUNT(DISTINCT hs.MaHocSinh)
                FROM pickuppoints p
                LEFT JOIN hocsinh hs ON hs.MaDiemDon = p.Id
                WHERE p.RouteId = r.Id
              ), 0) AS studentCount,
              ADDTIME(s.start_time, '00:45:00') AS eta
       FROM schedules s
       JOIN routes r ON r.Id = s.route_id
       LEFT JOIN drivers d ON d.Id = r.DriverId
       LEFT JOIN vehicles v ON v.Id = r.VehicleId
       WHERE DATE(s.date) = CURDATE()
       ORDER BY s.start_time ASC`
    )
    res.json(rows.map(r => ({
      id: r.scheduleId,
      routeName: r.routeName || '',
      driverName: r.driverName || '',
      licensePlate: r.licensePlate || '',
      startTime: r.startTime,
      studentCount: r.studentCount || 0,
      eta: r.eta
    })))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}