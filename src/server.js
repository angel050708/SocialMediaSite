import http from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";

const server = http.createServer(app);

server.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
