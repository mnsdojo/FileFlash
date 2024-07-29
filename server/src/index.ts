import express from "express";
import "dotenv/config";

import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const port = process.env.PORT || 8000;
const allowedOrigins = ["http://localhost:3000", process.env.URL];

app.use(
  cors({
    origin: "*",
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

io.on("connection", (socket) => {
  console.log("Connection established", socket.id);
});

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
