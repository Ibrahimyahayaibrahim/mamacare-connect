const jwt = require("jsonwebtoken");

function generateToken(userId, userType) {
  return jwt.sign({ id: userId, userType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

module.exports = generateToken;
