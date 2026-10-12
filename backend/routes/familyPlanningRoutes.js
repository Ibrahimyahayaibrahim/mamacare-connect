const express = require("express");
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/roleCheck");
const {
  listMethods,
  compareMethods,
  createMethod,
  updateMethod,
  deleteMethod,
  listReminders,
  createReminder,
  updateReminder,
  deleteReminder,
} = require("../controllers/familyPlanningController");

const router = express.Router();

router.use(protect);

router.get("/methods", listMethods);
router.get("/compare", compareMethods);

router.post("/methods", allowRoles("admin"), createMethod);
router.put("/methods/:id", allowRoles("admin"), updateMethod);
router.delete("/methods/:id", allowRoles("admin"), deleteMethod);

router.get("/reminders", listReminders);
router.post("/reminders", createReminder);
router.put("/reminders/:id", updateReminder);
router.delete("/reminders/:id", deleteReminder);

module.exports = router;
