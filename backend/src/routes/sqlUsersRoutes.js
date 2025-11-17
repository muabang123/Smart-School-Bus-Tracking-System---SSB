import express from 'express'
import { listUsers, createUser, updateUser, deleteUser, toggleUserStatus } from '../controllers/sqlUsersController.js'

const router = express.Router()

router.get('/', listUsers)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.patch('/:id/status', toggleUserStatus)

export default router