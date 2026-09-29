require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/utils/db");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => res.json({ message: "AI StudyBuddy API is running" }));

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/material", require("./src/routes/materialRoutes"));
app.use("/api/materials", require("./src/routes/materialRoutes"));
app.use("/api/ai", require("./src/routes/aiRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() =>
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
);
