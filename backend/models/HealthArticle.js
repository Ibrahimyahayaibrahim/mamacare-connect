const mongoose = require("mongoose");

const healthArticleSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true },
      ha: { type: String, required: true },
    },
    content: {
      en: { type: String, required: true },
      ha: { type: String, required: true },
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "HealthCategory", required: true },
    source: { type: String, trim: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

healthArticleSchema.index({ "title.en": "text", "title.ha": "text", "content.en": "text", "content.ha": "text" });

module.exports = mongoose.model("HealthArticle", healthArticleSchema);
