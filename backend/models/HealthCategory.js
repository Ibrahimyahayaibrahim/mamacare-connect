const mongoose = require("mongoose");

const CATEGORY_SLUGS = [
  "pregnancy",
  "antenatal",
  "maternal-health",
  "newborn",
  "child-health",
  "immunization",
  "child-nutrition",
  "breastfeeding",
  "postpartum",
  "reproductive-health",
  "family-planning",
  "danger-signs",
];

const healthCategorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, enum: CATEGORY_SLUGS },
    name: {
      en: { type: String, required: true },
      ha: { type: String, required: true },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthCategory", healthCategorySchema);
module.exports.CATEGORY_SLUGS = CATEGORY_SLUGS;
