const AiConversation = require("../models/AiConversation");
const AiMessage = require("../models/AiMessage");
const { generateReply, DISCLAIMER } = require("../utils/aiKnowledgeBase");

// GET /api/ai/disclaimer
function getDisclaimer(req, res) {
  res.json({ disclaimer: DISCLAIMER });
}

// POST /api/ai/conversations
async function createConversation(req, res) {
  const language = req.body.language === "ha" ? "ha" : "en";
  const conversation = await AiConversation.create({ user: req.user._id, language });
  res.status(201).json({ conversation });
}

// GET /api/ai/conversations
async function listConversations(req, res) {
  const conversations = await AiConversation.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json({ conversations });
}

// GET /api/ai/conversations/:id/messages
async function listMessages(req, res) {
  const conversation = await AiConversation.findOne({ _id: req.params.id, user: req.user._id });
  if (!conversation) return res.status(404).json({ message: "Conversation not found" });

  const messages = await AiMessage.find({ conversation: conversation._id }).sort({ createdAt: 1 });
  res.json({ messages });
}

// POST /api/ai/conversations/:id/messages
// Every reply comes from backend/utils/aiKnowledgeBase.js, which runs the
// danger-sign check and the no-diagnosis guardrail before anything else,
// and only ever answers from its fixed, reviewed topic library -
// grounded content, never free-form generation.
async function sendMessage(req, res) {
  try {
    const conversation = await AiConversation.findOne({ _id: req.params.id, user: req.user._id });
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    const content = (req.body.content || "").trim();
    if (!content) return res.status(400).json({ message: "content is required" });

    const userMessage = await AiMessage.create({
      conversation: conversation._id,
      role: "user",
      content,
    });

    const { reply, matchedTopic, safetyFlag } = generateReply(content, conversation.language);

    const assistantMessage = await AiMessage.create({
      conversation: conversation._id,
      role: "assistant",
      content: reply,
      matchedTopic,
      safetyFlag,
    });

    conversation.updatedAt = new Date();
    await conversation.save();

    res.status(201).json({ userMessage, assistantMessage });
  } catch (err) {
    res.status(500).json({ message: "Could not generate a reply", error: err.message });
  }
}

// DELETE /api/ai/conversations/:id
async function deleteConversation(req, res) {
  const conversation = await AiConversation.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!conversation) return res.status(404).json({ message: "Conversation not found" });
  await AiMessage.deleteMany({ conversation: conversation._id });
  res.json({ message: "Conversation deleted" });
}

module.exports = {
  getDisclaimer,
  createConversation,
  listConversations,
  listMessages,
  sendMessage,
  deleteConversation,
};
