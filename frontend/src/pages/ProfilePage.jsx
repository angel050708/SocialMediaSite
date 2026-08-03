import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PenLine, Sprout, UserRound } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { Avatar } from "../components/ui/Avatar.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Blob } from "../components/ui/Blob.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { PostCard } from "../components/PostCard.jsx";
import { FollowButton } from "../components/FollowButton.jsx";
import { api, ApiError } from "../lib/api.js";
import { useToast } from "../context/ToastContext.jsx";

export function ProfilePage() {
  const { username } = useParams();
  const showToast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const result = await api.get(`/api/users/${username}`);
      setData(result);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setNotFound(true);
      } else {
        showToast(err instanceof ApiError ? err.message : "Couldn't load this profile");
      }
    } finally {
      setLoading(false);
    }
  }, [username, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  function handleDeleted(id) {
    setData((current) => ({ ...current, posts: current.posts.filter((post) => post.id !== id) }));
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size={28} />
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <EmptyState icon={UserRound} title="No one here" description="This profile doesn't exist." />
      </main>
    );
  }

  const { user, relationshipStatus, posts } = data;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Card radiusVariant={1} className="relative overflow-hidden p-8 text-center">
        <Blob shapeIndex={2} color="accent" size={280} className="-right-16 -top-20" />
        <Avatar src={user.avatarUrl} alt={user.displayName} size="xl" organic className="mx-auto" />
        <h1 className="mt-4 font-heading text-2xl font-semibold text-foreground">{user.displayName}</h1>
        <p className="text-sm text-muted-foreground">@{user.username}</p>
        {user.bio && <p className="mx-auto mt-3 max-w-md text-[15px] text-foreground/90">{user.bio}</p>}
        <p className="mt-3 text-xs text-muted-foreground">
          Rooted here since{" "}
          {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>

        <div className="relative mt-5 flex justify-center">
          {relationshipStatus === "self" ? (
            <Link to="/profile/me/edit">
              <Button variant="outline" size="sm">
                <PenLine size={16} />
                Edit profile
              </Button>
            </Link>
          ) : (
            <FollowButton username={user.username} status={relationshipStatus} />
          )}
        </div>
      </Card>

      <div className="mt-8 space-y-6">
        {posts.length === 0 ? (
          <EmptyState
            icon={Sprout}
            title="No posts yet"
            description={
              relationshipStatus === "self"
                ? "Share something to see it appear here."
                : `${user.displayName} hasn't posted anything yet.`
            }
          />
        ) : (
          posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={{ ...post, author: user }}
              radiusVariant={index}
              onDeleted={handleDeleted}
            />
          ))
        )}
      </div>
    </main>
  );
}
