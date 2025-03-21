var express = require("express");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var router = express.Router();


//register

router.post("/register", async (req, res) => {
    try {
      const { name, email, mobileNo, password, status } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists. Please login instead.",
        });
      }
  
      // Validate status
      if (!["student", "employee"].includes(status.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be 'student' or 'employee'.",
        });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 8);
      // Create new user
      const newUser = new User({
        name,
        email,
        mobileNo,
        password: hashedPassword, 
        status,
      });
      await newUser.save();
  
      // Generate JWT token
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(201).json({
        success: true,
        token,
        message: "User registration successful.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          mobileNo: newUser.mobileNo,
          status: newUser.status,
        },
      });
    } catch (error) {
      console.error("Registration Error:", error); 
      res.status(500).json({
        success: false,
        message: "An error occurred during registration. Please try again.",
        error: error.message, 
      });
    }
  });
  

//login

router.post("/login", async (req, res) => {
    try {
      const { mobileNo, password } = req.body;
  
  
      const user = await User.findOne({ mobileNo }); 
      if (!user) {
        return res.status(400).json({ error: "User already exist" });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, status: user.status }, 
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({
        message: "Login Successful",
        token,
        user,
      });
  
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  });


  //logout

  router.post("api/logout", (req, res) => {
    try {
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Logout failed", error });
    }
  });

  module.exports = router;