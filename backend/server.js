import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import scheduleRoutes from "./src/routes/scheduleRoutes.js"; // chú ý đường dẫn nếu khác

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/busApp")
  .then(() => console.log(" Kết nối MongoDB thành công"))
  .catch((err) => console.error(" Lỗi kết nối MongoDB:", err));

// Routes
app.use("/api/schedules", scheduleRoutes);

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server đang chạy ở cổng ${PORT}`));
