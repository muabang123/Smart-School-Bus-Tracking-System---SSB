import express from 'express'
import { listSchedules, createSchedule, updateSchedule, deleteSchedule, listAssignments, addAssignment, removeAssignment } from '../controllers/sqlAdminSchedulesController.js'

const router = express.Router()

router.get('/', listSchedules)
router.post('/', createSchedule)
router.put('/:id', updateSchedule)
router.delete('/:id', deleteSchedule)

router.get('/:id/assignments', listAssignments)
router.post('/:id/assignments', addAssignment)
router.delete('/:id/assignments/:assignmentId', removeAssignment)

export default router