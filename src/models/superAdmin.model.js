const mongoose = require("mongoose");

// Only super admin(s) exist here. There is no separate "admin" table -
// as per the finalized flow: Influencer registers -> Super Admin approves.
const superAdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
