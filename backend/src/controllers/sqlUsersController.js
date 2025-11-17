import { sqlPool } from '../config/sql.js'

export const listUsers = async (_req, res) => {
  try {
    const [rows] = await sqlPool.query(
      `SELECT Id AS id,
              FullName AS fullName,
              Email AS email,
              AvatarUrl AS avatarUrl,
              Status AS status,
              PhoneNumber AS phoneNumber,
              CreatedAt AS createdAt
       FROM users
       ORDER BY CreatedAt DESC`
    )
    res.json(rows.map(r => ({
      id: r.id,
      fullName: r.fullName,
      email: r.email,
      avatarUrl: r.avatarUrl || '',
      status: r.status || 'Active',
      phoneNumber: r.phoneNumber || '',
      createdAt: r.createdAt
    })))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const createUser = async (req, res) => {
  try {
    const { fullName, email, avatarUrl, status, phoneNumber } = req.body
    const [result] = await sqlPool.query(
      `INSERT INTO users (FullName, Email, AvatarUrl, Status, PhoneNumber, CreatedAt)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [fullName, email, avatarUrl || '', status || 'Active', phoneNumber || '']
    )
    res.status(201).json({ id: result.insertId })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { fullName, email, avatarUrl, status, phoneNumber } = req.body
    await sqlPool.query(
      `UPDATE users SET FullName = ?, Email = ?, AvatarUrl = ?, Status = ?, PhoneNumber = ?, UpdatedAt = NOW() WHERE Id = ?`,
      [fullName, email, avatarUrl || '', status || 'Active', phoneNumber || '', id]
    )
    res.json({ id })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    await sqlPool.query(`DELETE FROM users WHERE Id = ?`, [id])
    res.json({ id })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    await sqlPool.query(`UPDATE users SET Status = ?, UpdatedAt = NOW() WHERE Id = ?`, [status, id])
    res.json({ id, status })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}