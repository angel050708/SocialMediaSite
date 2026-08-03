import crypto from "node:crypto";
import multer from "multer";

const EXTENSION_BY_MIME = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};
const MAX_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: "uploads/avatars",
  filename: (req, file, cb) => {
    const ext = EXTENSION_BY_MIME[file.mimetype];
    cb(null, `${req.user.id}-${crypto.randomBytes(8).toString("hex")}${ext}`);
  },
});

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (!EXTENSION_BY_MIME[file.mimetype]) {
      return cb(new Error("Only JPEG, PNG, WebP, or GIF images are allowed"));
    }
    cb(null, true);
  },
}).single("avatar");
