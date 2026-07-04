const Influencer = require("../models/influencer.model");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

// @route  GET /api/influencer/me
// @access Private (influencer only)
const getMyProfile = asyncHandler(async (req, res) => {
  const influencer = await Influencer.findById(req.user.id).select("-password");

  if (!influencer) {
    throw new ApiError(404, "Influencer not found");
  }

  return sendResponse(res, 200, "Profile fetched successfully", influencer);
});

// @route  GET /api/influencer/live-list
// @access Public
// Shows all influencers who are CURRENTLY live, for the public website homepage.
const getLiveInfluencers = asyncHandler(async (req, res) => {
  const liveInfluencers = await Influencer.find({ isLive: true }).select(
    "name profileImage isLive"
  );

  return sendResponse(res, 200, "Live influencers fetched successfully", liveInfluencers);
});

module.exports = { getMyProfile, getLiveInfluencers };
