const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// POST /api/auth/signup
// Public signup can only create "user" or "clinic" accounts. Admin
// accounts must be created directly in the database or by an existing
// admin - never through this open endpoint.
async function signup(req, res) {
  try {
    const { name, email, phone, password, preferredLanguage, userType } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "name, email, phone and password are required" });
    }

    if (userType === "admin") {
      return res.status(403).json({ message: "Admin accounts cannot be created through signup" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      preferredLanguage: preferredLanguage === "ha" ? "ha" : "en",
      userType: userType === "clinic" ? "clinic" : "user",
    });

    const token = generateToken(user._id, user.userType);
    res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: "This account has been disabled" });
    }

    const token = generateToken(user._id, user.userType);
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
}

// POST /api/auth/logout
function logout(req, res) {
  res.json({ message: "Logged out. Discard the token on the client." });
}

// GET /api/auth/me
async function getMe(req, res) {
  res.json({ user: req.user.toSafeObject() });
}

// PUT /api/auth/me
async function updateMe(req, res) {
  try {
    const { name, phone, preferredLanguage } = req.body;
    if (name) req.user.name = name;
    if (phone) req.user.phone = phone;
    if (preferredLanguage === "en" || preferredLanguage === "ha") {
      req.user.preferredLanguage = preferredLanguage;
    }
    await req.user.save();
    res.json({ user: req.user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
}

// POST /api/auth/forgot-password
// Generates a reset token, returned directly in the response for now so
// you can test the flow without an email provider. Wire an email/SMS
// provider before real users touch this (see README) and send the
// token there instead of returning it.
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user) {
      return res.json({ message: "If that email exists, a reset link has been generated" });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    await user.save();

    res.json({
      message: "If that email exists, a reset link has been generated",
      devOnlyResetToken: rawToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Request failed", error: err.message });
  }
}

// POST /api/auth/reset-password
async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "token and newPassword are required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpire");

    if (!user) {
      return res.status(400).json({ message: "Reset link is invalid or has expired" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password has been reset. You can now log in." });
  } catch (err) {
    res.status(500).json({ message: "Reset failed", error: err.message });
  }
}

module.exports = { signup, login, logout, getMe, updateMe, forgotPassword, resetPassword };
