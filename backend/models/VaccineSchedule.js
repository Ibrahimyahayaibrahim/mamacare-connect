const mongoose = require("mongoose");

// This is the TEMPLATE only - one document per vaccine dose in the
// national schedule. Actual per-child due dates live in Immunization
// (child.dob + ageInDays), generated from whatever is active here.
// Admin can edit this collection; nothing in the app should ever
// hardcode a vaccine date outside of it.
const vaccineScheduleSchema = new mongoose.Schema(
  {
    vaccineName: { type: String, required: true, trim: true },
    milestoneLabel: { type: String, required: true, trim: true }, // e.g. "At birth", "6 weeks"
    ageInDays: { type: Number, required: true, min: 0 },
    order: { type: Number, required: true, default: 0 },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VaccineSchedule", vaccineScheduleSchema);
