import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Heart, MessageCircle, UserCheck, UserPlus } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { Avatar } from "../components/ui/Avatar.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { Button } from "../components/ui/Button.jsx";
import { api } from "../lib/api.js";
import { timeAgo } from "../lib/time.js";
import { connectSocket } from "../lib/socket.js";
import { cn } from "../lib/cn.js";

const LIMIT = 20;

const TYPE_META = {
  LIKE: { icon: Heart, text: "liked your post" },
  COMMENT: { icon: MessageCircle, text: "commented on your post" },
  FOLLOW_REQUEST: { icon: UserPlus, text: "wants to follow you" },
  FOLLOW_ACCEPTED: { icon: UserCheck, text: "accepted your follow request" },
};

export function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPage = useCallback(async (pageToLoad) => {
    const data = await api.get(`/api/notifications?page=${pageToLoad}&limit=${LIMIT}`);
    setHasMore(data.notifications.length === LIMIT);
    return data.notifications;
  }, []);

  useEffect(() => {
    loadPage(1)
      .then(setNotifications)
      .finally(() => setLoading(false));
  }, [loadPage]);

  useEffect(() => {
    const socket = connectSocket();
    const handleNew = (notification) => setNotifications((current) => [notification, ...current]);
    socket.on("notification:new", handleNew);
    return () => socket.off("notification:new", handleNew);
  }, []);

  async function handleLoadMore() {
    setLoadingMore(true);
    const nextPage = page + 1;
    const newNotifications = await loadPage(nextPage);
    setNotifications((current) => [...current, ...newNotifications]);
    setPage(nextPage);
    setLoadingMore(false);
  }

  async function handleClick(notification) {
    if (!notification.read) {
      setNotifications((current) =>
        current.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
      );
      api.patch(`/api/notifications/${notification.id}/read`).catch(() => {});
    }
    if (notification.postId) {
      navigate(`/post/${notification.postId}`);
    } else {
      navigate(`/profile/${notification.actor.username}`);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 font-heading text-3xl font-semibold text-foreground">Notifications</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={28} />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} title="Nothing yet" description="You'll hear about activity here." />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const meta = TYPE_META[notification.type];
            const Icon = meta.icon;
            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => handleClick(notification)}
                className="block w-full text-left"
              >
                <Card
                  className={cn(
                    "flex items-center gap-4 p-4 transition-colors duration-300",
                    !notification.read && "bg-primary/5",
                  )}
                >
                  <Avatar src={notification.actor.avatarUrl} alt={notification.actor.displayName} size="sm" />
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon size={16} />
                  </span>
                  <p className="min-w-0 flex-1 text-sm text-foreground">
                    <span className="font-bold">{notification.actor.displayName}</span> {meta.text}
                  </p>
                  <div className="flex shrink-0 items-center gap-2">
                    {!notification.read && <span className="h-2 w-2 rounded-full bg-secondary" />}
                    <span className="text-xs text-muted-foreground">{timeAgo(notification.createdAt)}</span>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
      )}

      {hasMore && !loading && notifications.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" loading={loadingMore} onClick={handleLoadMore}>
            Load more
          </Button>
        </div>
      )}
    </main>
  );
}
