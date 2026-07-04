const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { goLive, endLive, joinLive } = require("../controllers/liveSession.controller");

// Only accepted influencers (checked inside controller) can start/end live
router.post("/go-live", protect, authorizeRoles("influencer"), goLive);
router.patch("/end-live", protect, authorizeRoles("influencer"), endLive);

// Public - any user on the website can join a live influencer's session
router.get("/join/:influencerId", joinLive);

module.exports = router;
