const bcrypt = require("bcryptjs");
const Influencer = require("../models/influencer.model");
const SuperAdmin = require("../models/superAdmin.model");
const generateToken = require("../utils/generateToken");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

// @route  POST /api/auth/influencer/register
// @access Public
// Influencer signs up. Status defaults to "pending" until Super Admin acts.
const registerInfluencer = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  const existing = await Influencer.findOne({ email });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const influencer = await Influencer.create({
    name,
    email,
    phone,
    password: hashedPassword,
    status: "pending",
  });

  return sendResponse(res, 201, "Registration successful. Waiting for Super Admin approval.", {
    id: influencer._id,
    name: influencer.name,
    email: influencer.email,
    status: influencer.status,
  });
});

// @route  POST /api/auth/influencer/login
// @access Public
// Only "accepted" influencers are allowed to log in.
const loginInfluencer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const influencer = await Influencer.findOne({ email });
  if (!influencer) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, influencer.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (influencer.status === "pending") {
    throw new ApiError(403, "Your account is still pending Super Admin approval");
  }

  if (influencer.status === "rejected") {
    throw new ApiError(403, "Your account request was rejected by Super Admin");
  }

  const token = generateToken(influencer._id, "influencer");

  return sendResponse(res, 200, "Login successful", {
    token,
    influencer: {
      id: influencer._id,
      name: influencer.name,
      email: influencer.email,
      status: influencer.status,
    },
  });
});

// @route  POST /api/auth/superadmin/login
// @access Public
const loginSuperAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const superAdmin = await SuperAdmin.findOne({ email });
  if (!superAdmin) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, superAdmin.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(superAdmin._id, "superadmin");

  return sendResponse(res, 200, "Login successful", {
    token,
    superAdmin: {
      id: superAdmin._id,
      name: superAdmin.name,
      email: superAdmin.email,
    },
  });
});

module.exports = { registerInfluencer, loginInfluencer, loginSuperAdmin };
