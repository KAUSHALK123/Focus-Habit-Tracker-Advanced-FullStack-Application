const express = require("express");
const Task = require("../models/Task");
const TaskCompletion = require("../models/TaskCompletion");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /api/tasks - Create task
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      daysOfWeek,
      startDate,
      endDate,
      startTime,
      endTime,
    } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!daysOfWeek || daysOfWeek.length === 0) {
      return res.status(400).json({ message: "daysOfWeek must not be empty" });
    }

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "startDate and endDate are required" });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res
        .status(400)
        .json({ message: "endDate must be greater than or equal to startDate" });
    }

    // Create task
    const task = new Task({
      userId: req.userId,
      title,
      description,
      daysOfWeek,
      startDate,
      endDate,
      startTime,
      endTime,
    });

    await task.save();

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/tasks/today - Get today's tasks
router.get("/today", async (req, res) => {
  try {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0]; // YYYY-MM-DD
    const todayWeekday = today.getDay(); // 0-6

    // Find tasks for today
    const tasks = await Task.find({
      userId: req.userId,
      isDeleted: false,
      startDate: { $lte: today },
      endDate: { $gte: today },
      daysOfWeek: todayWeekday,
    });

    // Attach completion status for each task
    const tasksWithStatus = await Promise.all(
      tasks.map(async (task) => {
        const completion = await TaskCompletion.findOne({
          taskId: task._id,
          userId: req.userId,
          date: todayString,
        });

        return {
          ...task.toObject(),
          completionStatus: completion ? completion.status : null,
        };
      })
    );

    res.json(tasksWithStatus);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/tasks/by-date - Get tasks by specific date
router.get("/by-date", async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date parameter is required" });
    }

    const targetDate = new Date(date);
    const dateString = date; // YYYY-MM-DD
    const weekday = targetDate.getDay(); // 0-6

    // Find tasks for the specified date
    const tasks = await Task.find({
      userId: req.userId,
      isDeleted: false,
      startDate: { $lte: targetDate },
      endDate: { $gte: targetDate },
      daysOfWeek: weekday,
    });

    // Attach completion status for each task
    const tasksWithStatus = await Promise.all(
      tasks.map(async (task) => {
        const completion = await TaskCompletion.findOne({
          taskId: task._id,
          userId: req.userId,
          date: dateString,
        });

        return {
          ...task.toObject(),
          completionStatus: completion ? completion.status : null,
        };
      })
    );

    res.json(tasksWithStatus);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PATCH /api/tasks/:id/complete - Mark task as completed or missed
router.patch("/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["completed", "missed"].includes(status)) {
      return res
        .status(400)
        .json({ message: 'Status must be "completed" or "missed"' });
    }

    // Find task and ensure it belongs to the user
    const task = await Task.findOne({ _id: id, userId: req.userId });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    // Get today's date
    const today = new Date().toISOString().split("T")[0];

    // Create or update TaskCompletion
    const completion = await TaskCompletion.findOneAndUpdate(
      {
        taskId: id,
        userId: req.userId,
        date: today,
      },
      {
        status,
      },
      {
        upsert: true,
        new: true,
      }
    );

    res.json({ message: "Task status updated", completion });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PATCH /api/tasks/:id/toggle-dial - Toggle dial task status
router.patch("/:id/toggle-dial", async (req, res) => {
  try {
    const { id } = req.params;

    // Find task and ensure it belongs to the user
    const task = await Task.findOne({ _id: id, userId: req.userId });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    // If enabling dial task, check count
    if (!task.isDialTask) {
      const dialTaskCount = await Task.countDocuments({
        userId: req.userId,
        isDialTask: true,
        isDeleted: false,
      });

      if (dialTaskCount >= 8) {
        return res
          .status(400)
          .json({ message: "Maximum 8 dial tasks allowed" });
      }
    }

    // Toggle isDialTask
    task.isDialTask = !task.isDialTask;
    await task.save();

    res.json({ message: "Dial task status toggled", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/tasks/:id - Soft delete task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find task and ensure it belongs to the user
    const task = await Task.findOne({ _id: id, userId: req.userId });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    // Soft delete
    task.isDeleted = true;
    task.deletedAt = new Date();
    await task.save();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
