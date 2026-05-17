import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { mockPlayers } from "@/lib/mock-data";
import { ProfileCard } from "@/components/gaming/ProfileCard";
import { VideoPlayer } from "@/components/gaming/VideoPlayer";
import { RankBadge } from "@/components/gaming/RankBadge";
import { Upload, Search, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Feed — ConqLink" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const recentClips = mockPlayers.flatMap((p) => p.clips.map((c) => ({ player: p, clip: c }))).slice(0, 4);
  const suggested = mockPlayers.slice(0, 3);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-[1fr_320px] gap-8">
        <div>
          <div className="bg-gradient-surface border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="text-3xl font-display font-bold mt-1">@{user?.username}</h1>
            <div className="mt-4 flex gap-2">
              <RankBadge rank="Ace" tier={2} />
              <Link to="/profile/$username" params={{ username: user!.username }} className="text-xs text-primary hover:underline self-center">
                Complete your profile →
              </Link>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            <h2 className="text-xl font-display font-bold">Trending clips</h2>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-5">
            {recentClips.map(({ player, clip }) => (
              <div key={clip.id}>
                <VideoPlayer clip={clip} />
                <Link to="/profile/$username" params={{ username: player.username }} className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                  <img src={player.avatar} alt="" className="w-6 h-6 rounded-full" />
                  {player.displayName}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-gradient-surface border border-border rounded-xl p-5">
            <h3 className="font-display font-bold mb-3">Quick actions</h3>
            <div className="space-y-2">
              <Link to="/upload" className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium">
                <Upload size={16} /> Upload a clip
              </Link>
              <Link to="/explore" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/40 transition-colors text-sm">
                <Search size={16} /> Explore players
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold mb-3">Suggested players</h3>
            <div className="space-y-3">
              {suggested.map((p) => <ProfileCard key={p.id} player={p} />)}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
