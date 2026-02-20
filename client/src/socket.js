import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SERVER_URL;

export const socket = io(URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling'],
  secure: true,
  rejectUnauthorized: false
});

socket.on("connect", () => {
  console.log("Socket connected successfully:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

