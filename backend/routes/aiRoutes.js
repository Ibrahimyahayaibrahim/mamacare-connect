const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getDisclaimer,
  createConversation,
  listConversations,
  listMessages,
  sendMessage,
  deleteConversation,
} = require("../controllers/aiController");

const router = express.Router();

router.use(protect);

router.get("/disclaimer", getDisclaimer);
router.post("/conversations", createConversation);
router.get("/conversations", listConversations);
router.get("/conversations/:id/messages", listMessages);
router.post("/conversations/:id/messages", sendMessage);
router.delete("/conversations/:id", deleteConversation);

module.exports = router;
