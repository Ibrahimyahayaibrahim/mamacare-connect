const mongoose = require("mongoose");

// A minimal, private reminder scoped to one user, specifically for family
// planning (e.g. "next injection due"). The full Reminders & Alarms
// system (Phase 5) will likely absorb this into the general Reminder
// model with full recurrence/alarm support.
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
