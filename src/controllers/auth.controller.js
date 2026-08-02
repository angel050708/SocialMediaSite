import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { gravatarUrl } from "../lib/gravatar.js";
import { selfUserSelect } from "../lib/publicUserSelect.js";
import { passport } from "../config/passport.js";

const BCRYPT_ROUNDS = 12;

export async function register(req, res, next) {
  const { username, email, password, displayName } = req.body;
  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
      select: { id: true },
    });
    if (existing) {
      return res.status(409).json({ error: "Username or email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        displayName,
        avatarUrl: gravatarUrl(email),
      },
      select: selfUserSelect,
    });

    req.login({ id: user.id }, (err) => {
      if (err) return next(err);
      res.status(201).json({ user });
    });
  } catch (err) {
    next(err);
  }
}

export async function guestLogin(req, res, next) {
  try {
    const username = `guest_${crypto.randomBytes(4).toString("hex")}`;
    const email = `${username}@guest.local`;
    const randomPassword = crypto.randomBytes(32).toString("hex");
    const passwordHash = await bcrypt.hash(randomPassword, BCRYPT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        displayName: "Guest",
        avatarUrl: gravatarUrl(email),
        isGuest: true,
      },
      select: selfUserSelect,
    });

    req.login({ id: user.id }, (err) => {
      if (err) return next(err);
      res.status(201).json({ user });
    });
  } catch (err) {
    next(err);
  }
}

export function login(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info?.message ?? "Invalid credentials" });
    }
    req.login(user, async (loginErr) => {
      if (loginErr) return next(loginErr);
      try {
        const fullUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: selfUserSelect,
        });
        res.json({ user: fullUser });
      } catch (fetchErr) {
        next(fetchErr);
      }
    });
  })(req, res, next);
}

export function logout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((destroyErr) => {
      if (destroyErr) return next(destroyErr);
      res.clearCookie("sid");
      res.status(204).end();
    });
  });
}

export function me(req, res) {
  res.json({ user: req.user });
}
