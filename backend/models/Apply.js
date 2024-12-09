import mongoose from "mongoose";

const applySchema = new mongoose.Schema({
    jobId: { type: mongoose.ObjectId, ref: 'Job', required: true }, // Verknüpfung zu Job
    applicantId: { type: mongoose.ObjectId, ref: 'User', required: true }, // Wer hat sich beworben?
    appliedAt: { type: Date, default: Date.now } // Bewerbungsdatum
  });

const Apply = mongoose.model("Apply", applySchema);

export default Apply;