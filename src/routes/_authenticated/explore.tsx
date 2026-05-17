import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileCard } from "@/components/gaming/ProfileCard";
import { mockPlayers } from "@/lib/mock-data";
import { Search } from "lucide-react";
import type { Rank, PlayerRole } from "@/types";

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

  const filtered = useMemo(() => {
    return mockPlayers.filter((p) => {
      if (q && !`${p.displayName} ${p.username}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (rank && p.rank !== rank) return false;
      if (role && !p.roles.includes(role)) return false;
      return true;
    });
  }, [q, rank, role]);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-display font-bold">Explore players</h1>
        <p className="text-muted-foreground mt-1">Filter by rank, role, or search by name.</p>

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
          <select
            value={rank}
            onChange={(e) => setRank(e.target.value as Rank | "")}
            className="px-3 py-2.5 rounded-md bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">All ranks</option>
            {RANKS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as PlayerRole | "")}
            className="px-3 py-2.5 rounded-md bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">All roles</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">{filtered.length} player{filtered.length === 1 ? "" : "s"} found</p>

        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => <ProfileCard key={p.id} player={p} />)}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center text-muted-foreground">
            <p>No players match those filters.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
