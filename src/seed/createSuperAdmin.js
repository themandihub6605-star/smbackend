// Run this ONE TIME to create your first Super Admin login:
//   node src/seed/createSuperAdmin.js
// Reads name/email/password from .env (SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD)

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("../config/db.config");
const { SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD } = require("../config/env.config");
const SuperAdmin = require("../models/superAdmin.model");

const run = async () => {
  await connectDB();

  const existing = await SuperAdmin.findOne({ email: SUPERADMIN_EMAIL });
  if (existing) {
    console.log("[Seed] Super Admin already exists. Skipping.");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(SUPERADMIN_PASSWORD, 10);

  await SuperAdmin.create({
    name: "Super Admin",
    email: SUPERADMIN_EMAIL,
    password: hashedPassword,
  });

  console.log("[Seed] Super Admin created successfully:", SUPERADMIN_EMAIL);
  process.exit(0);
};

run();
