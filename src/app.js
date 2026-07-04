const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const corsOptions = require("./config/cors.config");
const routes = require("./routes/index");
const { errorHandler, notFound } = require("./middlewares/error.middleware");

const app = express();

// ----- Global Middlewares -----
app.use(cors(corsOptions)); // CORS check happens here for every request
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // request logging in console, useful for a big project

// ----- Health check -----
app.get("/", (req, res) => {
  res.json({ success: true, message: "Influencer Live Platform API is running" });
});

// ----- API Routes -----
app.use("/api", routes);

// ----- Error Handling (must be last) -----
app.use(notFound);
app.use(errorHandler);

module.exports = app;
