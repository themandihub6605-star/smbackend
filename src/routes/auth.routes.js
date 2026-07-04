const express = require("express");
const router = express.Router();
const {
  registerInfluencer,
  loginInfluencer,
  loginSuperAdmin,
} = require("../controllers/auth.controller");

router.post("/influencer/register", registerInfluencer);
router.post("/influencer/login", loginInfluencer);
router.post("/superadmin/login", loginSuperAdmin);

module.exports = router;
