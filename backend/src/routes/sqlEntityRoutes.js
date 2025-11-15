import express from 'express'
import { getVehiclesWithRoute, getStudents, getRoutesDetails } from '../controllers/sqlEntityController.js'

const router = express.Router()

router.get('/vehicles', getVehiclesWithRoute)
router.get('/students', getStudents)
router.get('/routes/details', getRoutesDetails)

export default router