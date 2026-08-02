import http from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { sessionMiddleware } from "./config/session.js";
import { initSocket } from "./lib/socket.js";

const server = http.createServer(app);
initSocket(server, sessionMiddleware);

server.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
