import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: [{ type: String, enum: ["Anbieter", "Suchender"] }],
  profession: { type: String },
  location: { type: String },
  description: { type: String },
  profilePhoto: { type: String },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false },
  tokenVersion: { type: Number, default: 0, select: false }
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  delete obj.tokenVersion;
  return obj;
}

const User = mongoose.model("User", userSchema);

export default User;
