const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const socketio = require("socket.io");

const app = express();
const server = require("http").Server(app);
const io = socketio(server, {
  pingInterval: 10000,  // Send ping every 10 seconds
  pingTimeout: 5000,    // Disconnect if no ping response in 5 seconds
  cookie: false,
  cors: {
    origin: "http://localhost:3000", // Replace with your front-end URL
    methods: ["GET", "POST"],
  },
});

dotenv.config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ code: 200, msg: "helllo from server" });
});

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

let users = {};

// Socket.IO
io.on("connection", (socket) => {
  socket.on("login", (username) => {
    // Store the user's socket ID along with their username
    users[username] = socket.id;
    console.log(`User ${username} logged in with socket ID: ${socket.id}`);
  });

  socket.on("sendMessage", (data) => {
    const { message, to } = data;
    const senderUsername = Object.keys(users).find(
      (username) => users[username] === socket.id
    );

    if (senderUsername) {
      if (to) {
        // Private message to a specific user
        const recipientSocketId = users[to];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("message", {
            from: senderUsername,
            message: message,
            to: to,
          });
        } else {
          console.log(`Recipient ${to} not found.`);
        }
      } else {
        // Broadcast to all users (public message)
        io.emit("message", {
          from: senderUsername,
          message: message,
          to: to,
        });
      }
    }

    // io.emit("message", { message, to, from: senderUsername });
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});
