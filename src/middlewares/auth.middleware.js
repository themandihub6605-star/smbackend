const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.config");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

// Checks Authorization header: "Bearer <token>"
// On success, attaches req.user = { id, role }
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized, token missing");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (error) {
    throw new ApiError(401, "Not authorized, invalid or expired token");
  }
});

module.exports = protect;
