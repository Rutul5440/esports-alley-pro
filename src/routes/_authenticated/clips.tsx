import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { clipsApi } from "@/lib/api";
import { gameName, games } from "@/lib/mock-data";
import type { GameId } from "@/types";
import { EmptyState } from "@/components/feature/EmptyState";
import { GameFilterChips } from "@/components/feature/GameFilterChips";
import { SkeletonCard } from "@/components/feature/SkeletonCard";
import { Eye, Heart, Play, TrendingUp, Clock, ThumbsUp, Upload } from "lucide-react";

export const Route = createFileRoute("/_authenticated/clips")({
  head: () => ({ meta: [{ title: "Clips - ConqLink" }] }),
  component: Clips,
});

const sortOptions = [
  { id: "recent", label: "Recent", icon: Clock },
  { id: "popular", label: "Most Viewed", icon: TrendingUp },
  { id: "liked", label: "Most Liked", icon: ThumbsUp },
];

function Clips() {
  const queryClient = useQueryClient();
  const [game, setGame] = useState<GameId | "all">("all");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);

  const clipsQuery = useQuery({
    queryKey: ["clips", game, sort, page],
    queryFn: () => clipsApi.list({
      game: game === "all" ? undefined : game,
      sort,
      page,
    }),
  });

  const likeClip = useMutation({
    mutationFn: (clipId: string) => clipsApi.like(clipId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clips"] }),
  });

  const data = clipsQuery.data;
  const clips = data?.clips || [];
  const totalPages = data?.pages || 1;

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-3xl font-bold">Clips</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Browse highlight reels from the community. Filter by game, sort by trending.
            </p>
          </div>
          <Link to="/upload" className="inline-flex items-center gap-2 rounded-md bg-gradient-gold px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold">
            <Upload size={16} /> Upload clip
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <GameFilterChips value={game} onChange={(g) => { setGame(g); setPage(1); }} />
          <div className="flex gap-2 ml-auto">
            {sortOptions.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => { setSort(id); setPage(1); }}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm ${sort === id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clipsQuery.isLoading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : clips.length ? (
            clips.map((clip: any) => (
              <article key={clip._id} className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors">
                <div className="relative aspect-video bg-muted">
                  {clip.thumbnailUrl ? (
                    <img src={clip.thumbnailUrl} alt={clip.title} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Play size={36} className="text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-gold">
                      <Play size={20} />
                    </div>
                  </div>
                  {clip.duration && (
                    <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                      {Math.floor(clip.duration / 60)}:{String(Math.floor(clip.duration % 60)).padStart(2, "0")}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate">{clip.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{clip.uploader?.username || "Player"}</span>
                    <span>·</span>
                    <span>{gameName(clip.game)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1"><Eye size={13} /> {(clip.views || 0).toLocaleString()}</span>
                      <button onClick={() => likeClip.mutate(clip._id)} className="inline-flex items-center gap-1 hover:text-primary transition-colors">
                        <Heart size={13} /> {clip.likes?.length || 0}
                      </button>
                    </div>
                    <span>{new Date(clip.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState title="No clips yet" description="Be the first to upload a highlight clip!" />
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-md border border-border px-4 py-2 text-sm disabled:opacity-30">Previous</button>
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-md border border-border px-4 py-2 text-sm disabled:opacity-30">Next</button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
