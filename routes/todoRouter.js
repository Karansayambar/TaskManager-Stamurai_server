const express = require("express");
const isAuth = require("../middlewares/isAuthMiddleware");
const {
  createTodoController,
  editTodoController,
  updateCompletedStatus,
  readTasksController,
  deleteTaskController,
  isImportantTodoController,
  getAllRegisterUsers,
  readAssignToMeTask,
  getMyTasks,
} = require("../controllers/todoController");
const passport = require("passport");
const todoRouter = express.Router();

todoRouter.post(
  "/create-todo",
  passport.authenticate("user", { session: false }),
  createTodoController
);
todoRouter.post(
  "/edit-todo",
  passport.authenticate("user", { session: false }),
  editTodoController
);
todoRouter.post(
  "/changeCompletedStatus",
  passport.authenticate("user", { session: false }),
  updateCompletedStatus
);
todoRouter.get(
  "/read-todo",
  passport.authenticate("user", { session: false }),
  readTasksController
);
todoRouter.post(
  "/delete-todo",
  passport.authenticate("user", { session: false }),
  deleteTaskController
);
todoRouter.post(
  "/changeImportanceStatus",
  passport.authenticate("user", { session: false }),
  isImportantTodoController
);
todoRouter.get(
  "/readAllusers",
  //   passport.authenticate("user", { session: false }),
  getAllRegisterUsers
);
todoRouter.get(
  "/readAssignTask",
  passport.authenticate("user", { session: false }),
  readAssignToMeTask
);
// todoRouter.get(
//   "/getMyTasks",
//   passport.authenticate("user", { session: false }),
//   getMyTasks
// );
module.exports = todoRouter;
