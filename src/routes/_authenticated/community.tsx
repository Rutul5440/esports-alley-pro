import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { clubsApi, communityApi } from "@/lib/api";
import { gameName, games } from "@/lib/mock-data";
import type { CommunityItemType, GameId } from "@/types";
import { EmptyState } from "@/components/feature/EmptyState";
import { GameFilterChips } from "@/components/feature/GameFilterChips";
import { SkeletonCard } from "@/components/feature/SkeletonCard";
import {
  CalendarDays,
  Clapperboard,
  Handshake,
  Plus,
  Shield,
  Users,
  X,
  Loader2,
  UserPlus,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/community")({
  head: () => ({ meta: [{ title: "Community - ConqLink" }] }),
  component: Community,
});

const tabs = [
  { id: "all", label: "All", icon: Users },
  { id: "watch-party", label: "Watch Parties", icon: Clapperboard },
  { id: "creator-collab", label: "Collabs", icon: Handshake },
  { id: "team-up", label: "Team Up", icon: Users },
  { id: "clubs", label: "Clubs", icon: Shield },
] as const;

function Community() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("all");
  const [game, setGame] = useState<GameId | "all">("all");
  const [showCreateClub, setShowCreateClub] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [clubName, setClubName] = useState("");
  const [clubDesc, setClubDesc] = useState("");

  // Create community item form
  const [itemTitle, setItemTitle] = useState("");
  const [itemType, setItemType] = useState<CommunityItemType>("watch-party");
  const [itemDesc, setItemDesc] = useState("");
  const [itemDate, setItemDate] = useState("");
  const [itemSlots, setItemSlots] = useState(50);

  const listingsQuery = useQuery({
    queryKey: ["community", tab, game],
    queryFn: () =>
      communityApi.listings({
        type: tab !== "all" && tab !== "clubs" ? tab : undefined,
        game: game === "all" ? undefined : game,
      }),
    enabled: tab !== "clubs",
  });
  const clubsQuery = useQuery({
    queryKey: ["clubs", game],
    queryFn: () => clubsApi.list({ game: game === "all" ? undefined : game }),
    enabled: tab === "clubs" || tab === "all",
  });

  const createClub = useMutation({
    mutationFn: () =>
      clubsApi.create({
        name: clubName,
        gameTag: game === "all" ? "bgmi" : game,
        description: clubDesc || "A new ConqLink club.",
        isPrivate: false,
      }),
    onSuccess: () => {
      setClubName("");
      setClubDesc("");
      setShowCreateClub(false);
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
    },
  });
  const joinClub = useMutation({
    mutationFn: clubsApi.join,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clubs"] }),
  });
  const leaveClub = useMutation({
    mutationFn: clubsApi.leave,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clubs"] }),
  });
  const joinItem = useMutation({
    mutationFn: communityApi.join,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["community"] }),
  });
  const createItem = useMutation({
    mutationFn: () =>
      communityApi.create({
        type: itemType,
        title: itemTitle,
        host: user?.username || "Community",
        game: game === "all" ? "bgmi" : game,
        startsAt: new Date(itemDate).toISOString(),
        slots: itemSlots,
        maxSlots: itemSlots,
        description: itemDesc,
      }),
    onSuccess: () => {
      setItemTitle("");
      setItemDesc("");
      setItemDate("");
      setShowCreateItem(false);
      queryClient.invalidateQueries({ queryKey: ["community"] });
    },
  });

  const listingData = listingsQuery.data;
  const listings = listingData?.items || (Array.isArray(listingData) ? listingData : []);
  const clubs = clubsQuery.data || [];

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-3xl font-bold">Community</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Watch parties, creator collaborations, team-up rooms, and player-created clubs.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowCreateItem(!showCreateItem);
                setShowCreateClub(false);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-semibold hover:border-primary/50"
            >
              <CalendarDays size={16} /> Create event
            </button>
            <button
              onClick={() => {
                setShowCreateClub(!showCreateClub);
                setShowCreateItem(false);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-gold px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold"
            >
              <Plus size={16} /> Create club
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${tab === id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
        <GameFilterChips value={game} onChange={setGame} />

        {/* Create Community Item Form */}
        {showCreateItem && (
          <section className="mt-6 rounded-lg border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Create community event</h2>
              <button onClick={() => setShowCreateItem(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                placeholder="Event title *"
                className="rounded-md border border-border bg-input px-3 py-2 text-sm"
              />
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value as CommunityItemType)}
                className="rounded-md border border-border bg-input px-3 py-2 text-sm"
              >
                <option value="watch-party">Watch Party</option>
                <option value="creator-collab">Creator Collab</option>
                <option value="team-up">Team Up</option>
              </select>
              <input
                type="datetime-local"
                value={itemDate}
                onChange={(e) => setItemDate(e.target.value)}
                className="rounded-md border border-border bg-input px-3 py-2 text-sm"
              />
              <input
                type="number"
                value={itemSlots}
                min={1}
                onChange={(e) => setItemSlots(Number(e.target.value))}
                placeholder="Slots"
                className="rounded-md border border-border bg-input px-3 py-2 text-sm"
              />
            </div>
            <textarea
              value={itemDesc}
              onChange={(e) => setItemDesc(e.target.value)}
              placeholder="Description *"
              rows={2}
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm resize-none"
            />
            <button
              disabled={!itemTitle.trim() || !itemDesc.trim() || !itemDate || createItem.isPending}
              onClick={() => createItem.mutate()}
              className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-4 py-2 text-sm font-semibold text-primary disabled:opacity-50"
            >
              {createItem.isPending && <Loader2 size={14} className="animate-spin" />} Create event
            </button>
          </section>
        )}

        {/* Create Club Form */}
        {showCreateClub && (
          <section className="mt-6 rounded-lg border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Create club</h2>
              <button onClick={() => setShowCreateClub(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="flex gap-3">
              <input
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                placeholder="Club name *"
                className="flex-1 rounded-md border border-border bg-input px-3 py-2 text-sm"
              />
              <button
                disabled={!clubName.trim() || createClub.isPending}
                onClick={() => createClub.mutate()}
                className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-4 py-2 text-sm font-semibold text-primary disabled:opacity-50"
              >
                {createClub.isPending && <Loader2 size={14} className="animate-spin" />} Create
              </button>
            </div>
            <textarea
              value={clubDesc}
              onChange={(e) => setClubDesc(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm resize-none"
            />
          </section>
        )}

        {/* Clubs */}
        {(tab === "all" || tab === "clubs") && (
          <section className="mt-8">
            <h2 className="font-display text-xl font-bold">Clubs</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clubsQuery.isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                clubs.map((club: any) => {
                  const isMember = club.members?.includes(user?.id);
                  return (
                    <article
                      key={club._id || club.id}
                      className="rounded-lg border border-border bg-card p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-lg font-bold">{club.name}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {gameName(club.gameTag)} ·{" "}
                            {club.memberCount || club.members?.length || 0} members
                          </p>
                        </div>
                        <Shield className="text-primary" size={20} />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {club.description || "A ConqLink community club."}
                      </p>
                      <button
                        onClick={() =>
                          isMember
                            ? leaveClub.mutate(club._id || club.id)
                            : joinClub.mutate(club._id || club.id)
                        }
                        className={`mt-4 inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm ${isMember ? "border-destructive/30 text-destructive hover:bg-destructive/10" : "border-border hover:border-primary/50"}`}
                      >
                        {isMember ? (
                          <>
                            <LogOut size={14} /> Leave
                          </>
                        ) : (
                          <>
                            <UserPlus size={14} /> Join club
                          </>
                        )}
                      </button>
                    </article>
                  );
                })
              )}
              {!clubsQuery.isLoading && !clubs.length && (
                <EmptyState
                  title="No clubs yet"
                  description="Create the first club for this game filter."
                />
              )}
            </div>
          </section>
        )}

        {/* Community Items */}
        {tab !== "clubs" && (
          <section className="mt-8 grid gap-4 md:grid-cols-2">
            {listingsQuery.isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              listings.map((item: any) => (
                <article
                  key={item.id || item._id}
                  className="rounded-lg border border-border bg-card p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-primary/10 p-2 text-primary">
                        <CalendarDays size={20} />
                      </span>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                          {item.type}
                        </div>
                        <h2 className="mt-1 font-display text-lg font-bold">{item.title}</h2>
                      </div>
                    </div>
                    <span className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
                      {gameName(item.game)}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  <div className="mt-5 grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-4">
                    <Info
                      label="Host"
                      value={
                        item.host?.username || item.host || item.creator?.username || "Community"
                      }
                    />
                    <Info
                      label="When"
                      value={
                        item.date ||
                        (item.startsAt ? new Date(item.startsAt).toLocaleString() : "TBA")
                      }
                    />
                    <Info
                      label="Slots"
                      value={
                        item.slots ? `${item.participants?.length || 0}/${item.slots}` : "Open"
                      }
                    />
                    <div className="flex items-end">
                      <button
                        onClick={() => joinItem.mutate(item._id || item.id)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/20"
                      >
                        <UserPlus size={13} /> Join
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
            {!listingsQuery.isLoading && !listings.length && (
              <EmptyState
                title="No community listings"
                description="Try another game or create an event."
              />
            )}
          </section>
        )}
      </div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
