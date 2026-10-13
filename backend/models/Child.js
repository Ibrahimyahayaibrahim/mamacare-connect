const mongoose = require("mongoose");

const childSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    sex: { type: String, enum: ["male", "female"], required: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Child", childSchema);
