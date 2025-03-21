const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const TestResult = require("../models/Result");
const { findById } = require("../models/users");

// Submit answers and calculate score
router.post("/submit-answers", async (req, res) => {
  try {
    const { userId, answers } = req.body;

    if (!userId || !answers || answers.length === 0) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    let totalScore = 0;
    let userAnswers = [];

    for (const answer of answers) {
      const question = await Question.findOne({ index: answer.index });

      if (!question) continue;

      const isCorrect = question.correct === answer.selectedAnswer;
      if (isCorrect) totalScore += 5; // Award 5 points for correct answer

      userAnswers.push({
        index: question.index,
        question: question.question,
        options: question.options, // Include question options
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.correct,
        isCorrect,
      });
    }

    // Save test result
    const testResult = new TestResult({
      userId,
      score: totalScore,
      answers: userAnswers,
    });

    await testResult.save();

    return res.json({
      message: "Test submitted successfully!",
      score: totalScore,
      resultId: testResult._id,
      answers: userAnswers, // Include detailed answers
    });
  } catch (error) {
    console.error("Error submitting test:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get-result/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const testResult = await TestResult.find({ userId }).sort({
      createdAt: -1,
    });

    if (!testResult) {
      return res
        .status(404)
        .json({ message: "No test result found for this user" });
    }

    return res.json({ success: true, result: testResult });
  } catch (error) {
    console.error("Error fetching test result:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
