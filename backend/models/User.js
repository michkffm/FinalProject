import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Anbieter', 'Suchender'], required: true },
  createdAt: { type: Date, default: Date.now },
  profession: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  profilePhoto: { type: String, required: false},
});

const User = mongoose.model("User", userSchema);

export default User;
