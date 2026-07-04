const Influencer = require("../models/influencer.model");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

// @route  GET /api/superadmin/influencers?status=pending
// @access Private (superadmin only)
// Lists influencer registrations. status query is optional filter.
const getAllInfluencers = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const filter = {};
  if (status && ["pending", "accepted", "rejected"].includes(status)) {
    filter.status = status;
  }

  const influencers = await Influencer.find(filter).select("-password").sort({ createdAt: -1 });

  return sendResponse(res, 200, "Influencers fetched successfully", influencers);
});

// @route  GET /api/superadmin/influencers/:id
// @access Private (superadmin only)
const getInfluencerById = asyncHandler(async (req, res) => {
  const influencer = await Influencer.findById(req.params.id).select("-password");

  if (!influencer) {
    throw new ApiError(404, "Influencer not found");
  }

  return sendResponse(res, 200, "Influencer fetched successfully", influencer);
});

// @route  PATCH /api/superadmin/influencers/:id/accept
// @access Private (superadmin only)
const acceptInfluencer = asyncHandler(async (req, res) => {
  const influencer = await Influencer.findById(req.params.id);

  if (!influencer) {
    throw new ApiError(404, "Influencer not found");
  }

  influencer.status = "accepted";
  influencer.rejectionReason = "";
  await influencer.save();

  return sendResponse(res, 200, "Influencer accepted successfully", {
    id: influencer._id,
    status: influencer.status,
  });
});

// @route  PATCH /api/superadmin/influencers/:id/reject
// @access Private (superadmin only)
const rejectInfluencer = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const influencer = await Influencer.findById(req.params.id);

  if (!influencer) {
    throw new ApiError(404, "Influencer not found");
  }

  influencer.status = "rejected";
  influencer.rejectionReason = reason || "Not specified";
  await influencer.save();

  return sendResponse(res, 200, "Influencer rejected", {
    id: influencer._id,
    status: influencer.status,
  });
});

module.exports = {
  getAllInfluencers,
  getInfluencerById,
  acceptInfluencer,
  rejectInfluencer,
};
