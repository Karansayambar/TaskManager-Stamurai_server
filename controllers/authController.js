const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const {
  userDataValidation,
  userDataValidationForLogin,
} = require("../utils/authutils");
const session = require("express-session");
const { getToken } = require("../utils/helper");

const registerController = async (req, res) => {
  const { email, username, password, role } = req.body;
  try {
    console.log("reqbody", req.body);
    await userDataValidation({ email, username, password, role });

    // Create a new user object
    const userModelObj = new User({ email, username, password, role });

    // Register the user
    const userDB = await userModelObj.registerUser();
    console.log("userDB", userDB);
    return res.status(201).send({
      message: "User Registered Successfully",
      data: userDB,
    });
  } catch (error) {
    return res.status(400).send({
      message: "Invalid User",
      error: error.message || error,
    });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    await userDataValidationForLogin({ email, password });

    const userDB = await User.findUserWithKey({ key: email });

    // Check if password matches
    const isMatched = await bcrypt.compare(password, userDB.password);
    if (!isMatched) {
      return res.status(400).send({
        message: "Incorrect password",
      });
    }

    const token = getToken(userDB?._id);
    const user = userDB.toJSON();
    delete user.password;

    return res.status(200).send({
      message: "User Logged In Successfully",
      data: user,
      role: user.role,
      token,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
};

const logoutController = async (req, res) => {
  return res.status(400).send({
    message: "Logout Successful",
    status: true,
  });
};

module.exports = { registerController, loginController, logoutController };
