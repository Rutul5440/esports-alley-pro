import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileCard } from "@/components/gaming/ProfileCard";
import { profileApi } from "@/lib/api";
import { mockPlayers } from "@/lib/mock-data";
import { Trophy, Users, Video, Search, ArrowRight, Crown, Sparkles, Gamepad2, Shield, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ConqLink — The Professional Network for Esports Players" },
      { name: "description", content: "Showcase your rank, stats, and clips across BGMI, Valorant, CS2, and more. Get recruited by tier-1 esports orgs." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const topQuery = useQuery({
    queryKey: ["topPlayers", "landing"],
    queryFn: () => profileApi.top({ limit: 3 }),
  });

  const apiPlayers = topQuery.data || [];
  const featured = apiPlayers.length ? apiPlayers.map(normalizePlayer) : mockPlayers.slice(0, 3);

  return (
    <AppShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={14} /> Multi-game esports platform
          </span>
          <h1 className="mt-6 text-5xl md:text-7xl font-display font-black tracking-tight">
            Where <span className="text-gradient-gold">Champions</span><br />get recruited.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            The professional network for competitive gamers. Build a profile orgs actually scout. Stats, ranks, clips — all in one place. Supports BGMI, Valorant, CS2, Free Fire, and more.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90 transition-opacity">
              Claim your profile <ArrowRight size={18} />
            </Link>
            <Link to="/explore" className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-border bg-card hover:border-primary/50 transition-colors">
              Explore players
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto">
            {[
              { v: "12K+", l: "Players" },
              { v: "320+", l: "Orgs scouting" },
              { v: "48K", l: "Clips uploaded" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-3xl md:text-4xl font-display font-bold text-gradient-gold">{s.v}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold">Everything you need to get scouted</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">One platform for your entire esports career — from ranked climb to org trial.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Trophy, title: "Rank Showcase", desc: "Display verified ranks across BGMI, Valorant, CS2, and more with tier badges." },
            { icon: Video, title: "Clip Portfolio", desc: "Upload highlight reels. Let your gameplay speak before the interview." },
            { icon: Users, title: "Org Recruiting", desc: "Be discoverable by tier-1 orgs filtering by role, rank, and region." },
            { icon: Shield, title: "Scrim Engine", desc: "Tiered competitive scrim blocks with registration, results, and analytics." },
            { icon: Gamepad2, title: "Multi-Game", desc: "One profile across BGMI, Valorant, CS2, Free Fire, Apex, and more." },
            { icon: Zap, title: "Leaderboards", desc: "Skill-based rankings computed from your scrim results and match performance." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-gradient-surface border border-border rounded-xl p-6 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Icon size={22} />
              </div>
              <h3 className="font-display font-bold text-lg">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PLAYERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold">Featured players</h2>
            <p className="text-muted-foreground text-sm mt-1">Top-ranked players actively looking for orgs.</p>
          </div>
          <Link to="/explore" className="text-sm text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p: any) => <ProfileCard key={p.id} player={p} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="bg-gradient-surface border border-primary/30 rounded-2xl p-10 text-center shadow-elevated">
          <Crown size={36} className="mx-auto text-primary" />
          <h2 className="mt-4 text-3xl font-display font-bold">Ready to drop in?</h2>
          <p className="mt-2 text-muted-foreground">Join thousands of esports players building their career across multiple games.</p>
          <Link to="/register" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-gold text-primary-foreground font-semibold shadow-gold">
            Create free profile <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </AppShell>
  );
}

function normalizePlayer(p: any) {
  return {
    id: p._id || p.id,
    username: p.user?.username || p.username || "player",
    displayName: p.displayName || p.user?.username || "Player",
    avatar: p.user?.avatar || p.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${p.username}`,
    banner: p.bannerImage || "",
    bio: p.bio || "",
    location: p.country || "",
    team: p.team,
    rank: p.stats?.rank || "Bronze",
    tier: p.stats?.tier || 1,
    roles: p.roles?.length ? p.roles : [p.role].filter(Boolean),
    preferredGames: p.preferredGames || ["bgmi"],
    badges: p.badges || [],
    skillScore: p.skillScore || 0,
    profileViews: p.profileViews || 0,
    isOpenToTeam: p.isOpenToTeam ?? true,
    stats: p.stats || { matches: 0, wins: 0, kills: 0, kd: 0, avgDamage: 0, headshotPct: 0 },
    achievements: p.achievements || [],
    clips: p.clips || [],
    followers: p.user?.followers?.length || 0,
    following: p.user?.following?.length || 0,
    verified: p.user?.isVerified || p.verified,
  };
}
