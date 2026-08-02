import express from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import { sessionMiddleware } from "./config/session.js";
import { passport } from "./config/passport.js";
import { requireAuth } from "./middleware/requireAuth.js";
import { blockGuestWrites } from "./middleware/blockGuestWrites.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import followsRoutes from "./routes/follows.routes.js";
import postsRoutes from "./routes/posts.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.get("/api/health", async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok" });
  } catch (err) {
    next(err);
  }
});

app.use("/api/auth", authRoutes);

app.use("/api", requireAuth, blockGuestWrites);

app.use("/api/users", usersRoutes);
app.use("/api/follows", followsRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/notifications", notificationsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);
