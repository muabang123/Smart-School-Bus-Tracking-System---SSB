import express from 'express'
import { getSummary, getUsers, getTodaySchedulesSummary } from '../controllers/sqlDashboardController.js'

const router = express.Router()

router.get('/summary', getSummary)
router.get('/users', getUsers)
router.get('/today-schedules', getTodaySchedulesSummary)

export default router