import { useCallback, useEffect, useState } from "react";
import { Sprout } from "lucide-react";
import { PostComposer } from "../components/PostComposer.jsx";
import { PostCard } from "../components/PostCard.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { Button } from "../components/ui/Button.jsx";
import { api } from "../lib/api.js";

const LIMIT = 10;

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPage = useCallback(async (pageToLoad) => {
    const data = await api.get(`/api/posts/feed?page=${pageToLoad}&limit=${LIMIT}`);
    setHasMore(data.posts.length === LIMIT);
    return data.posts;
  }, []);

  useEffect(() => {
    loadPage(1)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [loadPage]);

  async function handleLoadMore() {
    setLoadingMore(true);
    const nextPage = page + 1;
    const newPosts = await loadPage(nextPage);
    setPosts((current) => [...current, ...newPosts]);
    setPage(nextPage);
    setLoadingMore(false);
  }

  function handleCreated(post) {
    setPosts((current) => [post, ...current]);
  }

  function handleDeleted(id) {
    setPosts((current) => current.filter((post) => post.id !== id));
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <PostComposer onCreated={handleCreated} />

      <div className="mt-8 space-y-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size={28} />
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon={Sprout}
            title="Your feed is quiet"
            description="Follow a few people or share your first post to see something grow here."
          />
        ) : (
          posts.map((post, index) => (
            <PostCard key={post.id} post={post} radiusVariant={index} onDeleted={handleDeleted} />
          ))
        )}

        {hasMore && !loading && posts.length > 0 && (
          <div className="flex justify-center pt-2">
            <Button variant="outline" loading={loadingMore} onClick={handleLoadMore}>
              Load more
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
