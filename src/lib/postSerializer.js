export function postListSelect(userId) {
  return {
    id: true,
    content: true,
    imageUrl: true,
    createdAt: true,
    _count: { select: { comments: true, likes: true } },
    likes: { where: { userId }, select: { id: true } },
  };
}

export function serializePost(post) {
  const { likes, _count, ...rest } = post;
  return {
    ...rest,
    commentCount: _count.comments,
    likeCount: _count.likes,
    likedByMe: likes.length > 0,
  };
}
