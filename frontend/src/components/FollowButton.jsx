import { useEffect, useState } from "react";
import { Button } from "./ui/Button.jsx";
import { api, ApiError } from "../lib/api.js";
import { useToast } from "../context/ToastContext.jsx";

export function FollowButton({ username, status, onChange, size = "default" }) {
  const [localStatus, setLocalStatus] = useState(status);
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  useEffect(() => setLocalStatus(status), [status]);

  async function handleFollow() {
    setLoading(true);
    try {
      await api.post(`/api/users/${username}/follow`);
      setLocalStatus("pending");
      onChange?.("pending");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Couldn't send follow request");
    } finally {
      setLoading(false);
    }
  }

  async function handleUnfollow() {
    setLoading(true);
    try {
      await api.delete(`/api/users/${username}/follow`);
      setLocalStatus("not_following");
      onChange?.("not_following");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Couldn't update follow status");
    } finally {
      setLoading(false);
    }
  }

  if (localStatus === "following") {
    return (
      <Button variant="outline" size={size} loading={loading} onClick={handleUnfollow}>
        Following
      </Button>
    );
  }

  if (localStatus === "pending") {
    return (
      <Button variant="ghost" size={size} loading={loading} onClick={handleUnfollow}>
        Requested
      </Button>
    );
  }

  return (
    <Button variant="primary" size={size} loading={loading} onClick={handleFollow}>
      Follow
    </Button>
  );
}
