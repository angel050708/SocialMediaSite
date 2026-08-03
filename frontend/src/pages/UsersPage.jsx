import { useCallback, useEffect, useState } from "react";
import { Users } from "lucide-react";
import { UserListItem } from "../components/UserListItem.jsx";
import { FollowButton } from "../components/FollowButton.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { Button } from "../components/ui/Button.jsx";
import { api } from "../lib/api.js";

const LIMIT = 12;

export function UsersPage() {
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPage = useCallback(async (pageToLoad) => {
    const data = await api.get(`/api/users?page=${pageToLoad}&limit=${LIMIT}`);
    setHasMore(data.users.length === LIMIT);
    return data.users;
  }, []);

  useEffect(() => {
    loadPage(1)
      .then(setEntries)
      .finally(() => setLoading(false));
  }, [loadPage]);

  async function handleLoadMore() {
    setLoadingMore(true);
    const nextPage = page + 1;
    const newEntries = await loadPage(nextPage);
    setEntries((current) => [...current, ...newEntries]);
    setPage(nextPage);
    setLoadingMore(false);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 font-heading text-3xl font-semibold text-foreground">People to grow with</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={28} />
        </div>
      ) : entries.length === 0 ? (
        <EmptyState icon={Users} title="No one else here yet" description="Check back soon." />
      ) : (
        <div className="space-y-4">
          {entries.map(({ user, relationshipStatus }, index) => (
            <UserListItem
              key={user.id}
              user={user}
              radiusVariant={index}
              action={<FollowButton username={user.username} status={relationshipStatus} size="sm" />}
            />
          ))}
        </div>
      )}

      {hasMore && !loading && entries.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" loading={loadingMore} onClick={handleLoadMore}>
            Load more
          </Button>
        </div>
      )}
    </main>
  );
}
