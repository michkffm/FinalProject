import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: [{ type: String, enum: ["Anbieter", "Suchender"] }],
  profession: { type: String },
  location: { type: String },
  description: { type: String },
  profilePhoto: { type: String },
  resetPasswordToken: { type: String }, 
  resetPasswordExpires: { type: Date }
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
}

const User = mongoose.model("User", userSchema);

export default User;
