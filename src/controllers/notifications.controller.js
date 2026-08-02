import { prisma } from "../lib/prisma.js";
import { publicUserSelect } from "../lib/publicUserSelect.js";
import { parsePagination } from "../lib/pagination.js";

export async function listNotifications(req, res, next) {
  const { page, limit, skip } = parsePagination(req.query);
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { actor: { select: publicUserSelect } },
    });
    res.json({ page, limit, notifications });
  } catch (err) {
    next(err);
  }
}

export async function markNotificationRead(req, res, next) {
  const { id } = req.params;
  try {
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== req.user.id) {
      return res.status(404).json({ error: "Notification not found" });
    }
    const updated = await prisma.notification.update({ where: { id }, data: { read: true } });
    res.json({ notification: updated });
  } catch (err) {
    next(err);
  }
}
