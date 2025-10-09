import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grade: String,
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
});

export default mongoose.model("Student", studentSchema);
