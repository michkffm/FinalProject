import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  category: {
    type: String,
<<<<<<< HEAD
    enum: ["Beratung", "Bildung und Schulung", "Betreuung und Gesundheit", "Finanzen und Versicherungen", "Technologie und IT",
           "Reparatur und Wartung", "Transport und Logistik", "Reinigung und Pflege", "Bau- und Renovierungsdienste", "Freizeit und Unterhaltung", "Essen und Trinken", "Sport und Lifestyle"],
=======
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
>>>>>>> 8f0bd0f302c3b38c90e1a01d920181255afca643
    required: true,
  },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  createdBy: { type: mongoose.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
