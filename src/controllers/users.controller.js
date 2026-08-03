import { prisma } from "../lib/prisma.js";
import { publicUserSelect, selfUserSelect } from "../lib/publicUserSelect.js";
import { postListSelect, serializePost } from "../lib/postSerializer.js";
import { parsePagination } from "../lib/pagination.js";

export async function listUsers(req, res, next) {
  const { page, limit, skip } = parsePagination(req.query);
  try {
    const users = await prisma.user.findMany({
      where: { id: { not: req.user.id } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: publicUserSelect,
    });

    const relevantFollows = await prisma.follow.findMany({
      where: { followerId: req.user.id, followingId: { in: users.map((u) => u.id) } },
      select: { followingId: true, status: true },
    });
    const statusByUserId = new Map(relevantFollows.map((f) => [f.followingId, f.status]));

    const results = users.map((user) => ({
      user,
      relationshipStatus: statusByUserId.has(user.id)
        ? statusByUserId.get(user.id) === "ACCEPTED"
          ? "following"
          : "pending"
        : "not_following",
    }));

    res.json({ page, limit, users: results });
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: publicUserSelect,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let relationshipStatus = "self";
    if (user.id !== req.user.id) {
      const follow = await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: req.user.id, followingId: user.id } },
        select: { status: true },
      });
      relationshipStatus = !follow ? "not_following" : follow.status === "ACCEPTED" ? "following" : "pending";
    }

    const posts = await prisma.post.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: postListSelect(req.user.id),
    });

    res.json({ user, relationshipStatus, posts: posts.map(serializePost) });
  } catch (err) {
    next(err);
  }
}

export async function listUserPosts(req, res, next) {
  const { username } = req.params;
  const { page, limit, skip } = parsePagination(req.query);
  try {
    const user = await prisma.user.findUnique({ where: { username }, select: { id: true } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await prisma.post.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: postListSelect(req.user.id),
    });

    res.json({ page, limit, posts: posts.map(serializePost) });
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  const { displayName, bio, avatarUrl } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { displayName, bio, avatarUrl },
      select: selfUserSelect,
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
