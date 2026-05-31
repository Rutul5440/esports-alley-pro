import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { gameName, getPlayerByUsername, mockOrganizations } from "@/lib/mock-data";
import { profileApi, authApi, postsApi, clipsApi } from "@/lib/api";
import { RankBadge } from "@/components/gaming/RankBadge";
import { StatsDisplay } from "@/components/gaming/StatsDisplay";
import { VideoPlayer } from "@/components/gaming/VideoPlayer";
import { PostCard } from "@/components/feature/PostCard";
import { BadgeCheck, MapPin, Users, Award, MessageSquare, UserPlus, Gamepad2, Medal, BriefcaseBusiness, Settings, UserMinus, Loader2 } from "lucide-react";

export const Route = createFileRoute("/profile/$username")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.username} — ConqLink` },
      { name: "description", content: `Esports player profile for @${params.username}.` },
    ],
  }),
  component: Profile,
});

import { cn } from "@/lib/utils";

function Profile() {
  const { username } = Route.useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isOwnProfile = user?.username === username;
  const profileQuery = useQuery({ queryKey: ["profile", username], queryFn: () => profileApi.get(username), retry: false });
  const apiProfile = profileQuery.data;
  const player = normalizePlayer(apiProfile) || getPlayerByUsername(username);

  const isFollowing = apiProfile?.user?.followers?.some((f: any) => {
    const fId = typeof f === "object" ? (f._id || f.id) : f;
    return String(fId) === String(user?.id || user?._id);
  }) || false;

  const postsQuery = useQuery({
    queryKey: ["userPosts", username],
    queryFn: async () => {
      const profile = apiProfile;
      const userId = profile?.user?._id || profile?._id;
      if (!userId) return { posts: [] };
      return postsApi.getByUser(userId);
    },
    enabled: !!apiProfile && apiProfile?.type !== "organization",
  });

  const followMutation = useMutation({
    mutationFn: () => {
      const userId = apiProfile?.user?._id || apiProfile?._id;
      return authApi.follow(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
    },
  });

  // Track profile view
  useQuery({
    queryKey: ["profileView", username],
    queryFn: () => {
      const userId = apiProfile?.user?._id || apiProfile?._id;
      if (userId && !isOwnProfile) return profileApi.trackView(userId);
      return null;
    },
    enabled: !!apiProfile && !isOwnProfile,
    staleTime: Infinity,
  });

  if (apiProfile?.type === "organization" || (!player && user?.username === username && user.role === "organization")) {
      const org = apiProfile?.organization || mockOrganizations[0];
      return (
        <AppShell>
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <section className="rounded-lg border border-border bg-gradient-surface p-6 shadow-elevated">
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <img src={org.logo} alt="" className="h-24 w-24 rounded-lg border border-border bg-card object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-3xl font-bold">{org.name || user?.username}</h1>
                    <BadgeCheck className="text-primary" size={22} />
                  </div>
                  <p className="mt-1 text-muted-foreground">Organization profile · Scouting and scrim operations</p>
                  <p className="mt-4 max-w-2xl text-sm leading-6">{org.description}</p>
                </div>
                <Link to="/scouting" className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-gold px-4 py-2 font-semibold text-primary-foreground shadow-gold">
                  <BriefcaseBusiness size={16} /> Open scouting
                </Link>
              </div>
              <div className="mt-6 grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
                <MiniMetric label="Followers" value={(org.followers || org.followersCount || 0).toLocaleString()} />
                <MiniMetric label="Active games" value={(org.activeGames || []).map(gameName).join(", ")} />
                <MiniMetric label="Open roles" value={(org.openRoles || []).join(", ")} />
              </div>
            </section>
          </div>
        </AppShell>
      );
  }

  if (profileQuery.isLoading) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <Loader2 size={24} className="mx-auto animate-spin text-primary" />
          <p className="mt-3 text-muted-foreground">Loading profile...</p>
        </div>
      </AppShell>
    );
  }

  if (!player) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-display font-bold">Player not found</h1>
          <p className="text-muted-foreground mt-2">No profile for @{username}.</p>
          <Link to="/explore" className="mt-6 inline-block text-primary hover:underline">Explore players</Link>
        </div>
      </AppShell>
    );
  }

  const userPosts = postsQuery.data?.posts || [];

  return (
    <AppShell>
      {/* Banner */}
      <div className="h-48 md:h-64 bg-gradient-hero border-b border-border relative">
        <div className="absolute inset-0 bg-gradient-surface opacity-60" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 relative">
        <div className="bg-gradient-surface border border-border rounded-2xl p-6 md:p-8 shadow-elevated">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <img
              src={player.avatar}
              alt={player.displayName}
              className="w-32 h-32 rounded-full border-4 border-primary/40 shadow-gold object-cover -mt-16 md:-mt-20"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-display font-bold">{player.displayName}</h1>
                {player.verified && <BadgeCheck className="text-primary" size={22} />}
              </div>
              <p className="text-muted-foreground">@{player.username}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <RankBadge rank={player.rank} tier={player.tier} />
                {player.location && <span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin size={14} />{player.location}</span>}
                <span className="inline-flex items-center gap-1 text-muted-foreground"><Users size={14} />{player.followers.toLocaleString()} followers</span>
              </div>
            </div>
            <div className="flex gap-2">
              {isOwnProfile ? (
                <Link to="/settings" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:border-primary/50 transition-colors">
                  <Settings size={16} /> Edit Profile
                </Link>
              ) : (
                <>
                  <button onClick={() => followMutation.mutate()} disabled={followMutation.isPending}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-200 cursor-pointer",
                      isFollowing
                        ? "bg-secondary text-secondary-foreground border border-border hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-500"
                        : "bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-90"
                    )}>
                    {followMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isFollowing ? (
                      <UserMinus size={16} />
                    ) : (
                      <UserPlus size={16} />
                    )}
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:border-primary/50 transition-colors">
                    <MessageSquare size={16} /> Message
                  </button>
                </>
              )}
            </div>
          </div>

          <p className="mt-6 text-foreground/90">{player.bio}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {player.roles.map((r: string) => (
              <span key={r} className="text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-accent/40 border border-border">{r}</span>
            ))}
            {player.preferredGames.map((game: string) => (
              <span key={game} className="inline-flex items-center gap-1 text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/30">
                <Gamepad2 size={12} /> {gameName(game)}
              </span>
            ))}
            {player.team && (
              <span className="text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/30">{player.team}</span>
            )}
          </div>
        </div>

        {/* Stats */}
        <Section title="Career Stats">
          <StatsDisplay stats={player.stats} />
        </Section>

        <Section title="Competitive Signals">
          <div className="grid gap-3 sm:grid-cols-3">
            <MiniMetric label="Skill score" value={`${player.skillScore}/100`} />
            <MiniMetric label="Profile views" value={player.profileViews.toLocaleString()} />
            <MiniMetric label="Team status" value={player.isOpenToTeam ? "Open to team" : "Signed"} />
          </div>
          {player.badges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {player.badges.map((badge: string) => (
                <span key={badge} className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                  <Medal size={15} /> {badge} Scrim
                </span>
              ))}
            </div>
          )}
        </Section>

        {/* Achievements */}
        {player.achievements.length > 0 && (
          <Section title="Achievements">
            <div className="grid sm:grid-cols-2 gap-3">
              {player.achievements.map((a: any) => (
                <div key={a.id || a._id} className="bg-gradient-surface border border-border rounded-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    <Award size={18} />
                  </div>
                  <div>
                    <div className="font-semibold">{a.title}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{a.tier || a.badge} • {new Date(a.earnedAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Clips */}
        {player.clips.length > 0 && (
          <Section title="Highlight Clips">
            <div className="grid sm:grid-cols-2 gap-5">
              {player.clips.map((c: any) => <VideoPlayer key={c.id || c._id} clip={c} />)}
            </div>
          </Section>
        )}

        {/* User Posts */}
        {userPosts.length > 0 && (
          <Section title="Recent Posts">
            <div className="space-y-4">
              {userPosts.slice(0, 5).map((post: any) => (
                <PostCard key={post.id || post._id} post={post} />
              ))}
            </div>
          </Section>
        )}

        <div className="h-16" />
      </div>
    </AppShell>
  );
}

function normalizePlayer(profile: any) {
  if (!profile || profile.type === "organization") return null;
  const profileUser = profile.user || {};
  const stats = profile.stats || profile.gameStats?.[0] || {};
  return {
    id: profile._id || profile.id,
    username: profileUser.username || profile.username,
    displayName: profile.displayName || profileUser.username || "Player",
    avatar: profileUser.avatar || "https://api.dicebear.com/9.x/initials/svg?seed=Player",
    banner: profile.bannerImage || "",
    bio: profile.bio || "",
    location: profile.country || "",
    team: profile.team,
    rank: stats.rank || "Bronze",
    tier: stats.tier || 1,
    roles: profile.roles?.length ? profile.roles : [profile.role].filter(Boolean),
    preferredGames: profile.preferredGames || ["bgmi"],
    badges: profile.badges || [],
    skillScore: profile.skillScore || 0,
    profileViews: profile.profileViews || 0,
    isOpenToTeam: profile.isOpenToTeam ?? profile.openToTeam ?? true,
    stats: {
      matches: stats.totalMatches || 0,
      wins: stats.totalWins || 0,
      kills: stats.kills || 0,
      kd: stats.kd || 0,
      avgDamage: stats.avgDamage || 0,
      headshotPct: stats.headshotPct || 0,
    },
    achievements: profile.achievements || [],
    clips: profile.clips || [],
    followers: profileUser.followers?.length || 0,
    following: profileUser.following?.length || 0,
    verified: profileUser.isVerified,
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-display font-bold mb-4">{title}</h2>
      {children}
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg font-bold">{value}</div>
    </div>
  );
}
