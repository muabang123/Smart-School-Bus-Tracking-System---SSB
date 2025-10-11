import express from "express";
import {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  getBusesByRoute
} from "../controllers/routeController.js";

const router = express.Router();

// Routes cho routes
router.get("/", getAllRoutes);                      // GET /api/routes
router.get("/:id", getRouteById);                   // GET /api/routes/:id
router.post("/", createRoute);                      // POST /api/routes
router.put("/:id", updateRoute);                    // PUT /api/routes/:id
router.delete("/:id", deleteRoute);                 // DELETE /api/routes/:id
router.get("/:id/buses", getBusesByRoute);          // GET /api/routes/:id/buses

export default router;
