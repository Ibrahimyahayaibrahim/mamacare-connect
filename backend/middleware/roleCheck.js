// Restricts a route to one or more userType values, e.g.
// router.get("/admin/stats", protect, allowRoles("admin"), handler)
//
// Every Admin-only and Clinic-only route in the API must use this (or an
// equivalent server-side check) - never rely on the frontend simply
// hiding a menu item, per the project's security requirement.
function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.userType)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
}

module.exports = { allowRoles };
