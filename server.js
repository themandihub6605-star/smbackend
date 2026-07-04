const app = require("./src/app");
const connectDB = require("./src/config/db.config");
const { PORT } = require("./src/config/env.config");

// 1. Connect to MongoDB
// 2. Start Express server only after DB connection succeeds
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
  });
});
