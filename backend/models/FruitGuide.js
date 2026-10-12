const mongoose = require("mongoose");

const fruitGuideSchema = new mongoose.Schema(
  {
    name: { en: { type: String, required: true }, ha: { type: String, required: true } },
    benefits: { en: { type: String, required: true }, ha: { type: String, required: true } },
    preparation: { en: { type: String, required: true }, ha: { type: String, required: true } },
    chokingSafety: { en: { type: String, required: true }, ha: { type: String, required: true } },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FruitGuide", fruitGuideSchema);
