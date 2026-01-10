import mongoose, { Schema, model, models } from "mongoose";

const QuestionSchema = new Schema({
  id: Number,
  type: { type: String, default: "CHOICE" },
  score: { type: Number, default: 5 },
  correctAnswer: { type: String, required: true },
});

const TestSchema = new Schema({
  title: { type: String, required: true },
  timeLimit: { type: Number, default: 50 },
  startDate: Date,
  endDate: Date,
  examPapers: [String], 
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now },
});

const Test = models.Test || model("Test", TestSchema);

export default Test;