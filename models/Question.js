const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    index: { type: Number, unique: true },
    question: { type: String, required: true,unique: true },
    options: { type: [String], required: true },
    correct: { type: String, required: true },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
