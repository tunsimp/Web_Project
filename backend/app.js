const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const indexRoutes = require("./routes/indexRoutes");
const lessonRoutes = require("./routes/lessonRoutes"); // Add this line

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

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/route", indexRoutes);
app.use("/api/lessons", lessonRoutes); // Add this line

// Handle 404 if route is not defined
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port localhost:${port}`);
});
