const { reject } = require("bcrypt/promises");
const todoSchema = require("../schemas/todoSchema");
const { findOneAndUpdate } = require("../schemas/userSchema");
const { todoDataValidation } = require("../utils/todoDataValidation");
const userSchema = require("../schemas/userSchema");
const ObjectId = require("mongodb").ObjectId;

const createTodo = ({
  taskTitle,
  taskDesc,
  isImportant,
  priority,
  dueDate,
  userId,
  assignedTo,
}) => {
  return new Promise((resolve, reject) => {
    const todoObj = new todoSchema({
      taskTitle,
      taskDesc,
      isImportant,
      priority,
      dueDate: dueDate || null,
      userId,
      assignedTo,
      assignedBy: userId,
    });

    todoObj.save().then(resolve).catch(reject);
  });
};

const getTodoById = ({ todoId }) => {
  return new Promise(async (resolve, reject) => {
    console.log("todoID", todoId);
    console.log("todo details", todoId);
    if (!todoDataValidation) reject("Missing Blog");
    if (!ObjectId.isValid(todoId)) reject("Incorrect TaskId");
    try {
      const todoDB = await todoSchema.findOne({ _id: todoId });
      if (!todoDB) reject(`Todo Not Found with this ID${todoId}`);
      return resolve(todoDB);
    } catch (error) {
      return reject(error);
    }
  });
};

const changeCompletedStatus = ({ todoId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("todoId from promise", todoId);
      const updateTodo = await todoSchema.findOneAndUpdate(
        { _id: todoId },
        {
          isCompleted: true,
        }
      );
      return resolve(updateTodo);
    } catch (error) {
      reject(error);
    }
  });
};

const readAssignedTask = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("assignedTo", assignedTo);
      const tasks = await todoSchema
        .find({ assignedTo: userId })
        .populate({
          path: "assignedBy",
          select: "username email",
          model: "User",
        })
        .lean(); // Convert to plain JavaScript objects;
      if (!tasks) {
        reject("No Tasks found");
      }
      console.log("tasks from read assigned tasks", tasks);
      resolve(tasks);
    } catch (error) {
      reject(error);
    }
  });
};

const editTodoWithId = ({
  taskTitle,
  taskDesc,
  isImportant,
  priority,
  dueDate,
  todoId,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const todoDb = await todoSchema.findOneAndUpdate(
        { _id: todoId },
        {
          taskTitle: taskTitle,
          taskDesc: taskDesc,
          isImportant: isImportant,
          priority: priority,
          dueDate: dueDate,
        }
      );
      resolve(todoDb);
    } catch (error) {
      reject(error);
    }
  });
};

const readAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const allRegisterUsers = userSchema
        .find({
          role: { $ne: "admin" },
        })
        .select("name email");
      resolve(allRegisterUsers);
    } catch (error) {
      reject(error);
    }
  });
};

// const readTask = () => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const todoDb = await todoSchema.aggregate([
//         {
//           $match: { userId: userId },
//         },
//         {
//           $addFields: {
//             priorityOrder: {
//               $switch: {
//                 branches: [
//                   { case: { $eq: ["$priority", "High"] }, then: 1 },
//                   { case: { $eq: ["$priority", "Medium"] }, then: 2 },
//                   { case: { $eq: ["$priority", "Low"] }, then: 3 },
//                 ],
//                 default: 4,
//               },
//             },
//             // Create a new field to ensure completed tasks are last
//             sortOrder: {
//               $cond: { if: { $eq: ["$isCompleted", true] }, then: 1, else: 0 },
//             },
//           },
//         },
//         {
//           $sort: {
//             sortOrder: 1, // Ensure completed tasks are last
//             dueDate: 1, // Sort by dueDate in ascending order
//             priorityOrder: 1, // Sort by priorityOrder
//           },
//         },
//         {
//           $project: {
//             priorityOrder: 0, // Remove the temporary field from the output
//             sortOrder: 0, // Remove the temporary field from the output
//           },
//         },
//       ]);
//       return resolve(todoDb);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

const readTask = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const todoDb = await todoSchema.aggregate([
        {
          $addFields: {
            priorityOrder: {
              $switch: {
                branches: [
                  { case: { $eq: ["$priority", "High"] }, then: 1 },
                  { case: { $eq: ["$priority", "Medium"] }, then: 2 },
                  { case: { $eq: ["$priority", "Low"] }, then: 3 },
                ],
                default: 4,
              },
            },
            sortOrder: {
              $cond: { if: { $eq: ["$isCompleted", true] }, then: 1, else: 0 },
            },
          },
        },
        {
          $sort: {
            sortOrder: 1,
            dueDate: 1,
            priorityOrder: 1,
          },
        },
        {
          $project: {
            priorityOrder: 0,
            sortOrder: 0,
          },
        },
      ]);

      resolve(todoDb);
    } catch (error) {
      reject(error);
    }
  });
};

const changePriorityStatus = ({ todoId, status }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updateTodo = await todoSchema.findOneAndUpdate(
        { _id: todoId },
        {
          priority: status ? "High" : "Low",
          isImportant: status,
        }
      );
      return resolve(updateTodo);
    } catch (error) {
      return reject(error);
    }
  });
};

const deleteTaskWithId = ({ todoId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("todoid from delete promise", todoId);
      const todoDb = await todoSchema.findOneAndDelete({ _id: todoId });
      resolve(todoDb);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createTodo,
  editTodoWithId,
  getTodoById,
  changeCompletedStatus,
  readTask,
  deleteTaskWithId,
  changePriorityStatus,
  readAllUsers,
  readAssignedTask,
};
