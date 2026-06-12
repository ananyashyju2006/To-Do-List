const express = require("express");
const app = express();
const PORT = 3000;
// Middleware
app.use(express.json());
// Custom Logger Middleware
app.use((req, res, next) => {
    console.log(
        `[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`
    );
    next();
});
// Health Endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        timestamp: new Date()
    });
});

// Tasks Endpoint
app.get("/api/tasks", (req, res) => {
    const tasks = [
        {
            id: 1,
            title: "Learn Node.js",
            completed: false
        },
        {
            id: 2,
            title: "Learn Express",
            completed: true
        },
        {
            id: 3,
            title: "Build REST API",
            completed: false
        }
    ];

    res.status(200).json(tasks);
});

// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to Task API");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});