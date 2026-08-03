import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Avatar } from "./ui/Avatar.jsx";
import { timeAgo } from "../lib/time.js";
import { useAuth } from "../context/AuthContext.jsx";

export function CommentItem({ comment, onDelete }) {
  const { user } = useAuth();
  const isOwn = user?.id === comment.author.id;

  return (
    <div className="flex gap-3">
      <Link to={`/profile/${comment.author.username}`} className="shrink-0">
        <Avatar src={comment.author.avatarUrl} alt={comment.author.displayName} size="sm" />
      </Link>
      <div className="min-w-0 flex-1 rounded-3xl rounded-tl-md bg-muted/60 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <Link
            to={`/profile/${comment.author.username}`}
            className="truncate text-sm font-bold text-foreground hover:text-primary"
          >
            {comment.author.displayName}
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</span>
            {isOwn && (
              <button
                type="button"
                onClick={() => onDelete(comment.id)}
                aria-label="Delete comment"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
        <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground/90">{comment.content}</p>
      </div>
    </div>
  );
}
