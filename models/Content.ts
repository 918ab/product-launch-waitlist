import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "강의 제목을 입력해주세요."],
  },
  description: {
    type: String,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  videoUrl: {
    type: String, 
    required: [true, "영상 링크가 필요합니다."],
  },
  category: {
    type: String,
    default: "grammar", 
  },
  duration: {
    type: String, 
    default: "00:00",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Content || mongoose.model("Content", ContentSchema);