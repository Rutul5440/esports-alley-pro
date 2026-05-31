import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileCard } from "@/components/gaming/ProfileCard";
import { profileApi } from "@/lib/api";
import { mockPlayers } from "@/lib/mock-data";
import { Search, Loader2 } from "lucide-react";
import type { Rank, PlayerRole, GameId } from "@/types";
import { games } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/explore")({
  head: () => ({ meta: [{ title: "Explore players — ConqLink" }] }),
  component: Explore,
});

const RANKS: Rank[] = ["Crown", "Ace", "Conqueror", "Diamond"];
const ROLES: PlayerRole[] = ["IGL", "Assaulter", "Sniper", "Support", "Scout", "Filter"];

function Explore() {
  const [q, setQ] = useState("");
  const [rank, setRank] = useState<Rank | "">("");
  const [role, setRole] = useState<PlayerRole | "">("");
  const [game, setGame] = useState<GameId | "">("");
  const [page, setPage] = useState(1);

  const searchQuery = useQuery({
    queryKey: ["explore", { rank, role, game, page }],
    queryFn: () => profileApi.search({ rank: rank || undefined, role: role || undefined, game: game || undefined, page, limit: 12 }),
  });

  const apiPlayers = searchQuery.data?.players || [];
  const total = searchQuery.data?.total || 0;
  const pages = searchQuery.data?.pages || 1;

  // Fallback to mock if API returns empty (dev mode)
  const basePlayers = apiPlayers.length ? apiPlayers : mockPlayers;

  const filtered = useMemo(() => {
    return basePlayers.filter((p: any) => {
      const name = p.displayName || p.user?.username || p.username || "";
      const uname = p.user?.username || p.username || "";
      if (q && !`${name} ${uname}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [basePlayers, q]);

  const normalizePlayer = (p: any) => ({
    id: p._id || p.id,
    username: p.user?.username || p.username,
    displayName: p.displayName || p.user?.username || p.username || "Player",
    avatar: p.user?.avatar || p.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${p.username}`,
    banner: p.bannerImage || p.banner || "",
    bio: p.bio || "",
    location: p.country || p.location || "",
    team: p.team,
    rank: p.stats?.rank || p.rank || "Bronze",
    tier: p.stats?.tier || p.tier || 1,
    roles: p.roles?.length ? p.roles : [p.role].filter(Boolean),
    preferredGames: p.preferredGames || ["bgmi"],
    badges: p.badges || [],
    skillScore: p.skillScore || 0,
    profileViews: p.profileViews || 0,
    isOpenToTeam: p.isOpenToTeam ?? true,
    stats: p.stats || { matches: 0, wins: 0, kills: 0, kd: 0, avgDamage: 0, headshotPct: 0 },
    achievements: p.achievements || [],
    clips: p.clips || [],
    followers: p.user?.followers?.length || p.followers || 0,
    following: p.user?.following?.length || p.following || 0,
    verified: p.user?.isVerified || p.verified,
  });

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-display font-bold">Explore players</h1>
        <p className="text-muted-foreground mt-1">Filter by rank, role, game, or search by name.</p>

        <div className="mt-6 bg-gradient-surface border border-border rounded-xl p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search players…"
              className="w-full pl-9 pr-3 py-2.5 rounded-md bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <select value={game} onChange={(e) => { setGame(e.target.value as GameId | ""); setPage(1); }} className="px-3 py-2.5 rounded-md bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="">All games</option>
            {games.map((g) => <option key={g.id} value={g.id}>{g.shortName}</option>)}
          </select>
          <select value={rank} onChange={(e) => { setRank(e.target.value as Rank | ""); setPage(1); }} className="px-3 py-2.5 rounded-md bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="">All ranks</option>
            {RANKS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={role} onChange={(e) => { setRole(e.target.value as PlayerRole | ""); setPage(1); }} className="px-3 py-2.5 rounded-md bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="">All roles</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {searchQuery.isLoading ? <Loader2 size={14} className="inline animate-spin mr-1" /> : null}
            {filtered.length} player{filtered.length === 1 ? "" : "s"} found
          </p>
          {pages > 1 && (
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-md border border-border px-3 py-1 text-sm disabled:opacity-30">Prev</button>
              <span className="text-sm text-muted-foreground py-1">{page}/{pages}</span>
              <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="rounded-md border border-border px-3 py-1 text-sm disabled:opacity-30">Next</button>
            </div>
          )}
        </div>

        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p: any) => <ProfileCard key={p._id || p.id} player={normalizePlayer(p)} />)}
        </div>

        {filtered.length === 0 && !searchQuery.isLoading && (
          <div className="mt-16 text-center text-muted-foreground">
            <p>No players match those filters.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
