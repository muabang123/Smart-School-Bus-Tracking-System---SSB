import express from 'express'
import { getParents, getDrivers } from '../controllers/sqlAccountController.js'

const router = express.Router()

router.get('/parents', getParents)
router.get('/drivers', getDrivers)

export default router