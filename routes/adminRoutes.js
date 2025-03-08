const express = require("express");
const Student = require("../models/Student");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get all students (Admin Only)
router.get("/students", authMiddleware, async (req, res) => {
  try {
    const students = await Student.find().select("-password"); // Exclude passwords
    res.json(students);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
