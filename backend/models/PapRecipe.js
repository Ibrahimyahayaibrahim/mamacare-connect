const mongoose = require("mongoose");

const papRecipeSchema = new mongoose.Schema(
  {
    name: { en: { type: String, required: true }, ha: { type: String, required: true } },
    ingredients: { en: [String], ha: [String] },
    steps: { en: [String], ha: [String] },
    ageSuitability: { en: { type: String, required: true }, ha: { type: String, required: true } },
    nutritionBenefit: { en: { type: String, required: true }, ha: { type: String, required: true } },
    storageAdvice: { en: { type: String, required: true }, ha: { type: String, required: true } },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PapRecipe", papRecipeSchema);
