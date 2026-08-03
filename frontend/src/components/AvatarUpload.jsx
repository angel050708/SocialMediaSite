import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Avatar } from "./ui/Avatar.jsx";
import { Spinner } from "./ui/Spinner.jsx";
import { API_URL, ApiError } from "../lib/api.js";
import { cn } from "../lib/cn.js";

const MAX_SIZE = 5 * 1024 * 1024;

export function AvatarUpload({ currentUrl, displayName, onUploaded }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  async function upload(file) {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Image must be under 5MB");
      return;
    }

    setError("");
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch(`${API_URL}/api/uploads/avatar`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new ApiError(data?.error ?? "Upload failed", res.status);
      }
      onUploaded(data.user.avatarUrl);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
      setPreview(currentUrl);
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar src={preview} alt={displayName} size="xl" organic />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/40">
            <Spinner size={24} className="text-white" />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={cn(
          "flex items-center gap-2 rounded-full border-2 border-dashed px-5 py-2 text-sm font-semibold text-muted-foreground transition-colors duration-200",
          dragActive ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50",
        )}
      >
        <Upload size={15} />
        {uploading ? "Uploading..." : "Change photo"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload(file);
          event.target.value = "";
        }}
      />

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
