const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//console.log(io);

app.get("/", function (req, res) {
  res.send(`<h1>Hello</h1>`);
});

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("disconnect", (socket) => {
    console.log("disconnected");
    //  io.emit("remove-member", { member: member, room: room });
  });
  socket.on("test", (mess) => {console.log(mess)})
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
