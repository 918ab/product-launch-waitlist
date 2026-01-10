import mongoose, { Schema, model, models } from "mongoose";

const ResultSchema = new Schema({
  testId: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
  userId: { type: String, required: true }, 
  studentName: { type: String, required: true }, 
  score: { type: Number, required: true },
  timeTaken: { type: String, default: "00:00" },
  answers: { type: Map, of: String },
  submittedAt: { type: Date, default: Date.now },
});

const Result = models.Result || model("Result", ResultSchema);

export default Result;