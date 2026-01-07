import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isImportant: {
    type: Boolean,
    default: false,
  },
  target: {
    type: String,
    default: "all",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Notice || mongoose.model("Notice", NoticeSchema);