import express from 'express'
import { login, loginAuto, createAdmin, createDriver, changePassword } from '../controllers/sqlAuthController.js'

const router = express.Router()

router.post('/login', login)
router.post('/login-auto', loginAuto)
router.post('/create-admin', createAdmin)
router.post('/create-driver', createDriver)
router.post('/change-password', changePassword)

export default router