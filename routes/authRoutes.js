const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
require("dotenv").config();

const router = express.Router();

// Student Registration
router.post("/register-student", async (req, res) => {
  const { name, email, course, password } = req.body;

  try {
    let student = await Student.findOne({ email });
    if (student) return res.status(400).json({ msg: "Student already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    student = new Student({ name, email, course, password: hashedPassword });
    await student.save();

    res.status(201).json({ msg: "Student registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Student Login
router.post("/login-student", async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, student });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin Registration
router.post("/register-admin", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (admin) return res.status(400).json({ msg: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ msg: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin Login
router.post("/login-admin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, admin });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
