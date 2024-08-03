import express from "express";
import "dotenv/config";

import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: ["*", "http://localhost:3000"],

    credentials: true,
  })
);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Hello from server");
});

const records = new Map();
io.on("connection", (socket) => {
  socket.on("registerUser", (data) => {
    records.set(socket.id, { id: socket.id, userId: data });
    console.log("User registered");
  });

  socket.on("call-user", ({ userToCall, signalData, from }) => {
    console.log(userToCall, signalData, from);
    const user = Array.from(records.values()).find(
      (user) => user.userId === userToCall
    );
    if (user) {
      io.to(user.id).emit("call-made", { signal: signalData, from });
    }
  });
  socket.on("answer-call", ({ signalData, to }) => {
    const user = Array.from(records.values()).find(
      (user) => user.userId === to
    );

    if (user) {
      io.to(user.id).emit("call-answered", signalData);
    }
  });
  socket.on("reject-call", ({ to }) => {
    console.log("reject-call", to);
    const user = Array.from(records.values()).find(
      (user) => user.userId === to
    );
    if (user) {
      io.to(user.id).emit("call-rejected");
    }
    io.to(socket.id).emit("call-rejected");
  });

  socket.on("send-message", ({ to, message }) => {
    console.log("send-message", to, message);
    const user = Array.from(records.values()).find(
      (user) => user.userId === to
    );
    if (user) {
      io.to(user.id).emit("receive-message", { from: socket.id, message });
    }
  });
  // Handle call termination
  socket.on("terminate-call", ({ to }) => {
    console.log("terminate-call", to);
    const user = Array.from(records.values()).find(
      (user) => user.userId === to
    );
    if (user) {
      io.to(user.id).emit("call-terminated");
    }
  });
  socket.on("disconnect", () => {
    if (records.has(socket.id)) {
      const user = records.get(socket.id);
      records.delete(socket.id);
      console.log("User disconnected", user);
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
