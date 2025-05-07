const express = require("express");
const { registerController, loginController, logoutController } = require("../controllers/authController");
const isAuth = require("../middlewares/isAuthMiddleware");
const passport = require("passport");
const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/logout", passport.authenticate('user',{session:false}),   logoutController);


module.exports = authRouter;
