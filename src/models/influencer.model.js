const mongoose = require("mongoose");

// One influencer = one registered user who wants to go live.
// status controls whether they are allowed to log in / go live:
//   pending  -> just registered, waiting for Super Admin review
//   accepted -> Super Admin approved, can log in + go live
//   rejected -> Super Admin rejected, cannot log in
const influencerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true, // stored hashed, never plain text
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = mongoose.model("Influencer", influencerSchema);
