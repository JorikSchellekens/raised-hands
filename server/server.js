const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path")

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // You can also set this to your React app's URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

app.use(express.static("../build"));

const raisedHands = [];

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("raisedHands", raisedHands);

  socket.on("raiseHand", (data) => {
    raisedHands.push(data);
    io.emit("raisedHands", raisedHands);
  });

  socket.on("resolveHand", (index) => {
    raisedHands.splice(index, 1);
    io.emit("raisedHands", raisedHands);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});

