import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout.jsx";
import { AvatarUpload } from "../components/AvatarUpload.jsx";
import { FormField } from "../components/ui/FormField.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Textarea } from "../components/ui/Textarea.jsx";
import { Button } from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api, ApiError } from "../lib/api.js";

export function EditProfilePage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAvatarUploaded(newUrl) {
    setAvatarUrl(newUrl);
    await refreshUser();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");
    setFieldErrors({});
    try {
      await api.patch("/api/users/me", {
        displayName,
        bio: bio.trim() || null,
        avatarUrl: avatarUrl.trim() || null,
      });
      await refreshUser();
      navigate(`/profile/${user.username}`);
    } catch (err) {
      if (err instanceof ApiError && err.details) {
        setFieldErrors(Object.fromEntries(Object.entries(err.details).map(([key, msgs]) => [key, msgs[0]])));
      } else {
        setFormError(err instanceof ApiError ? err.message : "Couldn't save your changes");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Edit your profile" subtitle="Tend to your little corner of Grove.">
      <div className="mb-6">
        <AvatarUpload currentUrl={avatarUrl} displayName={displayName} onUploaded={handleAvatarUploaded} />
      </div>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField label="Display name" htmlFor="displayName" error={fieldErrors.displayName}>
          <Input
            id="displayName"
            required
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </FormField>
        <FormField label="Bio" htmlFor="bio" error={fieldErrors.bio}>
          <Textarea
            id="bio"
            rows={3}
            maxLength={280}
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="Tell people a little about yourself..."
          />
        </FormField>
        <FormField label="Avatar URL" htmlFor="avatarUrl" error={fieldErrors.avatarUrl}>
          <Input
            id="avatarUrl"
            type="url"
            value={avatarUrl}
            onChange={(event) => setAvatarUrl(event.target.value)}
            placeholder="https://example.com/photo.jpg"
          />
        </FormField>
        {formError && (
          <p className="text-sm text-destructive" role="alert">
            {formError}
          </p>
        )}
        <div className="flex gap-3">
          <Button type="button" variant="ghost" className="flex-1" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={submitting}>
            Save changes
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
