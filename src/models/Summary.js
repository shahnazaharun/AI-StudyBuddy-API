const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Summary",
  new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      materialId: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true, unique: true },
      summary: { type: String, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
  )
);
