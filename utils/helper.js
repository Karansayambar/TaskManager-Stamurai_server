const jwt = require("jsonwebtoken");

const getToken = (userID) => {
  return jwt.sign({ identifier: userID }, "hgfhghgfh65tgfhg6");
};

module.exports = { getToken };
