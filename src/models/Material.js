const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Material",
  new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      title: { type: String, required: true, trim: true },
      subject: { type: String, default: "General", trim: true },
      content: { type: String, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
  )
);
