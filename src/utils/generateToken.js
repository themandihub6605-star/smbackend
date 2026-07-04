const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/env.config");

// id -> user's Mongo _id, role -> "influencer" or "superadmin"
// role is embedded in token so middleware can check permissions
// without another DB call every time.
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

module.exports = generateToken;
