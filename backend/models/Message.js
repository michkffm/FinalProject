import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true }, // İlgili iş ilanı
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Mesajı gönderen kullanıcı
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Mesajın alıcısı
  content: { type: String, required: true }, // Mesaj içeriği
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
