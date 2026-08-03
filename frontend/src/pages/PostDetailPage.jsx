import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageCircleOff } from "lucide-react";
import { PostCard } from "../components/PostCard.jsx";
import { CommentComposer } from "../components/CommentComposer.jsx";
import { CommentItem } from "../components/CommentItem.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { api, ApiError } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

function toFeedShape(post, currentUserId) {
  return {
    ...post,
    likeCount: post.likes.length,
    commentCount: post.comments.length,
    likedByMe: post.likes.some((like) => like.userId === currentUserId),
  };
}

export function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const data = await api.get(`/api/posts/${id}`);
      setPost(data.post);
      setComments(data.post.comments);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setNotFound(true);
      } else {
        showToast(err instanceof ApiError ? err.message : "Couldn't load this post");
      }
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDeleteComment(commentId) {
    if (!confirm("Delete this comment?")) return;
    try {
      await api.delete(`/api/comments/${commentId}`);
      setComments((current) => current.filter((comment) => comment.id !== commentId));
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Couldn't delete comment");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size={28} />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <EmptyState
          icon={MessageCircleOff}
          title="This post is gone"
          description="It may have been removed by its author."
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 space-y-8">
      <PostCard post={toFeedShape(post, user.id)} onDeleted={() => navigate("/")} />

      <section className="space-y-5">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>
        <CommentComposer postId={post.id} onCreated={(comment) => setComments((c) => [...c, comment])} />
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} onDelete={handleDeleteComment} />
          ))}
        </div>
      </section>
    </main>
  );
}
