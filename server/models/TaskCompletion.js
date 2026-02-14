const mongoose = require("mongoose");

const taskCompletionSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "missed"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaskCompletion", taskCompletionSchema);
