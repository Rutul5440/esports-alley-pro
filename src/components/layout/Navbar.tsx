import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { notificationsApi, searchApi } from "@/lib/api";
import { useState, useRef, useEffect } from "react";
import {
  BadgeCheck,
  Bell,
  CalendarDays,
  Film,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Trophy,
  User,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const playerNavItems = [
  { to: "/dashboard", label: "Feed", icon: LayoutDashboard },
  { to: "/community", label: "Community", icon: Users },
  { to: "/scrims", label: "Scrims", icon: CalendarDays },
  { to: "/clips", label: "Clips", icon: Film },
] as const;

const organizationNavItems = [
  { to: "/dashboard", label: "Feed", icon: LayoutDashboard },
  { to: "/scouting", label: "Scouting", icon: Search },
  { to: "/scrims", label: "Scrims", icon: ShieldCheck },
  { to: "/clips", label: "Clips", icon: Film },
] as const;

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { location } = useRouterState();
  const navItems = user?.role === "organization" ? organizationNavItems : playerNavItems;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadQuery = useQuery({
    queryKey: ["notifications", "unreadCount"],
    queryFn: () => notificationsApi.unreadCount(),
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const searchResults = useQuery({
    queryKey: ["navSearch", searchQuery],
    queryFn: () => searchApi.global(searchQuery, "all"),
    enabled: searchQuery.length >= 2,
  });

  const unreadCount = unreadQuery.data?.count || 0;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="group flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-gold shadow-gold">
              <Trophy size={18} className="text-primary-foreground" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Conq<span className="text-gradient-gold">Link</span>
            </span>
          </Link>

          {isAuthenticated && (
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const active = location.pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <Link key={item.to} to={item.to}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
                    )}>
                    <Icon size={16} /> {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="flex items-center gap-2">
            {/* Search */}
            {isAuthenticated && (
              <div ref={searchRef} className="relative hidden sm:block">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={searchQuery}
                    onFocus={() => setSearchOpen(true)}
                    onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                    placeholder="Search..."
                    className="w-44 rounded-md border border-border bg-input py-1.5 pl-8 pr-3 text-sm focus:w-64 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                {searchOpen && searchQuery.length >= 2 && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-card p-3 shadow-elevated z-50">
                    {searchResults.isLoading ? (
                      <p className="text-sm text-muted-foreground">Searching...</p>
                    ) : (
                      <>
                        {searchResults.data?.users?.map((u: any) => (
                          <Link key={u._id} to="/profile/$username" params={{ username: u.username }} onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent/30">
                            <User size={14} /> {u.username}
                          </Link>
                        ))}
                        {searchResults.data?.clips?.map((c: any) => (
                          <div key={c._id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground">
                            <Film size={14} /> {c.title}
                          </div>
                        ))}
                        {!searchResults.data?.users?.length && !searchResults.data?.clips?.length && (
                          <p className="text-sm text-muted-foreground">No results found</p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <Link to="/notifications" className="relative inline-flex items-center rounded-md p-2 text-muted-foreground hover:bg-accent/40 hover:text-foreground">
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>

                <span className="hidden items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground lg:inline-flex">
                  <BadgeCheck size={13} className="text-primary" /> {user!.role === "organization" ? "Org" : "Player"}
                </span>
                <Link to="/profile/$username" params={{ username: user!.username }}
                  className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent/40">
                  <User size={16} /> <span className="hidden sm:inline">{user!.username}</span>
                </Link>
                <Link to="/settings" className="hidden rounded-md p-2 text-muted-foreground hover:bg-accent/40 hover:text-foreground sm:inline-flex">
                  <Settings size={16} />
                </Link>
                <button onClick={() => { logout(); navigate({ to: "/" }); }}
                  className="inline-flex items-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground" aria-label="Log out">
                  <LogOut size={16} />
                </button>
                {/* Mobile menu toggle */}
                <button onClick={() => setMobileOpen(!mobileOpen)} className="inline-flex rounded-md p-2 text-muted-foreground hover:bg-accent/40 md:hidden">
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">Log in</Link>
                <Link to="/register" className="rounded-md bg-gradient-gold px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-gold transition-opacity hover:opacity-90">Join</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      {mobileOpen && isAuthenticated && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <nav className="absolute right-0 top-0 h-full w-72 border-l border-border bg-card p-6 space-y-1">
            <div className="flex items-center justify-between mb-6">
              <span className="font-display text-lg font-bold">Menu</span>
              <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium hover:bg-accent/40">
                  <Icon size={18} /> {item.label}
                </Link>
              );
            })}
            <hr className="border-border my-3" />
            <Link to="/notifications" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium hover:bg-accent/40">
              <Bell size={18} /> Notifications {unreadCount > 0 && <span className="ml-auto rounded-full bg-destructive px-1.5 text-[10px] text-destructive-foreground">{unreadCount}</span>}
            </Link>
            <Link to="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium hover:bg-accent/40">
              <Settings size={18} /> Settings
            </Link>
            <Link to="/upload" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium hover:bg-accent/40">
              <Film size={18} /> Upload clip
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
