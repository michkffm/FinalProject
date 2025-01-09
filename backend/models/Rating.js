import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.ObjectId, ref: "User", required: true},
    jobId: { type: mongoose.ObjectId, ref: "Job", required: true},
    rating: { type: Number, required: true,min: 1,max: 5},
    content: { type: String},
    createdAt: { type: Date, default: Date.now }
});

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;