const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const indexRoutes = require("./routes/indexRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const checkAuth = require("./middleware/checkAuth");
const app = express();

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:4000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Auth routes (no authentication required)
app.use("/api/auth", authRoutes);

// Protected routes (authentication required)
app.use("/api/route", checkAuth, indexRoutes);
app.use("/api/lessons", checkAuth, lessonRoutes);

// Handle 404 if route is not defined
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port localhost:${port}`);
});
