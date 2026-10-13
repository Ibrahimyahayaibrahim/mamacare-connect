const mongoose = require("mongoose");

const aiMessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AiConversation",
      required: true,
      index: true,
    },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    // Which fixed topic (from aiKnowledgeBase.js) this reply matched, if
    // any - lets the UI show what it was answering about. "danger_sign"
    // or "diagnosis_request" in safetyFlag means a guardrail fired
    // instead of a normal topic answer.
    matchedTopic: { type: String, default: null },
    safetyFlag: { type: String, enum: [null, "danger_sign", "diagnosis_request"], default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AiMessage", aiMessageSchema);