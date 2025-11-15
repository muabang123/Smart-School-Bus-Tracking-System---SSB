import { sqlPool } from '../config/sql.js'

export const getSummary = async (_req, res) => {
  try {
    const [[drivers]] = await sqlPool.query('SELECT COUNT(*) AS count FROM drivers')
    const [[parents]] = await sqlPool.query('SELECT COUNT(*) AS count FROM phuhuynh')
    const [[routes]] = await sqlPool.query('SELECT COUNT(*) AS count FROM routes')
    const [[vehicles]] = await sqlPool.query('SELECT COUNT(*) AS count FROM vehicles')
    const [[students]] = await sqlPool.query('SELECT COUNT(*) AS count FROM hocsinh')
    res.json({ drivers: drivers.count, parents: parents.count, routes: routes.count, vehicles: vehicles.count, students: students.count })
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