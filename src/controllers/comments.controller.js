import { prisma } from "../lib/prisma.js";
import { publicUserSelect } from "../lib/publicUserSelect.js";
import { notify } from "../services/notification.service.js";

export async function createComment(req, res, next) {
  const { id: postId } = req.params;
  const { content } = req.body;
  try {
    const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true, authorId: true } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const comment = await prisma.comment.create({
      data: { content, postId, authorId: req.user.id },
      include: { author: { select: publicUserSelect } },
    });
    await notify({ userId: post.authorId, actorId: req.user.id, type: "COMMENT", postId });
    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req, res, next) {
  const { id } = req.params;
  try {
    const comment = await prisma.comment.findUnique({ where: { id }, select: { authorId: true } });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.authorId !== req.user.id) {
      return res.status(403).json({ error: "Not allowed to delete this comment" });
    }
    await prisma.comment.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
