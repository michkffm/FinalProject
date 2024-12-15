import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  role: { type: String, enum: ["Anbieter", "Suchender"], required: true },
  profession: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  profilePhoto: { type: String, required: false }, 
  createdBy: { type: mongoose.ObjectId, ref: "User", required: true }, 
  createdAt: { type: Date, default: Date.now },
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;