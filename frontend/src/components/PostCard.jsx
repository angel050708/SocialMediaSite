import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { Card } from "./ui/Card.jsx";
import { Avatar } from "./ui/Avatar.jsx";
import { api, ApiError } from "../lib/api.js";
import { timeAgo } from "../lib/time.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { cn } from "../lib/cn.js";

export function PostCard({ post, radiusVariant = 0, onDeleted }) {
  const { user } = useAuth();
  const showToast = useToast();
  const [likedByMe, setLikedByMe] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isOwn = user?.id === post.author.id;

  async function toggleLike() {
    if (busy) return;
    setBusy(true);
    const nextLiked = !likedByMe;
    setLikedByMe(nextLiked);
    setLikeCount((count) => count + (nextLiked ? 1 : -1));
    try {
      if (nextLiked) {
        await api.post(`/api/posts/${post.id}/like`);
      } else {
        await api.delete(`/api/posts/${post.id}/like`);
      }
    } catch (err) {
      setLikedByMe(!nextLiked);
      setLikeCount((count) => count + (nextLiked ? -1 : 1));
      showToast(err instanceof ApiError ? err.message : "Couldn't update like");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this post? This can't be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/api/posts/${post.id}`);
      onDeleted?.(post.id);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Couldn't delete post");
      setDeleting(false);
    }
  }

  return (
    <Card radiusVariant={radiusVariant} className="p-6" interactive>
      <div className="flex items-start gap-3">
        <Link to={`/profile/${post.author.username}`} className="shrink-0">
          <Avatar src={post.author.avatarUrl} alt={post.author.displayName} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <Link
              to={`/profile/${post.author.username}`}
              className="truncate font-heading text-base font-semibold text-foreground hover:text-primary"
            >
              {post.author.displayName}
            </Link>
            <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(post.createdAt)}</span>
          </div>
          <p className="text-sm text-muted-foreground">@{post.author.username}</p>

          <Link to={`/post/${post.id}`} className="mt-3 block">
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">{post.content}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt=""
                className="mt-3 aspect-[16/9] w-full rounded-2xl border border-border/50 object-cover"
              />
            )}
          </Link>

          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={toggleLike}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors duration-300",
                likedByMe ? "text-secondary" : "text-muted-foreground hover:text-secondary",
              )}
              aria-pressed={likedByMe}
              aria-label={likedByMe ? "Unlike" : "Like"}
            >
              <Heart size={17} className={likedByMe ? "fill-secondary" : ""} />
              {likeCount}
            </button>
            <Link
              to={`/post/${post.id}`}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors duration-300 hover:text-primary"
            >
              <MessageCircle size={17} />
              {post.commentCount}
            </Link>
            {isOwn && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors duration-300 hover:text-destructive disabled:opacity-50"
                aria-label="Delete post"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
