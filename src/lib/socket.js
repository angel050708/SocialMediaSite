import { Server } from "socket.io";
import { env } from "../config/env.js";

let io;

export function initSocket(httpServer, sessionMiddleware) {
  io = new Server(httpServer, {
    cors: { origin: env.CLIENT_ORIGIN, credentials: true },
  });

  const wrapMiddleware = (middleware) => (socket, next) => middleware(socket.request, {}, next);
  io.use(wrapMiddleware(sessionMiddleware));

  io.use((socket, next) => {
    const userId = socket.request.session?.passport?.user;
    if (!userId) {
      return next(new Error("Unauthorized"));
    }
    socket.userId = userId;
    next();
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.userId}`);
  });

  return io;
}

export function emitToUser(userId, event, payload) {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
}
