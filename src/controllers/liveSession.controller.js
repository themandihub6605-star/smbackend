const Influencer = require("../models/influencer.model");
const LiveSession = require("../models/liveSession.model");
const { createZoomMeeting, endZoomMeeting } = require("../services/zoom.service");
const generateZoomSignature = require("../utils/zoomSignature");
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

  // Clean up any stale "live" sessions left over from a previous failed
  // end-live attempt, so we never have two "live" sessions for one influencer.
  const staleSessions = await LiveSession.find({
    influencer: influencer._id,
    status: "live",
  });

  for (const stale of staleSessions) {
    try {
      await endZoomMeeting(stale.zoomMeetingId);
    } catch (err) {
      // Ignore - the meeting may already be gone on Zoom's side
    }
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
    status: "live",
  });

  influencer.isLive = true;
  await influencer.save();

  const signature = generateZoomSignature(zoomMeeting.meetingId, 1);

  return sendResponse(res, 201, "You are now live", {
    sessionId: session._id,
    meetingNumber: zoomMeeting.meetingId,
    password: zoomMeeting.password,
    sdkKey: process.env.ZOOM_SDK_KEY,
    signature,
    role: 1,
  });
});

const endLive = asyncHandler(async (req, res) => {
  const influencer = await Influencer.findById(req.user.id);

  if (!influencer) {
    throw new ApiError(404, "Influencer not found");
  }

  // Always end EVERY "live" session for this influencer (not just one),
  // so no stale session is ever left behind.
  const liveSessions = await LiveSession.find({
    influencer: influencer._id,
    status: "live",
  });

  for (const session of liveSessions) {
    try {
      await endZoomMeeting(session.zoomMeetingId);
    } catch (err) {
      // Ignore - the meeting may already be gone on Zoom's side
    }
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

  // Always pick the MOST RECENT live session, in case a stale one exists
  const session = await LiveSession.findOne({
    influencer: influencerId,
    status: "live",
  }).sort({ startedAt: -1 });

  if (!session) {
    throw new ApiError(404, "This influencer is not live right now");
  }

  const signature = generateZoomSignature(session.zoomMeetingId, 0);

  return sendResponse(res, 200, "Join details fetched successfully", {
    meetingNumber: session.zoomMeetingId,
    password: session.zoomMeetingPassword,
    sdkKey: process.env.ZOOM_SDK_KEY,
    signature,
    role: 0,
  });
});

module.exports = { goLive, endLive, joinLive };