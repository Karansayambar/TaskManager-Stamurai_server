// Package Imports
const express = require("express");
const cors = require("cors");
// Files Imports
const authRouter = require("./routes/authRouter");
const todoRouter = require("./routes/todoRouter");
const { ExtractJwt, Strategy } = require("passport-jwt");
const passport = require("passport");
const userSchema = require("./schemas/userSchema");
const cookieParser = require("cookie-parser");
const db = require("./db"); // Assuming this connects to your MongoDB
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 8000; // Default to 3000 if PORT is not defined

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    // origin: "https://task-manager-stamurai-client.vercel.app", //Frontend URL
    origin: "http://localhost:3000",
    credentials: true, // Allow credentials (cookies, headers)
  })
);

app.set("trust proxy", 1);

app.get("/", (req, res) => {
  res.send({ msg: "Everything is working good!" });
});

//Strategy for User
const userOpts = {};
userOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
userOpts.secretOrKey = "hgfhghgfh65tgfhg6";

passport.use(
  "user",
  new Strategy(userOpts, async (jwt_payload, done) => {
    try {
      const user = await userSchema.findOne({ _id: jwt_payload.identifier });
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err, false);
    }
  })
);

app.use("/auth", authRouter);
app.use("/todo", todoRouter);

// Create HTTP Server
const httpServer = http.createServer(app);

// // Initialize Socket.io
// const io = new Server(httpServer, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // Socket.io Authentication Middleware
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) {
//     return next(new Error("Authentication error"));
//   }

//   jwt.verify(token, "hgfhghgfh65tgfhg6", (err, decoded) => {
//     if (err) return next(new Error("Authentication error"));
//     socket.userId = decoded.identifier;
//     next();
//   });
// });

// Socket.io Connection Handler
// io.on("connection", (socket) => {
//   console.log(`New client connected: ${socket.id} (User: ${socket.userId})`);

//   // Join user's personal room
//   socket.join(socket.userId);

//   // Handle task updates
//   socket.on("taskUpdated", (updatedTask) => {
//     // Notify both assignee and assigner
//     io.to(updatedTask.assignedTo.toString()).emit("taskUpdate", updatedTask);
//     io.to(updatedTask.assignedBy.toString()).emit("taskUpdate", updatedTask);
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log(`Client disconnected: ${socket.id}`);
//   });
// });

// Listener
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
