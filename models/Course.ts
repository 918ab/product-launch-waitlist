import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "grammar",
  },
  level: {
    type: String,
    default: "초급",
  },
  color: {
    type: String, 
    default: "from-slate-500 to-slate-400",
  },
  intro: {
    type: String, 
  },
  curriculum: {
    type: [String],
    default: [],
  },
  thumbnail: {
    type: String, 
    required: false, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);