import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["video", "resource", "notice"], 
    required: true,
  },
  category: {
    type: String,
  },
  link: {
    type: String,
  },
  detail: {
    type: String,
  },
  content: {
    type: String,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  target: {
    type: String,
    enum: ["student", "all", "guest"], 
    default: "student",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Content || mongoose.model("Content", ContentSchema);