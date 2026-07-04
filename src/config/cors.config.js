const { CLIENT_URL, SUPERADMIN_CLIENT_URL, INFLUENCER_CLIENT_URL } = require("./env.config");

// We have 3 frontends (Public website, Influencer panel, Super Admin panel).
// Only these origins are allowed to call the API. Add more here if you
// create another frontend later - do NOT use "*" in production.
const allowedOrigins = [CLIENT_URL, SUPERADMIN_CLIENT_URL, INFLUENCER_CLIENT_URL];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman, mobile apps, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true, // allow cookies / auth headers
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = corsOptions;