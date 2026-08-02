import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { selfUserSelect } from "../lib/publicUserSelect.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user || user.isGuest) {
        return done(null, false, { message: "Invalid credentials" });
      }
      const matches = await bcrypt.compare(password, user.passwordHash);
      if (!matches) {
        return done(null, false, { message: "Invalid credentials" });
      }
      return done(null, { id: user.id });
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id }, select: selfUserSelect });
    done(null, user ?? false);
  } catch (err) {
    done(err);
  }
});

export { passport };
