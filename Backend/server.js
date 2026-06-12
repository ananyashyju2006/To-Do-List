require("dotenv").config();
const cors = require("cors");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const errorHandler = require("./middleware/errorHandler");
const express = require("express");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();
app.use(errorHandler);
app.use(express.json());
app.use(cors({
  orgin: "http://localhost:5173",
  credentials: true
}));
// ROUTES
app.use("/api/tasks", taskRoutes);
app.use("/api/auth",authRoutes);
app.use(errorHandler);
// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Server is running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});