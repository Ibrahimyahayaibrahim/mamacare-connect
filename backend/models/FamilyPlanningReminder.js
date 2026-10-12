const mongoose = require("mongoose");

// A minimal, private reminder scoped to one user, specifically for family
// planning (e.g. "next injection due"). This is intentionally simple -
// the full Reminders & Alarms system (recurrence, alarm sound, snooze,
// quiet hours, push notifications) is Phase 5 and will likely absorb
// this into the general Reminder model rather than keep it separate.
const familyPlanningReminderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    label: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    notes: { type: String, trim: true },
    isDone: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FamilyPlanningReminder", familyPlanningReminderSchema);
