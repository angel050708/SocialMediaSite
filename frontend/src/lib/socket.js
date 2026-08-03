import { io } from "socket.io-client";
import { API_URL } from "./api.js";

let socket = null;

export function connectSocket() {
  if (socket) return socket;
  socket = io(API_URL, { withCredentials: true });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
