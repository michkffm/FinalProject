import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  price: { type: String, required: true, set: value => String(value).trim().replace(",", "."), match: /^\d{1,8}(?:\.\d{1,2})?$/ },
  category: {
    type: String,
    enum: [
      "Beratung",
      "Bildung und Schulung",
      "Betreuung und Gesundheit",
      "Finanzen und Versicherungen",
      "Technologie und IT",
      "Reparatur und Wartung",
      "Transport und Logistik",
      "Reinigung und Pflege",
      "Bau- und Renovierungsdienste",
      "Freizeit und Unterhaltung",
      "Essen und Trinken",
      "Sport und Lifestyle",
    ],
    required: true,
  },
  location: { type: String, required: true, trim: true, maxlength: 200 },
  contact: { type: String, required: true, trim: true, maxlength: 254 },
  createdBy: { type: mongoose.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
