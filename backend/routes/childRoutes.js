const express = require("express");
const { protect } = require("../middleware/auth");
const { list, getOne, create, update, remove } = require("../controllers/childController");
const {
  listForChild,
  markComplete,
  undoComplete,
} = require("../controllers/immunizationController");

const router = express.Router();

router.use(protect);

router.get("/", list);
router.post("/", create);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", remove);

router.get("/:childId/immunizations", listForChild);
router.put("/:childId/immunizations/:id/complete", markComplete);
router.put("/:childId/immunizations/:id/undo", undoComplete);

module.exports = router;
