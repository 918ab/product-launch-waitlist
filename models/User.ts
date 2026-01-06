import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "이메일을 입력해주세요."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "비밀번호를 입력해주세요."],
    select: false, 
  },
  name: {
    type: String,
    required: [true, "이름을 입력해주세요."],
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
  status: {
    type: String,
    enum: ["pending", "active", "banned"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);