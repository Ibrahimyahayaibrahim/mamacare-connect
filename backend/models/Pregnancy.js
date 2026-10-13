const mongoose = require("mongoose");

const pregnancySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    // Last Menstrual Period - the single source of truth for every
    // calculation (week, trimester, EDD, days remaining). Never store a
    // separately-editable EDD that could drift out of sync with it.
    lmpDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "completed", "ended"],
      default: "active",
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pregnancy", pregnancySchema);
