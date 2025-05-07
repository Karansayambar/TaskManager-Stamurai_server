const todoDataValidation = ({ taskTitle }) => {
  return new Promise((resolve, reject) => {
    if (!taskTitle) reject("Missing todo data");
    if (taskTitle.length < 3 || taskTitle.length > 100)
      reject("Length of todo should be in 3 to 100 characters");
    if (typeof taskTitle !== "string") reject("todo not in text");
    resolve();
  });
};

module.exports = { todoDataValidation };
