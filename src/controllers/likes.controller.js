import { prisma } from "../lib/prisma.js";
import { notify } from "../services/notification.service.js";

export async function likePost(req, res, next) {
  const { id: postId } = req.params;
  try {
    const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true, authorId: true } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const existing = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId: req.user.id } },
    });
    if (existing) {
      return res.status(409).json({ error: "Post already liked" });
    }

    const like = await prisma.like.create({
      data: { postId, userId: req.user.id },
    });
    await notify({ userId: post.authorId, actorId: req.user.id, type: "LIKE", postId });
    res.status(201).json({ like });
  } catch (err) {
    next(err);
  }
}

export async function unlikePost(req, res, next) {
  const { id: postId } = req.params;
  try {
    const existing = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId: req.user.id } },
    });
    if (!existing) {
      return res.status(404).json({ error: "Like not found" });
    }
    await prisma.like.delete({ where: { id: existing.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
