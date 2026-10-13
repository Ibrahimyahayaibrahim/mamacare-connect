const mongoose = require("mongoose");

const aiConversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    language: { type: String, enum: ["en", "ha"], default: "en" },
    title: { type: String, trim: true, default: "MamaCare AI Chat" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AiConversation", aiConversationSchema);