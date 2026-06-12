const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

//
// CREATE TASK
// POST /api/tasks
//
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, status, priority } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }
    const validPriorities = ["low", "medium", "high"];

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Invalid priority"
      });
    }

    const task = await Task.create({
      title,
      status,
      priority,
      createdBy: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//
// GET ALL TASKS
// GET /api/tasks
//
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      createdBy: req.user.id,
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//
// GET SINGLE TASK
// GET /api/tasks/:id
//
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//
// UPDATE TASK
// PUT /api/tasks/:id
//
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id,
      },
      req.body,
      {
        returnDocument: "after",
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//
//
// TOGGLE TASK STATUS
// PATCH /api/tasks/:id
//
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.status =
      task.status === "completed"
        ? "pending"
        : "completed";

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// DELETE TASK
// DELETE /api/tasks/:id
//
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;