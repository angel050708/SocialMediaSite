import { Link } from "react-router-dom";
import { Card } from "./ui/Card.jsx";
import { Avatar } from "./ui/Avatar.jsx";

export function UserListItem({ user, radiusVariant = 0, action }) {
  return (
    <Card radiusVariant={radiusVariant} className="flex items-center gap-4 p-5">
      <Link to={`/profile/${user.username}`} className="shrink-0">
        <Avatar src={user.avatarUrl} alt={user.displayName} />
      </Link>
      <Link to={`/profile/${user.username}`} className="min-w-0 flex-1">
        <p className="truncate font-heading text-base font-semibold text-foreground">{user.displayName}</p>
        <p className="truncate text-sm text-muted-foreground">@{user.username}</p>
        {user.bio && <p className="mt-1 line-clamp-1 text-sm text-foreground/80">{user.bio}</p>}
      </Link>
      <div className="shrink-0">{action}</div>
    </Card>
  );
}
