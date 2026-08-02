import { prisma } from "../lib/prisma.js";
import { emitToUser } from "../lib/socket.js";
import { publicUserSelect } from "../lib/publicUserSelect.js";

export async function notify({ userId, actorId, type, postId = null }) {
  if (userId === actorId) {
    return null;
  }

  const notification = await prisma.notification.create({
    data: { userId, actorId, type, postId },
    include: { actor: { select: publicUserSelect } },
  });

  emitToUser(userId, "notification:new", notification);
  return notification;
}
