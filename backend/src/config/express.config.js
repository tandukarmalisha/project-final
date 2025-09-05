const express = require("express");
const cors = require("cors");
const router = require("./router.config");
const http = require("http");
const {Server}= require("socket.io")
const app = express();

//Global Middleware***********
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // ✅ Allow frontend origin


app.get('/',(req, res, next) => {
    res.send("Welcome to the Express Server!");
});

//Mount API Routes
app.use(router);




// Central Error Handling Middleware (must be AFTER routes)
app.use((err, req, res, next) => {
  console.error("Error caught by middleware:", err);

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message:message,
    options: null,
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true }, // allow frontend
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (userId) => {
    socket.join(userId); // each user joins their own room
    console.log(`User ${socket.id} joined room ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Export both app and io if needed
module.exports = { app, io, server };



