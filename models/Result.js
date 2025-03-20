const mongoose = require("mongoose");


const testResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, required: true },
  answers: [
    {
      question: { type: String, required: true },
      selectedAnswer: { type: String, required: true },
      correctAnswer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
}, { timestamps: true });

const TestResult = mongoose.model("TestResult", testResultSchema);
module.exports = TestResult;

