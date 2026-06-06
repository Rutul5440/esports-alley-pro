import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { scrimsApi, leaderboardApi } from "@/lib/api";
import { games } from "@/lib/mock-data";
import type { GameId, ScrimEvent } from "@/types";
import { EmptyState } from "@/components/feature/EmptyState";
import { GameFilterChips } from "@/components/feature/GameFilterChips";
import { ScrimCard } from "@/components/feature/ScrimCard";
import { StatCard } from "@/components/feature/StatCard";
import { SkeletonCard } from "@/components/feature/SkeletonCard";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarPlus, ClipboardList, Loader2, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/scrims")({
  head: () => ({ meta: [{ title: "Scrims - Grid Lock" }] }),
  component: Scrims,
});

const tabs = ["upcoming", "registered", "past", "leaderboard"] as const;
const levels = ["Rookie", "Contender", "Elite", "Master", "Conqueror"];

function Scrims() {
  const { user } = useAuth();
  const isOrg = user?.role === "organization";
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<(typeof tabs)[number]>("upcoming");
  const [game, setGame] = useState<GameId | "all">("all");
  const [showCreate, setShowCreate] = useState(false);

  // Create form
  const [title, setTitle] = useState("");
  const [format, setFormat] = useState<"Solo" | "Duo" | "Squad">("Squad");
  const [level, setLevel] = useState("Rookie");
  const [maxTeams, setMaxTeams] = useState(16);
  const [prize, setPrize] = useState("");
  const [rules, setRules] = useState("");
  const [schedDate, setSchedDate] = useState("");

  const scrimsQuery = useQuery({
    queryKey: ["scrims", tab, game],
    queryFn: () =>
      tab === "registered"
        ? scrimsApi.registered()
        : isOrg && tab === "upcoming"
          ? scrimsApi.my()
          : scrimsApi.list({ game: game === "all" ? undefined : game }),
    enabled: tab !== "leaderboard",
  });

  const leaderboardQuery = useQuery({
    queryKey: ["leaderboard", game],
    queryFn: () => leaderboardApi.get({ game: game === "all" ? undefined : game, limit: 15 }),
    enabled: tab === "leaderboard",
  });

  const createScrim = useMutation({
    mutationFn: () =>
      scrimsApi.create({
        title,
        game: game === "all" ? "bgmi" : game,
        level,
        scheduledAt: schedDate
          ? new Date(schedDate).toISOString()
          : new Date(Date.now() + 86400000).toISOString(),
        maxTeams,
        format,
        prize: prize || undefined,
        rules: rules || undefined,
        status: "open",
      }),
    onSuccess: () => {
      setTitle("");
      setPrize("");
      setRules("");
      setSchedDate("");
      setShowCreate(false);
      queryClient.invalidateQueries({ queryKey: ["scrims"] });
    },
  });

  const registerScrim = useMutation({
    mutationFn: (id: string) => scrimsApi.register(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scrims"] }),
  });

  const scrims = scrimsQuery.data || [];
  const upcoming = scrims.filter((event: any) => !["completed"].includes(event.status));
  const past = scrims.filter((event: any) => ["completed"].includes(event.status));
  const visible = tab === "past" ? past : tab === "leaderboard" ? [] : upcoming;
  const chartData = scrims.slice(0, 5).map((event: any) => ({
    name: event.title?.slice(0, 12) || "Scrim",
    registrations: event.registered || event.registrations?.length || 0,
  }));

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-3xl font-bold">Scrims & Tournaments</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Tiered competitive blocks, registration tracking, organizer tools, and analytics.
            </p>
          </div>
          {isOrg && (
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-gold px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold"
            >
              {showCreate ? <X size={16} /> : <CalendarPlus size={16} />}
              {showCreate ? "Cancel" : "Create scrim"}
            </button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-md border px-3 py-2 text-sm capitalize ${tab === item ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <GameFilterChips value={game} onChange={setGame} />

        {/* Enhanced Create Form */}
        {showCreate && (
          <section className="mt-6 rounded-lg border border-border bg-card p-5 space-y-4">
            <h2 className="font-display text-lg font-bold">Create scrim</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Scrim title *"
                className="rounded-md border border-border bg-input px-3 py-2 text-sm"
              />
              <input
                type="datetime-local"
                value={schedDate}
                onChange={(e) => setSchedDate(e.target.value)}
                className="rounded-md border border-border bg-input px-3 py-2 text-sm"
              />
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="rounded-md border border-border bg-input px-3 py-2 text-sm"
              >
                <option>Solo</option>
                <option>Duo</option>
                <option>Squad</option>
              </select>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="rounded-md border border-border bg-input px-3 py-2 text-sm"
              >
                {levels.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <input
                type="number"
                value={maxTeams}
                min={2}
                max={100}
                onChange={(e) => setMaxTeams(Number(e.target.value))}
                placeholder="Max teams"
                className="rounded-md border border-border bg-input px-3 py-2 text-sm"
              />
              <input
                value={prize}
                onChange={(e) => setPrize(e.target.value)}
                placeholder="Prize (optional)"
                className="rounded-md border border-border bg-input px-3 py-2 text-sm"
              />
            </div>
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder="Rules (optional)"
              rows={2}
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm resize-none"
            />
            <button
              disabled={!title.trim() || createScrim.isPending}
              onClick={() => createScrim.mutate()}
              className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-4 py-2 text-sm font-semibold text-primary disabled:opacity-50"
            >
              {createScrim.isPending && <Loader2 size={14} className="animate-spin" />}
              Create
            </button>
          </section>
        )}

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_340px]">
          <main className="grid gap-4 md:grid-cols-2">
            {tab === "leaderboard" ? (
              <Leaderboard
                entries={leaderboardQuery.data?.entries || []}
                loading={leaderboardQuery.isLoading}
              />
            ) : scrimsQuery.isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : visible.length ? (
              visible.map((event: ScrimEvent) => (
                <ScrimCard
                  key={event.id || (event as any)._id}
                  event={event}
                  onRegister={
                    !isOrg ? () => registerScrim.mutate(event.id || (event as any)._id) : undefined
                  }
                />
              ))
            ) : (
              <EmptyState title="No scrims found" description="Try another tab or game filter." />
            )}
          </main>

          <aside className="space-y-4">
            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="font-display text-sm font-bold">
                {isOrg ? "Organizer analytics" : "Your badge track"}
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <StatCard label="Events" value={scrims.length} />
                <StatCard
                  label="Open slots"
                  value={scrims.reduce(
                    (sum: number, event: any) =>
                      sum +
                      Math.max(
                        0,
                        (event.capacity || event.maxTeams || 0) -
                          (event.registered || event.registrations?.length || 0),
                      ),
                    0,
                  )}
                />
              </div>
              {chartData.length > 0 && (
                <div className="mt-5 h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" fontSize={10} />
                      <YAxis fontSize={10} />
                      <Tooltip />
                      <Bar
                        dataKey="registrations"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>
            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 font-display text-sm font-bold">
                <ClipboardList size={16} /> Level ladder
              </h2>
              <div className="mt-4 space-y-3">
                {[
                  "Rookie Grounds",
                  "Contender Arena",
                  "Elite Circuit",
                  "Master League",
                  "Conqueror Invitational",
                ].map((lvl, index) => (
                  <div key={lvl} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="font-semibold">{lvl}</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function Leaderboard({ entries, loading }: { entries: any[]; loading: boolean }) {
  if (loading)
    return (
      <div className="md:col-span-2 text-center py-10 text-muted-foreground">
        Loading leaderboard...
      </div>
    );
  if (!entries.length)
    return (
      <EmptyState
        title="No leaderboard data"
        description="Complete scrims to populate the leaderboard."
      />
    );

  return (
    <section className="md:col-span-2 rounded-lg border border-border bg-card p-5">
      <h2 className="font-display text-xl font-bold">Leaderboard</h2>
      <div className="mt-4 overflow-hidden rounded-md border border-border">
        <div className="grid grid-cols-[60px_1fr_100px_100px_100px] gap-3 border-b border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Rank</span>
          <span>Player</span>
          <span>Score</span>
          <span>K/D</span>
          <span>Badge</span>
        </div>
        {entries.map((entry: any) => (
          <div
            key={entry._id || entry.position}
            className="grid grid-cols-[60px_1fr_100px_100px_100px] gap-3 border-b border-border px-4 py-3 text-sm last:border-0"
          >
            <span className="font-bold text-primary">#{entry.position}</span>
            <span className="flex items-center gap-2 font-semibold">
              <img
                src={
                  entry.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${entry.username}`
                }
                alt=""
                className="h-6 w-6 rounded-full"
              />
              {entry.displayName || entry.username}
            </span>
            <span>{entry.skillScore || 0}</span>
            <span>{entry.stats?.kd || 0}</span>
            <span className="text-primary">{entry.badges?.[0] || "—"}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
