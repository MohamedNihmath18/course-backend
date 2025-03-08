const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const gradeRoutes = require("./routes/gradeRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const adminRoutes = require("./routes/adminRoutes"); 


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/certificate", certificateRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
