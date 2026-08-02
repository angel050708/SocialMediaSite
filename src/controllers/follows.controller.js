import { prisma } from "../lib/prisma.js";
import { publicUserSelect } from "../lib/publicUserSelect.js";
import { notify } from "../services/notification.service.js";

export async function sendFollowRequest(req, res, next) {
  const { username } = req.params;
  try {
    const target = await prisma.user.findUnique({ where: { username }, select: { id: true } });
    if (!target) {
      return res.status(404).json({ error: "User not found" });
    }
    if (target.id === req.user.id) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: req.user.id, followingId: target.id } },
    });
    if (existing) {
      return res.status(409).json({ error: "Follow request already exists" });
    }

    const follow = await prisma.follow.create({
      data: { followerId: req.user.id, followingId: target.id, status: "PENDING" },
    });
    await notify({ userId: target.id, actorId: req.user.id, type: "FOLLOW_REQUEST" });

    res.status(201).json({ follow });
  } catch (err) {
    next(err);
  }
}

export async function removeFollow(req, res, next) {
  const { username } = req.params;
  try {
    const target = await prisma.user.findUnique({ where: { username }, select: { id: true } });
    if (!target) {
      return res.status(404).json({ error: "User not found" });
    }

    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: req.user.id, followingId: target.id } },
    });
    if (!existing) {
      return res.status(404).json({ error: "Follow relationship not found" });
    }

    await prisma.follow.delete({ where: { id: existing.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function listIncomingRequests(req, res, next) {
  try {
    const requests = await prisma.follow.findMany({
      where: { followingId: req.user.id, status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: { follower: { select: publicUserSelect } },
    });
    res.json({ requests });
  } catch (err) {
    next(err);
  }
}

export async function acceptFollowRequest(req, res, next) {
  const { id } = req.params;
  try {
    const follow = await prisma.follow.findUnique({ where: { id } });
    if (!follow || follow.followingId !== req.user.id || follow.status !== "PENDING") {
      return res.status(404).json({ error: "Follow request not found" });
    }

    const updated = await prisma.follow.update({
      where: { id },
      data: { status: "ACCEPTED" },
    });
    await notify({ userId: follow.followerId, actorId: req.user.id, type: "FOLLOW_ACCEPTED" });
    res.json({ follow: updated });
  } catch (err) {
    next(err);
  }
}

export async function rejectFollowRequest(req, res, next) {
  const { id } = req.params;
  try {
    const follow = await prisma.follow.findUnique({ where: { id } });
    if (!follow || follow.followingId !== req.user.id || follow.status !== "PENDING") {
      return res.status(404).json({ error: "Follow request not found" });
    }

    await prisma.follow.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
