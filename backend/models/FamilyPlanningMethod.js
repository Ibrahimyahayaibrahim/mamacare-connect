const mongoose = require("mongoose");

const familyPlanningMethodSchema = new mongoose.Schema(
  {
    name: { en: { type: String, required: true }, ha: { type: String, required: true } },
    category: {
      type: String,
      enum: ["barrier", "hormonal-short-acting", "long-acting", "permanent", "natural", "emergency"],
      required: true,
    },
    description: { en: { type: String, required: true }, ha: { type: String, required: true } },
    duration: { en: { type: String, required: true }, ha: { type: String, required: true } },
    mechanism: { en: { type: String, required: true }, ha: { type: String, required: true } },
    effectiveness: { en: { type: String, required: true }, ha: { type: String, required: true } },
    advantages: { en: [String], ha: [String] },
    sideEffects: { en: [String], ha: [String] },
    considerations: { en: { type: String, required: true }, ha: { type: String, required: true } },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FamilyPlanningMethod", familyPlanningMethodSchema);
