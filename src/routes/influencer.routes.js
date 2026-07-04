const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { getMyProfile, getLiveInfluencers } = require("../controllers/influencer.controller");

// Public route - anyone visiting the website can see who is live
router.get("/live-list", getLiveInfluencers);

// Private route - influencer's own profile
router.get("/me", protect, authorizeRoles("influencer"), getMyProfile);

module.exports = router;
