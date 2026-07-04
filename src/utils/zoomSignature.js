const jwt = require("jsonwebtoken");
const { ZOOM_SDK_KEY, ZOOM_SDK_SECRET } = require("../config/env.config");

// Generates the signature required by Zoom Meeting SDK to join a meeting
// embedded inside our OWN website UI (no zoom.us page shown to user).
// role: 0 = attendee/viewer, 1 = host (the influencer)
const generateZoomSignature = (meetingNumber, role) => {
  const iat = Math.round(Date.now() / 1000) - 30;
  const exp = iat + 60 * 60 * 2; // token valid for 2 hours

  const payload = {
    sdkKey: ZOOM_SDK_KEY,
    mn: String(meetingNumber),
    role,
    iat,
    exp,
    tokenExp: exp,
  };

  return jwt.sign(payload, ZOOM_SDK_SECRET, {
    algorithm: "HS256",
    header: { alg: "HS256", typ: "JWT" },
  });
};

module.exports = generateZoomSignature;