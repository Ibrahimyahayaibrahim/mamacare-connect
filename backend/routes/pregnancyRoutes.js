const express = require("express");
const { protect } = require("../middleware/auth");
const { getMine, createOrUpdate, updateStatus } = require("../controllers/pregnancyController");

const router = express.Router();

router.use(protect);
router.get("/mine", getMine);
router.post("/", createOrUpdate);
router.put("/:id/status", updateStatus);

module.exports = router;
