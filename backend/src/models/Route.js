import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  routeName: { type: String, required: true },
  startPoint: String,
  endPoint: String,
});

export default mongoose.model("Route", routeSchema);
