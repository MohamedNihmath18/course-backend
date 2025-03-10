const express = require("express");
const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const Grade = require("../models/Grade");
const Student = require("../models/Student");

const router = express.Router();

// Ensure certificates folder exists
const certificatesDir = path.join(__dirname, "../certificates");
if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir, { recursive: true });
}

// Generate Certificate PDF
router.get("/generate-certificate/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId);
    const grade = await Grade.findOne({ studentId });

    if (!student || !grade) {
      return res.status(404).json({ msg: "Student or Grade not found" });
    }

    // Render the certificate template
    const templatePath = path.join(__dirname, "../templates/certificate.ejs");
    const html = await ejs.renderFile(templatePath, {
      name: student.name,
      course: student.course,
      grade: grade.grade,
    });

    // ✅ FIX: Ensure Puppeteer finds Chrome in Render
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || (await puppeteer.executablePath()),
    });

    const page = await browser.newPage();
    await page.setContent(html);

    // Save PDF Locally
    const pdfPath = path.join(certificatesDir, `${student.name}_certificate.pdf`);
    await page.pdf({ path: pdfPath, format: "A4" });

    await browser.close();
    console.log("✅ PDF Generated at:", pdfPath);

    // Send the file to client
    res.download(pdfPath);
  } catch (err) {
    console.error("❌ Error generating certificate:", err.message);
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
