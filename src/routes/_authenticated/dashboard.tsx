import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { communityApi, postsApi, scrimsApi, scoutingApi, profileApi } from "@/lib/api";
import type { FeedPost, GameId } from "@/types";
import { EmptyState } from "@/components/feature/EmptyState";
import { GameFilterChips } from "@/components/feature/GameFilterChips";
import { PostCard } from "@/components/feature/PostCard";
import { SkeletonCard } from "@/components/feature/SkeletonCard";
import { StatCard } from "@/components/feature/StatCard";
import { ImagePlus, Send, Trophy, Users, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Feed - ConqLink" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isOrg = user?.role === "organization";
  const [game, setGame] = useState<GameId | "all">("all");
  const [draft, setDraft] = useState("");

  const feedQuery = useQuery({
    queryKey: ["feed", game],
    queryFn: () => postsApi.feed({ game }),
  });
  const scrimsQuery = useQuery({
    queryKey: ["scrims", "dashboard"],
    queryFn: () => scrimsApi.list(),
  });
  const communityQuery = useQuery({
    queryKey: ["community", "dashboard"],
    queryFn: () => communityApi.listings(),
  });
  const scoutingQuery = useQuery({
    queryKey: ["scouting", "dashboard"],
    queryFn: () => scoutingApi.players({ limit: 3, openOnly: true }),
    enabled: isOrg,
  });
  const topPlayersQuery = useQuery({
    queryKey: ["topPlayers"],
    queryFn: () => profileApi.top({ limit: 3 }),
    enabled: !isOrg,
  });

  const createPost = useMutation({
    mutationFn: () => postsApi.create({ content: draft, gameTag: game === "all" ? "bgmi" : game, postType: "general", tags: [] }),
    onSuccess: () => {
      setDraft("");
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
  const likePost = useMutation({ mutationFn: postsApi.like, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feed"] }) });
  const savePost = useMutation({ mutationFn: postsApi.save, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feed"] }) });
  const sharePost = useMutation({ mutationFn: postsApi.share, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feed"] }) });

  const posts = feedQuery.data?.posts || [];
  const scrims = scrimsQuery.data || [];
  const communityData = communityQuery.data;
  const communityItems = communityData?.items || (Array.isArray(communityData) ? communityData : []);
  const players = isOrg
    ? (scoutingQuery.data?.players || [])
    : (topPlayersQuery.data || []);

  return (
    <AppShell hideFooter>
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:h-[calc(100vh-4rem)] lg:grid-cols-[260px_minmax(0,1fr)_310px] lg:overflow-hidden">
        <aside className="space-y-4 lg:overflow-hidden">
          <section className="rounded-lg border border-border bg-card p-4">
            <div className="h-20 rounded-md bg-gradient-hero" />
            <div className="-mt-8 flex items-end gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-card bg-gradient-gold font-display text-xl font-bold text-primary-foreground">
                {(user?.username ?? "me").slice(0, 1).toUpperCase()}
              </div>
              <span className="mb-2 rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-xs text-primary">
                {isOrg ? "Organization" : "Player"}
              </span>
            </div>
            <h1 className="mt-3 font-display text-xl font-bold">@{user?.username}</h1>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              {isOrg ? "Org-only feed, scouting signals, and hosted scrims." : "Your competitive network: posts, teams, clips, clubs, and scrims."}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4">
              <StatCard label={isOrg ? "Saved" : "Followers"} value={isOrg ? "Live" : "0"} />
              <StatCard label={isOrg ? "Scrims" : "Badges"} value={scrims.length} />
            </div>
          </section>
          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="font-display text-sm font-bold">{isOrg ? "Scouting pulse" : "Shortcuts"}</h2>
            <div className="mt-3 grid gap-2 text-sm">
              {isOrg ? (
                <Link to="/scouting" className="rounded-md px-3 py-2 hover:bg-accent/30">Open scouting board</Link>
              ) : (
                <Link to="/profile/$username" params={{ username: user?.username || "" }} className="rounded-md px-3 py-2 hover:bg-accent/30">My profile</Link>
              )}
              <Link to="/scrims" className="rounded-md px-3 py-2 hover:bg-accent/30">Scrims</Link>
              {!isOrg && <Link to="/community" className="rounded-md px-3 py-2 hover:bg-accent/30">Community</Link>}
              <Link to="/clips" className="rounded-md px-3 py-2 hover:bg-accent/30">Browse clips</Link>
            </div>
          </section>
        </aside>

        <main className="no-scrollbar min-h-0 space-y-4 lg:overflow-y-auto lg:pr-1">
          <section className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Send size={18} />
              </div>
              <div className="flex-1">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={isOrg ? "Share an org update, recruitment note, or scrim announcement" : "Share a clip, achievement, team-up request, or scrim result"}
                  className="min-h-20 w-full resize-none rounded-md border border-border bg-input px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><ImagePlus size={14} /> Media</span>
                    <span className="inline-flex items-center gap-1"><Trophy size={14} /> Achievement</span>
                    <span className="inline-flex items-center gap-1"><Users size={14} /> Poll</span>
                  </div>
                  <button
                    type="button"
                    disabled={!draft.trim() || createPost.isPending}
                    onClick={() => createPost.mutate()}
                    className="inline-flex items-center gap-2 rounded-md bg-gradient-gold px-4 py-2 text-sm font-semibold text-primary-foreground shadow-gold disabled:opacity-50"
                  >
                    {createPost.isPending && <Loader2 size={14} className="animate-spin" />}
                    Post
                  </button>
                </div>
              </div>
            </div>
          </section>

          <GameFilterChips value={game} onChange={setGame} />

          {feedQuery.isLoading ? (
            <><SkeletonCard /><SkeletonCard /></>
          ) : posts.length ? (
            posts.map((post: FeedPost) => (
              <PostCard
                key={post.id || post._id}
                post={post}
                onLike={() => likePost.mutate(post.id || post._id!)}
                onSave={() => savePost.mutate(post.id || post._id!)}
                onShare={() => sharePost.mutate(post.id || post._id!)}
              />
            ))
          ) : (
            <EmptyState title="No posts yet" description="Follow players, create a post, or switch game filters to fill the feed." />
          )}
        </main>

        <aside className="space-y-4 lg:overflow-hidden">
          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="font-display text-sm font-bold">{isOrg ? "Top scouted players" : "Players to follow"}</h2>
            <div className="mt-3 space-y-3">
              {players.slice(0, 3).map((player: any) => {
                const username = player.user?.username || player.username;
                return (
                  <Link key={player.id || player._id || username} to="/profile/$username" params={{ username }} className="flex items-center gap-3 rounded-md p-2 hover:bg-accent/30">
                    <img src={player.user?.avatar || player.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${username}`} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{player.displayName || username}</span>
                      <span className="block text-xs text-muted-foreground">{player.stats?.rank || player.rank || "Ranked"} · {player.role || player.roles?.[0] || "Player"}</span>
                    </span>
                  </Link>
                );
              })}
              {!players.length && <p className="text-xs text-muted-foreground">No players found yet.</p>}
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="font-display text-sm font-bold">{isOrg ? "Upcoming hosted scrims" : "Upcoming scrims"}</h2>
            <div className="mt-3 space-y-3">
              {scrims.slice(0, 3).map((event: any) => (
                <Link key={event.id || event._id} to="/scrims" className="block rounded-md border border-border p-3 hover:border-primary/50">
                  <div className="text-sm font-semibold">{event.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{event.status} · {event.registered ?? event.registrations?.length ?? 0}/{event.capacity || event.maxTeams}</div>
                </Link>
              ))}
              {!scrims.length && <p className="text-xs text-muted-foreground">No scrims yet.</p>}
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="font-display text-sm font-bold">Community now</h2>
            <div className="mt-3 space-y-3 text-sm">
              {communityItems.slice(0, 3).map((item: any) => (
                <div key={item.id || item._id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="font-semibold">{item.title || item.name}</div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description || item.date}</p>
                </div>
              ))}
              {!communityItems.length && <p className="text-xs text-muted-foreground">No community events yet.</p>}
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
