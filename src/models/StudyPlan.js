const mongoose = require("mongoose");

module.exports = mongoose.model(
  "StudyPlan",
  new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      subject: { type: String },
      studyPlan: { type: mongoose.Schema.Types.Mixed, required: true },
      examDate: { type: Date, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
  )
);
