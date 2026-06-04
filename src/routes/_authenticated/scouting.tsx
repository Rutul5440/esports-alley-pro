import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/feature/EmptyState";
import { PlayerCard } from "@/components/feature/PlayerCard";
import { SkeletonCard } from "@/components/feature/SkeletonCard";
import { scoutingApi } from "@/lib/api";
import { games } from "@/lib/mock-data";
import type { GameId, PlayerRole, Rank } from "@/types";
import { BarChart3, Search, SlidersHorizontal, Target, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/scouting")({
  head: () => ({ meta: [{ title: "Scouting - ConqLink" }] }),
  component: Scouting,
});

const ranks: Rank[] = ["Crown", "Ace", "Conqueror", "Diamond"];
const roles: PlayerRole[] = ["IGL", "Assaulter", "Sniper", "Support", "Scout", "Filter"];

function Scouting() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [rank, setRank] = useState<Rank | "">("");
  const [role, setRole] = useState<PlayerRole | "">("");
  const [game, setGame] = useState<GameId | "">("");
  const [openOnly, setOpenOnly] = useState(true);

  const params = {
    rank: rank || undefined,
    role: role || undefined,
    game: game || undefined,
    openOnly,
    limit: 24,
  };
  const playersQuery = useQuery({
    queryKey: ["scouting", params],
    queryFn: () => scoutingApi.players(params),
  });
  const savedQuery = useQuery({ queryKey: ["scouting", "saved"], queryFn: scoutingApi.saved });
  const savePlayer = useMutation({
    mutationFn: scoutingApi.save,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scouting"] }),
  });
  const invitePlayer = useMutation({
    mutationFn: (playerId: string) =>
      scoutingApi.invite(playerId, "We would like to invite you to an upcoming scrim block."),
  });

  const apiPlayers = playersQuery.data?.players || [];

  const players = useMemo(() => {
    return apiPlayers.filter((player: any) => {
      const username = player.user?.username || player.username || "";
      const displayName = player.displayName || "";
      return !query || `${username} ${displayName}`.toLowerCase().includes(query.toLowerCase());
    });
  }, [apiPlayers, query]);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4">
            <section className="rounded-lg border border-border bg-card p-5">
              <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
                <SlidersHorizontal size={20} /> Scouting
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Filter competitive profiles, save private notes, and invite players into scrim
                blocks.
              </p>
              <div className="mt-5 grid gap-3">
                <label className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search players"
                    className="w-full rounded-md border border-border bg-input py-2.5 pl-9 pr-3 text-sm"
                  />
                </label>
                <Select
                  value={game}
                  onChange={(value) => setGame(value as GameId | "")}
                  options={games.map((g) => g.id)}
                  placeholder="All games"
                  labels={Object.fromEntries(games.map((g) => [g.id, g.shortName]))}
                />
                <Select
                  value={rank}
                  onChange={(value) => setRank(value as Rank | "")}
                  options={ranks}
                  placeholder="All ranks"
                />
                <Select
                  value={role}
                  onChange={(value) => setRole(value as PlayerRole | "")}
                  options={roles}
                  placeholder="All roles"
                />
                <label className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
                  Open to recruit
                  <input
                    type="checkbox"
                    checked={openOnly}
                    onChange={(e) => setOpenOnly(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                </label>
              </div>
            </section>
            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="font-display text-sm font-bold">Scout board</h2>
              <div className="mt-4 space-y-3">
                <Signal icon={BarChart3} label="Players found" value={String(players.length)} />
                <Signal
                  icon={Target}
                  label="Saved players"
                  value={String(savedQuery.data?.length || 0)}
                />
              </div>
            </section>
          </aside>

          <main>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-bold">Player grid</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sorted by skill score, profile views, and matching filters.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {playersQuery.isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : players.length ? (
                players.map((player: any) => {
                  const id = player.user?._id || player.user?.id || player.id;
                  return (
                    <PlayerCard
                      key={player._id || player.id}
                      player={player}
                      onSave={() => id && savePlayer.mutate(id)}
                      onInvite={() => id && invitePlayer.mutate(id)}
                    />
                  );
                })
              ) : (
                <EmptyState
                  title="No players match"
                  description="Relax one or two filters to widen the scout board."
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </AppShell>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  labels = {},
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  labels?: Record<string, string>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-border bg-input px-3 py-2.5 text-sm"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {labels[option] ?? option}
        </option>
      ))}
    </select>
  );
}

function Signal({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={15} className="text-primary" />
      <span>
        <span className="block font-semibold">{value}</span>
        <span className="block text-muted-foreground">{label}</span>
      </span>
    </div>
  );
}
