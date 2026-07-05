const mongoose = require("mongoose");

// Every time an influencer clicks "Go Live", one document is created here.
// This lets MULTIPLE influencers go live at the SAME TIME, each with their
// own separate Zoom meeting (separate meetingNumber + password).
const liveSessionSchema = new mongoose.Schema(
  {
    influencer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Influencer",
      required: true,
    },
    title: {
      type: String,
      default: "Live Session",
    },
    zoomMeetingId: {
      type: String, // Zoom's numeric meeting ID
      required: true,
    },
    zoomMeetingPassword: {
      type: String,
      required: true,
    },
    zoomJoinUrl: {
      type: String, // real Zoom link given to viewers
    },
    zoomStartUrl: {
      type: String, // real Zoom link given to the influencer (host) to start the meeting
    },
    status: {
      type: String,
      enum: ["live", "ended"],
      default: "live",
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LiveSession", liveSessionSchema);