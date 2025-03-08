const express = require("express");
const Grade = require("../models/Grade");
const Student =  require("../models/Student")

const router = express.Router();

// Admin assigns grade to student
// router.post("/assign-grade", async (req, res) => {
//   const { studentId, grade } = req.body;

//   try {
//     const student = await Student.findById(studentId);
//     if (!student) return res.status(404).json({ msg: "Student not found" });

//     let studentGrade = await Grade.findOne({ studentId });
//     if (studentGrade) {
//       studentGrade.grade = grade;
//     } else {
//       studentGrade = new Grade({ studentId, course: student.course, grade });
//     }

//     await studentGrade.save();
//     res.status(200).json({ msg: "Grade assigned successfully", studentGrade });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// });

router.post("/assign-grade", async (req, res) => {
  const { studentId, grade } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ msg: "Student not found" });

    let studentGrade = await Grade.findOne({ studentId });

    if (studentGrade) {
      studentGrade.grade = grade;
      await studentGrade.save(); // ✅ Ensure grade is updated
    } else {
      studentGrade = new Grade({ studentId, course: student.course, grade });
      await studentGrade.save(); // ✅ Ensure new grade is saved
    }

    res.status(200).json({ msg: "Grade assigned successfully", studentGrade });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// Fetch all students with their grades
router.get("/students-with-grades", async (req, res) => {
  try {
    const students = await Student.find();
    const studentGrades = await Grade.find();

    const studentsWithGrades = students.map((student) => {
      const gradeEntry = studentGrades.find((g) => g.studentId.toString() === student._id.toString());
      return {
        _id: student._id,
        name: student.name,
        email: student.email,
        course: student.course,
        grade: gradeEntry ? gradeEntry.grade : "Not Graded",
      };
    });

    res.status(200).json(studentsWithGrades);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
