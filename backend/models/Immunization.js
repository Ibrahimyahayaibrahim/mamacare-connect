const mongoose = require("mongoose");

const immunizationSchema = new mongoose.Schema(
  {
    child: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true, index: true },
    scheduleRef: { type: mongoose.Schema.Types.ObjectId, ref: "VaccineSchedule" },
    vaccineName: { type: String, required: true },
    milestoneLabel: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    completedDate: { type: Date, default: null },
  },
  { timestamps: true }
);

// Status is derived, never stored redundantly - it can only ever be
// Completed, Overdue, Due Today or Upcoming relative to *today* and the
// scheduledDate/completedDate above, so there is nothing to fall out of sync.
immunizationSchema.methods.getStatus = function getStatus() {
  if (this.completedDate) return "Completed";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const scheduled = new Date(this.scheduledDate);
  scheduled.setHours(0, 0, 0, 0);

  if (scheduled.getTime() === today.getTime()) return "Due Today";
  if (scheduled.getTime() < today.getTime()) return "Overdue";
  return "Upcoming";
};

immunizationSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    child: this.child,
    vaccineName: this.vaccineName,
    milestoneLabel: this.milestoneLabel,
    scheduledDate: this.scheduledDate,
    completedDate: this.completedDate,
    status: this.getStatus(),
  };
};

module.exports = mongoose.model("Immunization", immunizationSchema);
