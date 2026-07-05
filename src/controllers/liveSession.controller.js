const Influencer = require("../models/influencer.model");
const LiveSession = require("../models/liveSession.model");
const { createZoomMeeting, endZoomMeeting } = require("../services/zoom.service");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const goLive = asyncHandler(async (req, res) => {
  const influencer = await Influencer.findById(req.user.id);

  if (!influencer) {
    throw new ApiError(404, "Influencer not found");
  }

  if (influencer.status !== "accepted") {
    throw new ApiError(403, "Only approved influencers can go live");
  }

  const staleSessions = await LiveSession.find({
    influencer: influencer._id,
    status: "live",
  });

  for (const stale of staleSessions) {
    try {
      await endZoomMeeting(stale.zoomMeetingId);
    } catch (err) {}
    stale.status = "ended";
    stale.endedAt = new Date();
    await stale.save();
  }

  const zoomMeeting = await createZoomMeeting(`${influencer.name} - Live`);

  const session = await LiveSession.create({
    influencer: influencer._id,
    title: `${influencer.name} - Live`,
    zoomMeetingId: zoomMeeting.meetingId,
    zoomMeetingPassword: zoomMeeting.password,
    zoomJoinUrl: zoomMeeting.joinUrl,
    zoomStartUrl: zoomMeeting.startUrl,
    status: "live",
  });

  influencer.isLive = true;
  await influencer.save();

  return sendResponse(res, 201, "You are now live", {
    sessionId: session._id,
    startUrl: zoomMeeting.startUrl,
  });
});

const endLive = asyncHandler(async (req, res) => {
  const influencer = await Influencer.findById(req.user.id);

  if (!influencer) {
    throw new ApiError(404, "Influencer not found");
  }

  const liveSessions = await LiveSession.find({
    influencer: influencer._id,
    status: "live",
  });

  for (const session of liveSessions) {
    try {
      await endZoomMeeting(session.zoomMeetingId);
    } catch (err) {}
    session.status = "ended";
    session.endedAt = new Date();
    await session.save();
  }

  influencer.isLive = false;
  await influencer.save();

  return sendResponse(res, 200, "Live session ended successfully");
});

const joinLive = asyncHandler(async (req, res) => {
  const { influencerId } = req.params;

  const session = await LiveSession.findOne({
    influencer: influencerId,
    status: "live",
  }).sort({ startedAt: -1 });

  if (!session) {
    throw new ApiError(404, "This influencer is not live right now");
  }

  return sendResponse(res, 200, "Join details fetched successfully", {
    joinUrl: session.zoomJoinUrl,
  });
});

module.exports = { goLive, endLive, joinLive };