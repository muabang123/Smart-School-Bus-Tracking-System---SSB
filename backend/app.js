import express from "express";
import cors from "cors";
import busRoutes from "./src/routes/busRoutes.js";
import studentRoutes from "./src/routes/studentRoutes.js";
import routeRoutes from "./src/routes/routeRoutes.js";
import simpleBusRoutes from "./src/routes/simpleBusRoutes.js";
import simpleStudentRoutes from "./src/routes/simpleStudentRoutes.js";
import simpleRouteRoutes from "./src/routes/simpleRouteRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚍 Smart School Bus Tracking System Backend is running!");
});

// API Routes
app.use("/api/buses", busRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/simple-buses", simpleBusRoutes);
app.use("/api/simple-students", simpleStudentRoutes);
app.use("/api/simple-routes", simpleRouteRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
