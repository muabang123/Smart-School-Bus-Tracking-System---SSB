import { sqlPool } from '../config/sql.js'
import crypto from 'crypto'

const ensureColumn = async (table) => {
  const [rows] = await sqlPool.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = 'PasswordHash'`, [table])
  if (rows.length === 0) {
    await sqlPool.query(`ALTER TABLE \`${table}\` ADD COLUMN PasswordHash VARCHAR(255) NULL`)
  }
}

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('base64')
  const derived = crypto.scryptSync(password, salt, 32).toString('base64')
  return `${salt}$${derived}`
}

const verifyPassword = (password, stored) => {
  if (!stored) return false
  const [salt, hash] = String(stored).split('$')
  if (!salt || !hash) return false
  const derived = crypto.scryptSync(password, salt, 32).toString('base64')
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(derived))
}

export const login = async (req, res) => {
  try {
    const { role, username, password } = req.body
    if (!role || !username || !password) return res.status(400).json({ message: 'Thiếu thông tin đăng nhập' })
    if (role === 'Admin') {
      const [rows] = await sqlPool.query(
        `SELECT Id AS id, FullName AS fullName, Email AS email, PhoneNumber AS phoneNumber, Status AS status FROM users WHERE Email = ? AND Status = 'Active'`,
        [username]
      )
      const user = rows[0]
      if (!user) return res.status(401).json({ message: 'Sai tài khoản hoặc bị khóa' })
      if (String(user.phoneNumber || '') !== String(password)) return res.status(401).json({ message: 'Mật khẩu không đúng' })
      return res.json({ role: 'Admin', userId: user.id, fullName: user.fullName })
    }
    if (role === 'Driver') {
      const [rows] = await sqlPool.query(
        `SELECT Id AS id, FullName AS fullName, PhoneNumber AS phoneNumber, MaBangLai AS license FROM drivers WHERE PhoneNumber = ?`,
        [username]
      )
      const d = rows[0]
      if (!d) return res.status(401).json({ message: 'Không tìm thấy tài xế' })
      if (String(d.license || '') !== String(password)) return res.status(401).json({ message: 'Mật khẩu không đúng' })
      return res.json({ role: 'Driver', userId: d.id, fullName: d.fullName })
    }
    if (role === 'Parent') {
      const [rows] = await sqlPool.query(
        `SELECT MaPhuHuynh AS id, HoTen AS fullName, SoDienThoai AS phone FROM phuhuynh WHERE SoDienThoai = ?`,
        [username]
      )
      const p = rows[0]
      if (!p) return res.status(401).json({ message: 'Không tìm thấy phụ huynh' })
      if (String(p.id || '') !== String(password)) return res.status(401).json({ message: 'Mật khẩu không đúng' })
      return res.json({ role: 'Parent', userId: p.id, fullName: p.fullName })
    }
    if (role === 'Student') {
      const [rows] = await sqlPool.query(
        `SELECT MaHocSinh AS id, HoTen AS fullName FROM hocsinh WHERE MaHocSinh = ?`,
        [username]
      )
      const s = rows[0]
      if (!s) return res.status(401).json({ message: 'Không tìm thấy học sinh' })
      if (String(s.id || '') !== String(password)) return res.status(401).json({ message: 'Mật khẩu không đúng' })
      return res.json({ role: 'Student', userId: s.id, fullName: s.fullName })
    }
    return res.status(400).json({ message: 'Vai trò không hợp lệ' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const loginAuto = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ message: 'Thiếu thông tin đăng nhập' })

    await ensureColumn('users')
    await ensureColumn('drivers')

    {
      const [rows] = await sqlPool.query(
        `SELECT Id AS id, FullName AS fullName, Email AS email, PhoneNumber AS phoneNumber, Status AS status, PasswordHash AS passwordHash FROM users WHERE Email = ? AND Status = 'Active'`,
        [username]
      )
      const user = rows[0]
      if (user) {
        if (user.passwordHash && verifyPassword(password, user.passwordHash)) {
          return res.json({ role: 'Admin', userId: user.id, fullName: user.fullName })
        }
        if (!user.passwordHash && String(user.phoneNumber || '') === String(password)) {
          return res.json({ role: 'Admin', userId: user.id, fullName: user.fullName })
        }
      }
    }

    {
      const [rows] = await sqlPool.query(
        `SELECT Id AS id, FullName AS fullName, PhoneNumber AS phoneNumber, MaBangLai AS license, PasswordHash AS passwordHash FROM drivers WHERE PhoneNumber = ?`,
        [username]
      )
      const d = rows[0]
      if (d) {
        if (d.passwordHash && verifyPassword(password, d.passwordHash)) {
          return res.json({ role: 'Driver', userId: d.id, fullName: d.fullName })
        }
        if (!d.passwordHash && String(d.license || '') === String(password)) {
          return res.json({ role: 'Driver', userId: d.id, fullName: d.fullName })
        }
      }
    }

    {
      const [rows] = await sqlPool.query(
        `SELECT MaPhuHuynh AS id, HoTen AS fullName, SoDienThoai AS phone FROM phuhuynh WHERE SoDienThoai = ?`,
        [username]
      )
      const p = rows[0]
      if (p && String(p.id || '') === String(password)) {
        return res.json({ role: 'Parent', userId: p.id, fullName: p.fullName })
      }
    }

    {
      const [rows] = await sqlPool.query(
        `SELECT MaHocSinh AS id, HoTen AS fullName FROM hocsinh WHERE MaHocSinh = ?`,
        [username]
      )
      const s = rows[0]
      if (s && String(s.id || '') === String(password)) {
        return res.json({ role: 'Student', userId: s.id, fullName: s.fullName })
      }
    }

    return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const createAdmin = async (req, res) => {
  try {
    const { email, fullName, phoneNumber, status, password } = req.body
    if (!email || !fullName || !password) return res.status(400).json({ message: 'Thiếu thông tin' })
    await ensureColumn('users')
    const passwordHash = hashPassword(password)
    const [existRows] = await sqlPool.query(`SELECT Id FROM users WHERE Email = ?`, [email])
    if (existRows.length > 0) {
      const id = existRows[0].Id || existRows[0].id
      await sqlPool.query(`UPDATE users SET FullName = ?, PhoneNumber = ?, Status = ?, PasswordHash = ? WHERE Id = ?`, [fullName, phoneNumber || null, status || 'Active', passwordHash, id])
      return res.json({ id })
    }
    const [result] = await sqlPool.query(`INSERT INTO users (FullName, Email, PhoneNumber, Status, PasswordHash) VALUES (?, ?, ?, ?, ?)`, [fullName, email, phoneNumber || null, status || 'Active', passwordHash])
    return res.status(201).json({ id: result.insertId })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const createDriver = async (req, res) => {
  try {
    const { fullName, phoneNumber, license, password } = req.body
    if (!fullName || !phoneNumber || !password) return res.status(400).json({ message: 'Thiếu thông tin' })
    await ensureColumn('drivers')
    const passwordHash = hashPassword(password)
    const [existRows] = await sqlPool.query(`SELECT Id FROM drivers WHERE PhoneNumber = ?`, [phoneNumber])
    if (existRows.length > 0) {
      const id = existRows[0].Id || existRows[0].id
      await sqlPool.query(`UPDATE drivers SET FullName = ?, MaBangLai = ?, PasswordHash = ? WHERE Id = ?`, [fullName, license || null, passwordHash, id])
      return res.json({ id })
    }
    const [result] = await sqlPool.query(`INSERT INTO drivers (FullName, PhoneNumber, MaBangLai, PasswordHash) VALUES (?, ?, ?, ?)`, [fullName, phoneNumber, license || null, passwordHash])
    return res.status(201).json({ id: result.insertId })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { role, userId, newPassword } = req.body
    if (!role || !userId || !newPassword) return res.status(400).json({ message: 'Thiếu thông tin' })
    const hashed = hashPassword(newPassword)
    if (role === 'Admin') {
      await ensureColumn('users')
      await sqlPool.query(`UPDATE users SET PasswordHash = ? WHERE Id = ?`, [hashed, userId])
      return res.json({ userId })
    }
    if (role === 'Driver') {
      await ensureColumn('drivers')
      await sqlPool.query(`UPDATE drivers SET PasswordHash = ? WHERE Id = ?`, [hashed, userId])
      return res.json({ userId })
    }
    return res.status(400).json({ message: 'Vai trò không hợp lệ' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}