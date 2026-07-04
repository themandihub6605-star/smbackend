const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const {
  getAllInfluencers,
  getInfluencerById,
  acceptInfluencer,
  rejectInfluencer,
} = require("../controllers/superAdmin.controller");

// All routes below require: logged in + role === "superadmin"
router.use(protect, authorizeRoles("superadmin"));

router.get("/influencers", getAllInfluencers);
router.get("/influencers/:id", getInfluencerById);
router.patch("/influencers/:id/accept", acceptInfluencer);
router.patch("/influencers/:id/reject", rejectInfluencer);

module.exports = router;
