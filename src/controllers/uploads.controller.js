import { prisma } from "../lib/prisma.js";
import { selfUserSelect } from "../lib/publicUserSelect.js";

export async function uploadAvatarHandler(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }
  try {
    const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/avatars/${req.file.filename}`;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl },
      select: selfUserSelect,
    });
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}
