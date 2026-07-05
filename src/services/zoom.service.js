const axios = require("axios");
const {
  ZOOM_ACCOUNT_ID,
  ZOOM_CLIENT_ID,
  ZOOM_CLIENT_SECRET,
  ZOOM_HOST_EMAIL,
} = require("../config/env.config");

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
      joinUrl: response.data.join_url, // real Zoom link viewers use to join
      startUrl: response.data.start_url, // real Zoom link the host uses to start as host
    };
  } catch (error) {
    console.error("[Zoom Create Meeting Error]", error.response?.data || error.message);
    throw error;
  }
};

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
    console.log(`[Zoom] Meeting ${meetingId} ended successfully`);
  } catch (error) {
    console.error(
      `[Zoom End Meeting Error] meetingId=${meetingId}`,
      error.response?.data || error.message
    );
    if (error.response?.status !== 404 && error.response?.status !== 400) {
      throw error;
    }
  }
};

// One-time cleanup helper: lists every currently LIVE meeting under the
// host account and force-ends them. Useful for clearing meetings stuck
// active from earlier bugs/testing that block new "Go Live" attempts.
const endAllLiveMeetings = async () => {
  const accessToken = await getZoomAccessToken();

  const response = await axios.get(
    `https://api.zoom.us/v2/users/${ZOOM_HOST_EMAIL}/meetings?type=live&page_size=100`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  const liveMeetings = response.data.meetings || [];
  console.log(`[Zoom Cleanup] Found ${liveMeetings.length} live meeting(s)`);

  for (const meeting of liveMeetings) {
    await endZoomMeeting(meeting.id);
  }

  return liveMeetings.length;
};

module.exports = { getZoomAccessToken, createZoomMeeting, endZoomMeeting, endAllLiveMeetings };