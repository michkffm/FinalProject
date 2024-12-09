import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ["Storm", "Babysitting", "IT", "Heizung", "Nachhilfe"],
    required: true,
  },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  createdBy: { type: mongoose.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
