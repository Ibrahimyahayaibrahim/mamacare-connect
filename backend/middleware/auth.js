const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the JWT and attaches the real, current user record from the
// database to req.user. This is the server-side check that keeps a user
// from ever reading or modifying another user's data - the frontend
// never decides access on its own.
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Not authorized, account not found or disabled" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
}

module.exports = { protect };
