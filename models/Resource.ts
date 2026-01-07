import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "제목을 입력해주세요."],
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    default: "기타",
  },
  files: [{
    fileName: String,
    filePath: String,
    fileSize: String,
  }],
  isNewResource: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);