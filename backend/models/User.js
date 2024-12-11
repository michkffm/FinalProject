import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Anbieter', 'Suchender'], required: true },
  createdAt: { type: Date, default: Date.now },
  profession: { type: String },
  location: { type: String },
  description: { type: String },
  profilePhoto: { type: String },
});

const User = mongoose.model("User", userSchema);

export default User;
