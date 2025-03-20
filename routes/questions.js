const express = require("express");
const Question = require("../models/Question"); 
const router = express.Router();

//add question
router.post("/add-question", async (req, res) => {
  try {
    const { question, options, correct } = req.body;

    if (!question || !options || correct === undefined) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const existingQuestion=await Question.findOne({question})
    if (existingQuestion) {
      return res.status(400).json({   success: false,message: "question already exist" });
    }

    // Get the current count of questions to set the index
    const questionCount = await Question.countDocuments();
    console.log(questionCount)

    const newQuestion = new Question({ 
      index: questionCount+1, 
      question, 
      options, 
      correct 
    });

    await newQuestion.save();

    res.status(201).json({ success: true, message: "Question added successfully!", question: newQuestion });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ success: false, message: "Failed to add question." });
  }
});


//  fetch all questions
router.get("/get-questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ success: false, message: "Failed to fetch questions." });
  }
});


router.get('/get-question/:index', async (req, res) => {
  try {
    const index = parseInt(req.params.index); 

    if (isNaN(index)) {
      return res.status(400).json({ success: false, message: "Invalid index" });
    }

    const question = await Question.findOne({ index }); 

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    res.status(200).json({ success: true, question });

  } catch (error) {
    console.error("Error fetching question by index:", error);
    res.status(500).json({ success: false, message: "Failed to get question by index." });
  }
});






module.exports = router;
