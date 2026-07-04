const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const superAdminRoutes = require("./superAdmin.routes");
const influencerRoutes = require("./influencer.routes");
const liveSessionRoutes = require("./liveSession.routes");

// Final URL structure:
// /api/auth/...
// /api/superadmin/...
// /api/influencer/...
// /api/live/...
router.use("/auth", authRoutes);
router.use("/superadmin", superAdminRoutes);
router.use("/influencer", influencerRoutes);
router.use("/live", liveSessionRoutes);

module.exports = router;
