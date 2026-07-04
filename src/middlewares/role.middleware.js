const ApiError = require("../utils/apiError");

// Usage: authorizeRoles("superadmin")  or  authorizeRoles("influencer", "superadmin")
// Must be used AFTER auth.middleware.js (protect) since it needs req.user
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission to access this resource");
    }
    next();
  };
};

module.exports = authorizeRoles;
