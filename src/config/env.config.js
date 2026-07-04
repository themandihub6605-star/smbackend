// Centralized place to read environment variables.
// Import this file everywhere instead of using process.env directly.
// This avoids typos and confusion across a big project.

require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  SUPERADMIN_CLIENT_URL: process.env.SUPERADMIN_CLIENT_URL || "http://localhost:3001",
  INFLUENCER_CLIENT_URL: process.env.INFLUENCER_CLIENT_URL || "http://localhost:3002",

  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  ZOOM_SDK_KEY: process.env.ZOOM_SDK_KEY,
  ZOOM_SDK_SECRET: process.env.ZOOM_SDK_SECRET,
  ZOOM_HOST_EMAIL: process.env.ZOOM_HOST_EMAIL,

  ZOOM_ACCOUNT_ID: process.env.ZOOM_ACCOUNT_ID,
  ZOOM_CLIENT_ID: process.env.ZOOM_CLIENT_ID,
  ZOOM_CLIENT_SECRET: process.env.ZOOM_CLIENT_SECRET,

  SUPERADMIN_EMAIL: process.env.SUPERADMIN_EMAIL,
  SUPERADMIN_PASSWORD: process.env.SUPERADMIN_PASSWORD,
};
