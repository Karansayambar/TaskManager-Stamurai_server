const {
  createTodo,
  editTodoWithId,
  getTodoById,
  changeCompletedStatus,
  readTask,
  deleteTaskWithId,
  changePriorityStatus,
  readAllUsers,
  readAssignedTask,
} = require("../models/todoModel");
const todoSchema = require("../schemas/todoSchema");
const { todoDataValidation } = require("../utils/todoDataValidation");

const createTodoController = async (req, res) => {
  const { taskTitle, taskDesc, isImportant, dueDate, priority, assignedTo } =
    req.body;
  console.log("create-todo", req.body);
  const userId = req.user._id;

  try {
    await todoDataValidation({ taskTitle });
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }

  try {
    const todoDb = await createTodo({
      taskTitle,
      taskDesc,
      isImportant,
      priority,
      dueDate,
      userId,
      assignedTo,
    });

    return res.status(201).send({
      message: "TODO Created Successfully",
      data: todoDb,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
      error: error,
    });
  }
};
const editTodoController = async (req, res) => {
  const { todoId, taskTitle, taskDesc, dueDate } = req.body;
  const userId = req.user._id;
  console.log("incoming body", req.body);

  try {
    console.log("updated todo", todoId, taskTitle);

    await todoDataValidation({ taskTitle });
    const todoDb = await getTodoById({ todoId });

    if (userId.equals(todoDb.userId))
      return res.send({
        status: 403,
        message: "Not Allowed To Edit The Todo",
      });
    const editTodoDb = await editTodoWithId({
      taskTitle,
      taskDesc,
      dueDate,
      todoId,
    });
    res.status(200).send({
      message: "Todo Updated Successfully",
      data: editTodoDb,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
      error: error,
    });
  }
};

// const getMyTasks = async (req, res) => {
//   const userId = req.user._id;

//   console.log("userid", userId);

//   try {
//     // Find tasks where assignedTo equals userId
//     const usersTasks = await todoSchema.find({ assignedTo: userId });

//     // Send response with found tasks
//     res.status(200).json({
//       message: "Tasks fetched successfully",
//       data: usersTasks,
//     });
//   } catch (error) {
//     // Error handling
//     res.status(500).json({
//       message: "Failed to fetch tasks",
//       error: error.message,
//     });
//   }
// };

const updateCompletedStatus = async (req, res) => {
  const { todoId } = req.body;
  const userId = req.user._id;
  console.log("todoId", todoId);
  try {
    const todoDb = await getTodoById({ todoId });
    console.log("todoId", todoId);
    if (userId.equals(todoDb.userId))
      return res.send({
        status: 403,
        message: "Not Allowed To Edit The Todo",
      });

    const editTodoDb = await changeCompletedStatus({ todoId });
    res.status(200).send({
      message: "Todo Updated Successfully",
      data: editTodoDb,
    });

    console.log("editrd to from completed status", editTodoDb);
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
      error: error,
    });
  }
};

const readTasksController = async (req, res) => {
  const userId = req.user._id;
  try {
    const readDb = await readTask();
    if (readDb.length === 0) {
      return res.status(200).send({
        message: "No TODO Found",
      });
    }
    return res.status(200).send({
      message: "Read Success",
      data: readDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const readAssignToMeTask = async (req, res) => {
  const userId = req.user._id;
  console.log("userId", userId);

  try {
    const usersTasks = await readAssignedTask(userId);
    console.log("usersTasks", usersTasks);
    if (usersTasks.length === 0) {
      return res.status(400).send({
        status: 400,
        message: "No Tasks Found",
      });
    }

    return res.status(200).send({
      status: 200,
      message: "Data fetched successfully",
      data: usersTasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      error: error.message,
    });
  }
};

const getAllRegisterUsers = async (req, res) => {
  const userId = req.userId;
  try {
    const allUsersData = await readAllUsers(userId);
    if (!allUsersData) {
      return res.send({
        staus: 400,
        message: "users not found",
      });
    }
    return res.send({
      staus: 200,
      message: "UsersList",
      allUsersData,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const isImportantTodoController = async (req, res) => {
  const userId = req.user._id;
  const { todoId, status } = req.body;
  try {
    const todoDb = await getTodoById({ todoId });
    if (userId.equals(todoDb.userId))
      return res.send({
        status: 403,
        message: "Not Allowed To Edit The Todo",
      });

    const isImportantTodoDb = await changePriorityStatus({ todoId, status });
    console.log(isImportantTodoDb);

    return res.status(200).send({
      message: "Read Success",
      data: isImportantTodoDb,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error,
    });
  }
};
const deleteTaskController = async (req, res) => {
  const { todoId } = req.body;
  const userId = req.user._id;
  console.log("todoId from delete", todoId);

  try {
    const taskDb = await getTodoById({ todoId });
    if (userId.equals(taskDb.userId)) {
      return res.status(403).send({
        message: "Not Allowed To Delete Blog",
      });
    }
    console.log("i am here");
    const deleteTask = await deleteTaskWithId({ todoId });
    return res.status(200).send({
      message: "task Deleted Successfully",
      data: deleteTask,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
      error: error,
    });
  }
};
module.exports = {
  createTodoController,
  deleteTaskController,
  editTodoController,
  updateCompletedStatus,
  readTasksController,
  isImportantTodoController,
  getAllRegisterUsers,
  readAssignToMeTask,
};
