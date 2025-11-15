import { sqlPool } from '../config/sql.js'

export const getVehiclesWithRoute = async (_req, res) => {
  try {
    const [rows] = await sqlPool.query(
      `SELECT v.Id AS id,
              v.LicensePlate AS licensePlate,
              v.Model AS model,
              v.SpeedKmh AS speed,
              GROUP_CONCAT(r.Name SEPARATOR ', ') AS routes
       FROM vehicles v
       LEFT JOIN routes r ON r.VehicleId = v.Id
       GROUP BY v.Id, v.LicensePlate, v.Model, v.SpeedKmh
       ORDER BY v.Id ASC`
    )
    res.json(rows.map(r => ({
      id: r.id,
      licensePlate: r.licensePlate,
      route: r.routes || 'Chưa xếp tuyến',
      seats: (() => { const m = (r.model || '').match(/(\d+)\s*chỗ/i); return m ? parseInt(m[1],10) : null })(),
      speed: r.speed
    })))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getStudents = async (_req, res) => {
  try {
    const [rows] = await sqlPool.query(
      `SELECT s.MaHocSinh AS id,
              s.HoTen AS name,
              s.Lop AS class,
              s.TinhTrang AS status,
              p.PointName AS pickupPoint,
              r.Name AS routeName,
              v.LicensePlate AS licensePlate
       FROM hocsinh s
       LEFT JOIN pickuppoints p ON p.Id = s.MaDiemDon
       LEFT JOIN routes r ON r.Id = p.RouteId
       LEFT JOIN vehicles v ON v.Id = r.VehicleId
       ORDER BY s.MaHocSinh ASC`
    )
    res.json(rows.map(r => ({
      id: r.id,
      name: r.name,
      class: r.class,
      route: r.routeName || '',
      pickupPoint: r.pickupPoint || '',
      licensePlate: r.licensePlate || '',
      status: r.status || ''
    })))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getRoutesDetails = async (_req, res) => {
  try {
    const [rows] = await sqlPool.query(
      `SELECT r.Id AS id,
              r.MaTuyen AS code,
              r.Name AS name,
              d.FullName AS driverName,
              v.LicensePlate AS licensePlate,
              (SELECT COUNT(*) FROM pickuppoints p WHERE p.RouteId = r.Id) AS stopCount
       FROM routes r
       LEFT JOIN drivers d ON d.Id = r.DriverId
       LEFT JOIN vehicles v ON v.Id = r.VehicleId
       ORDER BY r.Id ASC`
    )
    res.json(rows.map(r => ({
      id: r.code || `T${r.id}`,
      name: r.name,
      bus: r.licensePlate || '',
      driver: r.driverName || '',
      stops: Array.from({ length: r.stopCount || 0 }, () => ({ lat: 0, lng: 0 }))
    })))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}