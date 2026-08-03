import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Card } from "./ui/Card.jsx";
import { Avatar } from "./ui/Avatar.jsx";
import { Textarea } from "./ui/Textarea.jsx";
import { Input } from "./ui/Input.jsx";
import { Button } from "./ui/Button.jsx";
import { api, ApiError } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const MAX_LENGTH = 2000;

export function PostComposer({ onCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [showImageField, setShowImageField] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const { post } = await api.post("/api/posts", {
        content: content.trim(),
        imageUrl: imageUrl.trim() || undefined,
      });
      onCreated({ ...post, author: user, commentCount: 0, likeCount: 0, likedByMe: false });
      setContent("");
      setImageUrl("");
      setShowImageField(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't publish your post");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} noValidate className="flex gap-3">
        <Avatar src={user.avatarUrl} alt={user.displayName} className="mt-1" />
        <div className="flex-1 space-y-3">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value.slice(0, MAX_LENGTH))}
            placeholder="What's growing in your world today?"
            rows={3}
            aria-label="Post content"
          />
          {showImageField && (
            <div className="flex items-center gap-2">
              <Input
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://example.com/photo.jpg"
                aria-label="Image URL"
              />
              <button
                type="button"
                onClick={() => {
                  setShowImageField(false);
                  setImageUrl("");
                }}
                aria-label="Remove image"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-destructive"
              >
                <X size={16} />
              </button>
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowImageField((v) => !v)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:text-primary"
            >
              <ImagePlus size={16} />
              Photo
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {content.length}/{MAX_LENGTH}
              </span>
              <Button type="submit" size="sm" loading={submitting} disabled={!content.trim()}>
                Plant post
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
}
