import express from 'express'
import { getTodayByDriver, getUpcomingByDriver, getAllSchedules, getTables, getSample, getRoutesByDriver, getAllRoutes } from '../controllers/sqlScheduleController.js'

const router = express.Router()

router.get('/today', getTodayByDriver)
router.get('/upcoming', getUpcomingByDriver)
router.get('/', getAllSchedules)
router.get('/meta/tables', getTables)
router.get('/meta/sample', getSample)
router.get('/routes/by-driver', getRoutesByDriver)
router.get('/routes', getAllRoutes)

export default router