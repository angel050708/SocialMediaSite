import { useState } from "react";
import { Avatar } from "./ui/Avatar.jsx";
import { Textarea } from "./ui/Textarea.jsx";
import { Button } from "./ui/Button.jsx";
import { api, ApiError } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const MAX_LENGTH = 500;

export function CommentComposer({ postId, onCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const { comment } = await api.post(`/api/posts/${postId}/comments`, { content: content.trim() });
      onCreated(comment);
      setContent("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't post your comment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex gap-3">
      <Avatar src={user.avatarUrl} alt={user.displayName} size="sm" className="mt-1" />
      <div className="flex-1 space-y-2">
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value.slice(0, MAX_LENGTH))}
          placeholder="Add a thoughtful comment..."
          rows={2}
          aria-label="Comment"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end">
          <Button type="submit" size="sm" loading={submitting} disabled={!content.trim()}>
            Reply
          </Button>
        </div>
      </div>
    </form>
  );
}
