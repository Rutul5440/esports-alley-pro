import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Trophy, Search, Upload, LayoutDashboard, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Feed", icon: LayoutDashboard },
  { to: "/explore", label: "Explore", icon: Search },
  { to: "/upload", label: "Upload", icon: Upload },
] as const;

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { location } = useRouterState();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-md bg-gradient-gold flex items-center justify-center shadow-gold">
            <Trophy size={18} className="text-primary-foreground" />
          </span>
          <span className="font-display font-bold text-lg tracking-tight">
            Conq<span className="text-gradient-gold">Link</span>
          </span>
        </Link>

        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium inline-flex items-center gap-2 transition-colors",
                    active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent/40",
                  )}
                >
                  <Icon size={16} /> {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile/$username"
                params={{ username: user!.username }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm hover:bg-accent/40 transition-colors"
              >
                <User size={16} /> <span className="hidden sm:inline">{user!.username}</span>
              </Link>
              <button
                onClick={() => { logout(); navigate({ to: "/" }); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors"
                aria-label="Log out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors">
                Log in
              </Link>
              <Link to="/register" className="px-4 py-1.5 rounded-md text-sm font-semibold bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-90 transition-opacity">
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
