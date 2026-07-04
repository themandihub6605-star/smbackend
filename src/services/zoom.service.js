const axios = require("axios");
const {
  ZOOM_ACCOUNT_ID,
  ZOOM_CLIENT_ID,
  ZOOM_CLIENT_SECRET,
  ZOOM_HOST_EMAIL,
} = require("../config/env.config");

// STEP 1: Get a short-lived access token from Zoom using
// Server-to-Server OAuth (no manual Zoom login needed, fully automated).
const getZoomAccessToken = async () => {
  try {
    const response = await axios.post(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`,
      {},
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString("base64"),
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("[Zoom OAuth Error]", error.response?.data || error.message);
    throw error;
  }
};

// STEP 2: Create a new Zoom meeting for a given influencer.
const createZoomMeeting = async (topic) => {
  const accessToken = await getZoomAccessToken();

  try {
    const response = await axios.post(
      `https://api.zoom.us/v2/users/${ZOOM_HOST_EMAIL}/meetings`,
      {
        topic: topic || "Live Session",
        type: 1,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          waiting_room: false,
          approval_type: 2,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      meetingId: response.data.id,
      password: response.data.password,
      joinUrl: response.data.join_url,
    };
  } catch (error) {
    console.error("[Zoom Create Meeting Error]", error.response?.data || error.message);
    throw error;
  }
};

// STEP 3: End a Zoom meeting when influencer stops going live.
const endZoomMeeting = async (meetingId) => {
  const accessToken = await getZoomAccessToken();

  try {
    await axios.put(
      `https://api.zoom.us/v2/meetings/${meetingId}/status`,
      { action: "end" },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("[Zoom End Meeting Error]", error.response?.data || error.message);
    if (error.response?.status !== 404 && error.response?.status !== 400) {
      throw error;
    }
  }
};

module.exports = { getZoomAccessToken, createZoomMeeting, endZoomMeeting };