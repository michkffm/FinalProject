import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: [{ type: String, enum: ["Anbieter", "Suchender"], required: true }],
  profession: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  profilePhoto: { type: String, required: false }
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
}

const User = mongoose.model("User", userSchema);

export default User;
