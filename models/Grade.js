const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  course: { type: String, required: true },
  grade: { type: String, required: true },
  certificateGenerated: { type: Boolean, default: false },
});

module.exports = mongoose.model("Grade", gradeSchema);
