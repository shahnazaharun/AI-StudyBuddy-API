const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String,
  },
  { _id: false }
);

module.exports = mongoose.model(
  "Quiz",
  new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      materialId: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true, unique: true },
      questions: [questionSchema],
    },
    { timestamps: { createdAt: true, updatedAt: false } }
  )
);
