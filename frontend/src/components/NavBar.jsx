import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, Home, Leaf, LogOut, Menu, User, UserPlus, Users, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";
import { connectSocket } from "../lib/socket.js";
import { Avatar } from "./ui/Avatar.jsx";
import { cn } from "../lib/cn.js";

const LINKS = [
  { to: "/", label: "Feed", icon: Home, end: true },
  { to: "/users", label: "People", icon: Users },
  { to: "/follow-requests", label: "Requests", icon: UserPlus },
];

export function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    api
      .get("/api/notifications?limit=20")
      .then((data) => setUnreadCount(data.notifications.filter((n) => !n.read).length))
      .catch(() => {});

    const socket = connectSocket();
    const handleNew = () => setUnreadCount((count) => count + 1);
    socket.on("notification:new", handleNew);
    return () => socket.off("notification:new", handleNew);
  }, [user]);

  async function handleLogout() {
    setMobileOpen(false);
    await logout();
    navigate("/login");
  }

  if (!user) return null;

  return (
    <header className="sticky top-4 z-40 px-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full border border-border/50 bg-white/70 px-4 py-2 shadow-soft backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Leaf size={18} />
          </span>
          <span className="hidden font-heading text-xl font-semibold text-foreground sm:block">Grove</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors duration-300",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              cn(
                "relative flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
              )
            }
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </NavLink>
          <Link to={`/profile/${user.username}`} aria-label="Your profile">
            <Avatar src={user.avatarUrl} alt={user.displayName} size="sm" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors duration-300 hover:text-destructive"
          >
            <LogOut size={18} />
          </button>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full text-foreground md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mx-auto mt-2 max-w-5xl rounded-[2rem] border border-border/50 bg-white/95 p-3 shadow-soft-lg backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground",
                  )
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/notifications"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground",
                )
              }
            >
              <Bell size={18} />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1.5 text-[11px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </NavLink>
            <NavLink
              to={`/profile/${user.username}`}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground",
                )
              }
            >
              <User size={18} />
              Profile
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-destructive"
            >
              <LogOut size={18} />
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
