import express from "express";
import {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute
} from "../controllers/simpleRouteController.js";

const router = express.Router();
router.get("/", getAllRoutes);
router.get("/:id", getRouteById);
router.post("/", createRoute);
router.put("/:id", updateRoute);
router.delete("/:id", deleteRoute);
export default router;
