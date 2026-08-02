import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import { env } from "./env.js";

const PgSession = connectPgSimple(session);

const pool = new pg.Pool({ connectionString: env.DATABASE_URL });

export const sessionMiddleware = session({
  store: new PgSession({ pool, tableName: "session" }),
  name: "sid",
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});
