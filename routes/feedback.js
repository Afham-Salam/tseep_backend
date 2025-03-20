
const express=require("express")
const Feedback = require("../models/Feedback");
const router = express.Router();

// Submit feedback
router.post("/submit", async (req, res) => {
  try {
    const { rating, comment,userId } = req.body;

    const newFeedback = new Feedback({ userId, rating, comment });
    await newFeedback.save();

    res.status(201).json({ success: true, message: "Feedback submitted!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



module.exports= router;
