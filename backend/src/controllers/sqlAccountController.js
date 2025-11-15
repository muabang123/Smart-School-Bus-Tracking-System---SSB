import { sqlPool } from '../config/sql.js'

export const getParents = async (_req, res) => {
  try {
    const [rows] = await sqlPool.query(
      `SELECT MaPhuHuynh AS id, HoTen AS name, SoDienThoai AS phone FROM phuhuynh ORDER BY MaPhuHuynh ASC`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getDrivers = async (_req, res) => {
  try {
    const [rows] = await sqlPool.query(
      `SELECT Id AS id, FullName AS name, PhoneNumber AS phone, MaBangLai AS license FROM drivers ORDER BY Id ASC`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}