import mongoose from "mongoose";

const QnaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String, 
  },
  author: {
    type: String, 
    required: true,
  },
  authorId: {
    type: String,
  },
  isSecret: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["waiting", "answered"],
    default: "waiting",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Qna || mongoose.model("Qna", QnaSchema);