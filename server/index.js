import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { router as userRouter } from "./routes/userRoutes.js";
import { router as chatRouter } from "./routes/chatRoutes.js";
import { router as messageRouter } from "./routes/messageRoutes..js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method + " " + req.path);
  next();
});

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  })
);

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("User joined room: " + data);
  });

  socket.on("send_message", async (msg) => {
    socket.to(msg.id).emit("recieve_message", msg.input);
    socket.emit("my_message", msg.input);
  });
});

const port = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI).then(() => {
  server.listen(port, function () {
    console.log("Listening on port " + port);
  });
});

app.get("/", function (req, res) {
  res.json({ msg: "Welcome to ChatApp" });
});

app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);
