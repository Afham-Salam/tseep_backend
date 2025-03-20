const mongoose = require("mongoose");


const FeedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, enum: [1, 2, 3, 4, 5] }, // Emojis map to numbers
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

const Feedback= mongoose.model("Feedback", FeedbackSchema);
module.exports = Feedback;
