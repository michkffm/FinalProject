import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.ObjectId, required: true },
  profession: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  profilePicture: { type: String },
});

const Profile = mongoose.model("User", profileSchema);

export default Profile;
