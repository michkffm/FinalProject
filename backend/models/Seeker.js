import mongoose from "mongoose";

const seekerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ["Strom", "Babysitting", "IT", "Heizung", "Nachhilfe"],
    required: true,
  },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  createdBy: { type: mongoose.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Seeker = mongoose.model("Seeker", seekerSchema);

export default Seeker;
