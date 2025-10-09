import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import busRoutes from "./src/routes/busRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("🚍 Smart School Bus Tracking System Backend is running!");
});

app.use("/api/buses", busRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
