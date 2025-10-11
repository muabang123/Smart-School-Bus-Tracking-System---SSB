import express from "express";
import { 
  getAllBuses, 
  getBusById, 
  createBus, 
  updateBus, 
  deleteBus
} from "../controllers/busController.js";

const router = express.Router();

// Routes cho buses
router.get("/", getAllBuses);                       // GET /api/buses
router.get("/:id", getBusById);                     // GET /api/buses/:id
router.post("/", createBus);                        // POST /api/buses
router.put("/:id", updateBus);                      // PUT /api/buses/:id
router.delete("/:id", deleteBus);                   // DELETE /api/buses/:id

export default router;
