import { prisma } from "../lib/prisma.js";
import { publicUserSelect } from "../lib/publicUserSelect.js";
import { postListSelect, serializePost } from "../lib/postSerializer.js";
import { parsePagination } from "../lib/pagination.js";

export async function getFeed(req, res, next) {
  const { page, limit, skip } = parsePagination(req.query);
  try {
    const following = await prisma.follow.findMany({
      where: { followerId: req.user.id, status: "ACCEPTED" },
      select: { followingId: true },
    });
    const authorIds = [req.user.id, ...following.map((f) => f.followingId)];

    const posts = await prisma.post.findMany({
      where: { authorId: { in: authorIds } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        ...postListSelect(req.user.id),
        author: { select: publicUserSelect },
      },
    });

    res.json({ page, limit, posts: posts.map(serializePost) });
  } catch (err) {
    next(err);
  }
}

export async function createPost(req, res, next) {
  const { content, imageUrl } = req.body;
  try {
    const post = await prisma.post.create({
      data: { content, imageUrl, authorId: req.user.id },
    });
    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
}

export async function getPost(req, res, next) {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: publicUserSelect },
        comments: {
          orderBy: { createdAt: "asc" },
          include: { author: { select: publicUserSelect } },
        },
        likes: { include: { user: { select: publicUserSelect } } },
      },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ post });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req, res, next) {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({ where: { id }, select: { authorId: true } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.authorId !== req.user.id) {
      return res.status(403).json({ error: "Not allowed to delete this post" });
    }
    await prisma.post.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
