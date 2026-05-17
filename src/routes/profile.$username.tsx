import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { getPlayerByUsername } from "@/lib/mock-data";
import { RankBadge } from "@/components/gaming/RankBadge";
import { StatsDisplay } from "@/components/gaming/StatsDisplay";
import { VideoPlayer } from "@/components/gaming/VideoPlayer";
import { BadgeCheck, MapPin, Users, Award, MessageSquare, UserPlus } from "lucide-react";

export const Route = createFileRoute("/profile/$username")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.username} — ConqLink` },
      { name: "description", content: `BGMI player profile for @${params.username}.` },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { username } = Route.useParams();
  const player = getPlayerByUsername(username);

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
                <span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin size={14} />{player.location}</span>
                <span className="inline-flex items-center gap-1 text-muted-foreground"><Users size={14} />{player.followers.toLocaleString()} followers</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90 transition-opacity">
                <UserPlus size={16} /> Follow
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:border-primary/50 transition-colors">
                <MessageSquare size={16} /> Message
              </button>
            </div>
          </div>

          <p className="mt-6 text-foreground/90">{player.bio}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {player.roles.map((r) => (
              <span key={r} className="text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-accent/40 border border-border">
                {r}
              </span>
            ))}
            {player.team && (
              <span className="text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/30">
                {player.team}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <Section title="Career Stats">
          <StatsDisplay stats={player.stats} />
        </Section>

        {/* Achievements */}
        {player.achievements.length > 0 && (
          <Section title="Achievements">
            <div className="grid sm:grid-cols-2 gap-3">
              {player.achievements.map((a) => (
                <div key={a.id} className="bg-gradient-surface border border-border rounded-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    <Award size={18} />
                  </div>
                  <div>
                    <div className="font-semibold">{a.title}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{a.tier} • {new Date(a.earnedAt).toLocaleDateString()}</div>
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
              {player.clips.map((c) => <VideoPlayer key={c.id} clip={c} />)}
            </div>
          </Section>
        )}

        <div className="h-16" />
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-display font-bold mb-4">{title}</h2>
      {children}
    </section>
  );
}
