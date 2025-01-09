import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  jobId: { type: mongoose.ObjectId, ref: "Job", required: true }, 
  senderId: { type: mongoose.ObjectId, ref: "User", required: true }, 
  receiverId: { type: mongoose.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
