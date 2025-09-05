import { io } from "socket.io-client";

const user = JSON.parse(localStorage.getItem("user"));
const userId = user?._id; // or user?.id depending on your backend

export const socket = io("http://localhost:8000", { withCredentials: true });

// Join the room
if (userId) {
  socket.emit("joinRoom", userId);
}
