import express from 'express'
import { getSummary, getUsers } from '../controllers/sqlDashboardController.js'

const router = express.Router()

router.get('/summary', getSummary)
router.get('/users', getUsers)

export default router