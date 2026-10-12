const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    preferredLanguage: {
      type: String,
      enum: ["en", "ha"],
      default: "en",
    },
    // "user" = pregnant woman / mother / caregiver, "clinic" = healthcare
    // facility staff, "admin" = MamaCare administrator. Admin accounts are
    // never created through public signup — see controllers/authController.js
    userType: {
      type: String,
      enum: ["user", "clinic", "admin"],
      default: "user",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    // Set by admin only, for clinic accounts pending verification.
    clinicVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function matchPassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    preferredLanguage: this.preferredLanguage,
    userType: this.userType,
    clinicVerified: this.clinicVerified,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
