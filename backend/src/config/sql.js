import mysql from 'mysql2/promise'

const host = process.env.MYSQL_HOST || 'localhost'
const port = Number(process.env.MYSQL_PORT || 3306)
const user = process.env.MYSQL_USER || 'root'
const password = process.env.MYSQL_PASSWORD || '123456'
const database = process.env.MYSQL_DB || 'school_bus_db'

export const sqlPool = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})