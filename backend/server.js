const express = require("express");
const cors = require("cors");
const connectDB = require("./config/MongoDB");
const connectCloudinary = require("./config/Cloudinary");
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

const _dirname = path.resolve();

// ✅ Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// ✅ Connect to MongoDB and Cloudinary
connectDB();
connectCloudinary();

// ✅ Define Frontend & Admin Panel Paths
const frontendPath = path.join(_dirname, "frontend", "dist");
const adminPath = path.join(_dirname, "admin-panel", "dist");

// ✅ Serve Frontend Static Files with Correct MIME Types
app.use(
  express.static(frontendPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
      if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
      }
      if (filePath.endsWith(".mjs")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);

// ✅ Serve Admin Panel Static Files with Correct MIME Types
app.use(
  "/admin",
  express.static(adminPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
      if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
      }
      if (filePath.endsWith(".mjs")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);

// ✅ API Routes
const adminRouter = require("./routes/adminRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const userRouter = require("./routes/userRoutes");

app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

// ✅ Catch-All Routes (Frontend & Admin Panel)
app.get("*", (req, res) => {
  if (req.originalUrl.startsWith("/admin")) {
    res.sendFile(path.join(adminPath, "index.html"));
  } else {
    res.sendFile(path.join(frontendPath, "index.html"));
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
