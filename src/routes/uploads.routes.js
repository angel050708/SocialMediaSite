import { Router } from "express";
import { uploadAvatar } from "../middleware/upload.js";
import { uploadAvatarHandler } from "../controllers/uploads.controller.js";

const router = Router();

router.post("/avatar", (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, uploadAvatarHandler);

export default router;
