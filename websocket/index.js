const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const port = process.env.PORT || 3001;

async function main() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    cors: { origin: "*" },
  });

  io.on("connection", async (socket) => {
    socket.on("refreshPost", async (postId) => {
      socket.broadcast.emit("refreshPost", postId);
    });

    socket.on("refreshComments", async (postId) => {
      socket.broadcast.emit("refreshComments", postId);
    });

    socket.on("refreshComment", async (commentId) => {
      socket.broadcast.emit("refreshComment", commentId);
    });
  });

  server.listen(port, () => {
    console.log("server running at http://localhost:" + port);
  });
}

main();
