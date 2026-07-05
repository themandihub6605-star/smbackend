const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { goLive, endLive, joinLive } = require("../controllers/liveSession.controller");
const { endAllLiveMeetings } = require("../services/zoom.service");
const Influencer = require("../models/influencer.model");
const LiveSession = require("../models/liveSession.model");
const sendResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

router.post("/go-live", protect, authorizeRoles("influencer"), goLive);
router.patch("/end-live", protect, authorizeRoles("influencer"), endLive);
router.get("/join/:influencerId", joinLive);

// TEMPORARY cleanup route: force-ends every live meeting stuck on the Zoom
// account, and resets our own DB state to match. Remove once stable.
router.post(
  "/cleanup-stuck-meetings",
  asyncHandler(async (req, res) => {
    const endedCount = await endAllLiveMeetings();

    await LiveSession.updateMany(
      { status: "live" },
      { status: "ended", endedAt: new Date() }
    );
    await Influencer.updateMany({ isLive: true }, { isLive: false });

    return sendResponse(res, 200, "Cleanup complete", { endedOnZoom: endedCount });
  })
);

module.exports = router;