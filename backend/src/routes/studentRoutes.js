import express from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByBus
} from "../controllers/studentController.js";

const router = express.Router();

// Routes cho students
router.get("/", getAllStudents);                    // GET /api/students
router.get("/:id", getStudentById);                 // GET /api/students/:id
router.post("/", createStudent);                    // POST /api/students
router.put("/:id", updateStudent);                  // PUT /api/students/:id
router.delete("/:id", deleteStudent);               // DELETE /api/students/:id
router.get("/bus/:busId", getStudentsByBus);        // GET /api/students/bus/:busId

export default router;
