import { useEffect, useState } from "react";
import { Check, UserPlus, X } from "lucide-react";
import { UserListItem } from "../components/UserListItem.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { Button } from "../components/ui/Button.jsx";
import { api, ApiError } from "../lib/api.js";
import { useToast } from "../context/ToastContext.jsx";

export function FollowRequestsPage() {
  const showToast = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    api
      .get("/api/follows/requests")
      .then((data) => setRequests(data.requests))
      .catch((err) => showToast(err instanceof ApiError ? err.message : "Couldn't load requests"))
      .finally(() => setLoading(false));
  }, [showToast]);

  async function respond(id, action) {
    setBusyId(id);
    try {
      await api.post(`/api/follows/${id}/${action}`);
      setRequests((current) => current.filter((request) => request.id !== id));
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Couldn't update this request");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 font-heading text-3xl font-semibold text-foreground">Follow requests</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={28} />
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="All caught up"
          description="No pending follow requests right now."
        />
      ) : (
        <div className="space-y-4">
          {requests.map((request, index) => (
            <UserListItem
              key={request.id}
              user={request.follower}
              radiusVariant={index}
              action={
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="!px-4"
                    loading={busyId === request.id}
                    onClick={() => respond(request.id, "reject")}
                    aria-label="Reject"
                  >
                    <X size={16} />
                  </Button>
                  <Button
                    size="sm"
                    className="!px-4"
                    loading={busyId === request.id}
                    onClick={() => respond(request.id, "accept")}
                    aria-label="Accept"
                  >
                    <Check size={16} />
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </main>
  );
}
