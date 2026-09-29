const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Flashcard",
  new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      materialId: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true },
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
  )
);
