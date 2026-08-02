import { Router } from "express";
import { register, login, logout, me, guestLogin } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { registerSchema, loginSchema } from "../validators/auth.validators.js";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), register);
router.post("/login", authRateLimiter, validate(loginSchema), login);
router.post("/guest", authRateLimiter, guestLogin);
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, me);

export default router;
