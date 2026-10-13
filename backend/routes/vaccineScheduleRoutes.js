const express = require("express");
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/roleCheck");
const { list, create, update, remove } = require("../controllers/vaccineScheduleController");

const router = express.Router();

router.use(protect);

router.get("/", list);
router.post("/", allowRoles("admin"), create);
router.put("/:id", allowRoles("admin"), update);
router.delete("/:id", allowRoles("admin"), remove);

module.exports = router;
