import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  driverName: { type: String, required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
});

export default mongoose.model("Bus", busSchema);
