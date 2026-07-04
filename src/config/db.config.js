const mongoose = require("mongoose");
const { MONGO_URI } = require("./env.config");

// Connects to MongoDB. Called once when server starts (server.js).
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection failed: ${error.message}`);
    process.exit(1); // stop server if DB fails - no point running without DB
  }
};

module.exports = connectDB;
