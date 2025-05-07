const mongoose = require("mongoose");
const userSchema = require("./userSchema");
const Schema = mongoose.Schema;

const todoSchema = new Schema(
  {
    taskTitle: {
      type: String,
      required: true,
      minLength: 3,
      maxlength: 100,
      trim: true,
    },
    taskDesc: {
      type: String,
      required: true,
      minLength: 3,
      maxlength: 100,
      trim: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isImportant: {
      type: Boolean,
    },
    dueDate: {
      type: Date,
      default: Date.now(),
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: true,
    },
    status: {
      type: String,
    },
    reccurinType: {
      type: String,
      enum: ["daily", "monthly", "weekly"],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Todo", todoSchema);
