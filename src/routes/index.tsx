import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileCard } from "@/components/gaming/ProfileCard";
import { profileApi } from "@/lib/api";
import { mockPlayers } from "@/lib/mock-data";
import {
  Trophy,
  Users,
  Video,
  Search,
  ArrowRight,
  Crown,
  Sparkles,
  Gamepad2,
  Shield,
  Zap,
  Activity,
  CheckCircle,
  TrendingUp,
  Globe,
  Sliders,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ConqLink — The Professional Network for Esports Players" },
      {
        name: "description",
        content:
          "Showcase your rank, stats, and clips across BGMI, Valorant, CS2, and more. Get recruited by tier-1 esports orgs.",
      },
    ],
  }),
  component: Landing,
});

const GAME_MATRIX = {
  bgmi: {
    name: "Battlegrounds Mobile India",
    acronym: "BGMI",
    roles: ["Assaulter", "In-Game Leader (IGL)", "Filter/Support", "Sniper"],
    ranks: ["Ace Dominator", "Conqueror"],
    scouts: "184 active scouts",
    trials: "54 trials this week",
    metrics: [
      { label: "Minimum K/D Target", value: "5.5+" },
      { label: "Avg Headshot Rate", value: "24.5%" },
      { label: "Scrim Placements", value: "Top 5 avg" },
    ],
    glowColor: "rgba(245,158,11,0.2)",
    accentColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  valorant: {
    name: "Valorant Champions",
    acronym: "VALORANT",
    roles: ["Duelist / Entry", "Initiator", "Sentinel / Anchor", "Controller"],
    ranks: ["Immortal 3", "Radiant"],
    scouts: "142 active scouts",
    trials: "42 trials this week",
    metrics: [
      { label: "Minimum ACS Index", value: "240+" },
      { label: "Clutch Win Rate", value: "18.5%+" },
      { label: "KAST% Consistency", value: "74%+" },
    ],
    glowColor: "rgba(239,68,68,0.2)",
    accentColor: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  },
  cs2: {
    name: "Counter-Strike 2",
    acronym: "CS2",
    roles: ["Entry Fragger", "Main AWPer", "Lurker", "Support / IGL"],
    ranks: ["Faceit Level 10", "Global Elite"],
    scouts: "98 active scouts",
    trials: "31 trials this week",
    metrics: [
      { label: "Average ADR Target", value: "84.0+" },
      { label: "Utility Damage / Round", value: "18.2" },
      { label: "First Blood Rate", value: "14.8%+" },
    ],
    glowColor: "rgba(6,182,212,0.2)",
    accentColor: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  },
  freefire: {
    name: "Free Fire Max",
    acronym: "FREE FIRE",
    roles: ["Rusher", "Sniper Team Lead", "Tactician", "Support / Medic"],
    ranks: ["Heroic", "Grandmaster"],
    scouts: "76 active scouts",
    trials: "24 trials this week",
    metrics: [
      { label: "Match Win Ratio", value: "48%+" },
      { label: "Average Kills/Match", value: "6.5+" },
      { label: "Survival Time avg", value: "14m 20s" },
    ],
    glowColor: "rgba(236,72,153,0.2)",
    accentColor: "text-pink-400 bg-pink-400/10 border-pink-400/20",
  },
  apex: {
    name: "Apex Legends Mobile",
    acronym: "APEX",
    roles: ["S-Tier Fragger", "Recon Scout", "Anchor / Support"],
    ranks: ["Apex Master", "Apex Predator"],
    scouts: "64 active scouts",
    trials: "19 trials this week",
    metrics: [
      { label: "Match Kill/Death", value: "4.8+" },
      { label: "Avg Damage Index", value: "1350+" },
      { label: "Tactical Execution Rate", value: "88%" },
    ],
    glowColor: "rgba(20,184,166,0.2)",
    accentColor: "text-teal-400 bg-teal-400/10 border-teal-400/20",
  },
} as const;

type GameKey = keyof typeof GAME_MATRIX;

function Landing() {
  const [selectedGame, setSelectedGame] = useState<GameKey>("bgmi");
  const [consoleLog, setConsoleLog] = useState<string[]>([
    "SYS // CONQLINK CORE SECURE V2.4 ONLINE",
    "NET // Scrim server connection successfully routed",
    "DB // Loaded 3 active organization scouting profiles",
  ]);

  const topQuery = useQuery({
    queryKey: ["topPlayers", "landing"],
    queryFn: () => profileApi.top({ limit: 3 }),
  });

  const apiPlayers = topQuery.data || [];
  const featured = apiPlayers.length ? apiPlayers.map(normalizePlayer) : mockPlayers.slice(0, 3);

  // Add random realistic logs to the interactive dashboard console to make it look alive
  useEffect(() => {
    const logs = [
      "VERIFIED: Player 'Scout_X' registered 6.2 KD on BGMI scrim block",
      "RECRUIT: Team Soul opened trial roster for Tier-1 Assaulter",
      "ALERT: GodLike Esports scout filtered profiles by region: India",
      "SUCCESS: Faceit level 10 rank verification completed for user 'AWP_King'",
      "RECRUIT: Entity Gaming reviewed 14 highlight clips today",
      "VERIFIED: Valorant tournament analytics uploaded to ConqLink stats db",
    ];

    const interval = setInterval(() => {
      const newLog = `SYS // ${logs[Math.floor(Math.random() * logs.length)]}`;
      setConsoleLog((prev) => [newLog, prev[0], prev[1]].slice(0, 3));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppShell>
      {/* HERO HERO HERO */}
      <section className="relative overflow-hidden grid-overlay border-b border-white/5 py-12 md:py-24">
        {/* Spotlights and Auroras */}
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* COPYWRITING CONTAINER */}
            <div className="lg:col-span-7 text-left space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-bold uppercase tracking-wider font-mono shadow-[0_0_15px_rgba(212,175,55,0.05)]">
                <Sparkles size={13} className="animate-pulse" /> Unified Esports Matrix
              </span>

              <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight leading-[1.05] uppercase">
                Where <br />
                <span className="text-gradient-gold text-glow-amber">Champions</span>
                <br />
                get recruited.
              </h1>

              <p className="max-w-xl text-base md:text-lg text-muted-foreground/90 leading-relaxed font-sans">
                The elite professional network for competitive gamers. Build your verified digital
                resume, broadcast match clips, and advance directly into tier-1 scrim pipelines.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-gold text-primary-foreground font-bold shadow-gold hover:shadow-[0_0_25px_oklch(0.85_0.16_90_/_0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                >
                  Claim your profile <ArrowRight size={18} />
                </Link>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 bg-card/40 backdrop-blur-sm hover:border-gold/50 hover:bg-card/75 transition-all duration-300"
                >
                  Explore players
                </Link>
              </div>

              {/* Core Analytics Counter */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5 max-w-lg">
                {[
                  { v: "12,400+", l: "VERIFIED PROS" },
                  { v: "320+", l: "SCOUTING ORGS" },
                  { v: "48K+", l: "SCRIM CLIPS" },
                ].map((s) => (
                  <div key={s.l} className="space-y-1">
                    <div className="text-2xl md:text-3xl font-display font-black text-gradient-gold tracking-tight">
                      {s.v}
                    </div>
                    <div className="text-[9px] font-mono tracking-widest text-muted-foreground uppercase">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HIGH-FIDELITY LIVE INTERACTIVE CONSOLE MOCKUP */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full pointer-events-none" />

              <div className="relative bg-card/65 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-elevated hologram-glow overflow-hidden font-mono text-[11px] leading-relaxed">
                {/* Header terminal controls */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest font-display">
                      Console // ScoutMatrix
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20 uppercase animate-pulse">
                    Live Monitor
                  </span>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-medium">
                      Scouting Heat
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gold font-display">94.8%</span>
                      <TrendingUp size={14} className="text-emerald-400" />
                    </div>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-medium">
                      Active Trials
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gold font-display">1,482</span>
                      <Activity size={14} className="text-gold animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Scouting Pipeline Graph Mock */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 mb-4 space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                    <span className="uppercase font-bold tracking-wider">
                      Weekly Recruiting Conversion
                    </span>
                    <span className="text-gold">Sourcing index</span>
                  </div>
                  {/* Beautiful SVG graph */}
                  <div className="h-16 w-full flex items-end">
                    <svg
                      className="w-full h-full text-gold"
                      viewBox="0 0 100 30"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.85 0.16 90)" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="oklch(0.85 0.16 90)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,25 Q15,10 30,22 T60,5 T90,12 T100,8 L100,30 L0,30 Z"
                        fill="url(#glowGrad)"
                      />
                      <path
                        d="M0,25 Q15,10 30,22 T60,5 T90,12 T100,8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </div>

                {/* Recruiting stages checklist */}
                <div className="space-y-2 mb-4">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    Roster Pipelines Active
                  </div>
                  {[
                    "Entity Gaming // BGMI trial open",
                    "Team Soul // CS2 recruitment filter active",
                    "GodLike Esports // Valorant scout active",
                  ].map((pipe, idx) => (
                    <div
                      key={pipe}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-white/[0.01] border border-white/[0.03]"
                    >
                      <CheckCircle size={12} className="text-gold" />
                      <span className="text-muted-foreground/90 truncate">{pipe}</span>
                    </div>
                  ))}
                </div>

                {/* live logging screen */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-3 font-mono text-[9px] text-gold/80 space-y-1">
                  {consoleLog.map((log, i) => (
                    <div key={i} className="truncate select-none">
                      <span className="text-muted-foreground/60">{`>`}</span> {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC GAME SELECTOR SYSTEM */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 border-b border-white/5">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase">
            Select Your <span className="text-gradient-gold text-glow-amber">Arena</span>
          </h2>
          <p className="mt-3 text-muted-foreground/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Switch between supported titles to inspect verified ranking structures, active scouts,
            and performance targets.
          </p>
        </div>

        {/* Tab Buttons Container */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
          {(Object.keys(GAME_MATRIX) as GameKey[]).map((key) => {
            const active = selectedGame === key;
            const data = GAME_MATRIX[key];
            return (
              <button
                key={key}
                onClick={() => setSelectedGame(key)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all duration-300 border ${
                  active
                    ? "bg-gradient-gold text-primary-foreground border-transparent shadow-gold -translate-y-0.5"
                    : "bg-card/45 border-white/5 text-muted-foreground hover:text-foreground hover:border-white/10 hover:bg-card/75"
                }`}
              >
                {data.acronym}
              </button>
            );
          })}
        </div>

        {/* Game Stats Console Widget */}
        <div
          className="bg-card/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto transition-all duration-500 hover:border-white/10 shadow-elevated relative overflow-hidden"
          style={{ boxShadow: `0 20px 50px -10px ${GAME_MATRIX[selectedGame].glowColor}` }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Box: Ranks & Roles */}
            <div className="space-y-6">
              <div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase font-mono border ${GAME_MATRIX[selectedGame].accentColor}`}
                >
                  {GAME_MATRIX[selectedGame].acronym} ARENA
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-bold mt-2 text-foreground">
                  {GAME_MATRIX[selectedGame].name}
                </h3>
              </div>

              {/* Ranks showcase */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase font-bold">
                  Scouted Competitive Ranks
                </h4>
                <div className="flex flex-wrap gap-2">
                  {GAME_MATRIX[selectedGame].ranks.map((r) => (
                    <span
                      key={r}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-foreground font-mono font-medium"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Roles showcase */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase font-bold">
                  Recruiting Specializations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {GAME_MATRIX[selectedGame].roles.map((r) => (
                    <span
                      key={r}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-gold font-mono font-semibold"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Box: Scouting index dashboard */}
            <div className="bg-black/35 border border-white/5 rounded-xl p-5 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                  Scout Intel Report
                </span>
                <div className="h-2 w-2 rounded-full bg-gold animate-ping" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-mono uppercase">
                    Scout Roster
                  </span>
                  <div className="text-sm font-bold text-foreground font-display">
                    {GAME_MATRIX[selectedGame].scouts}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-mono uppercase">
                    Trials Run
                  </span>
                  <div className="text-sm font-bold text-foreground font-display">
                    {GAME_MATRIX[selectedGame].trials}
                  </div>
                </div>
              </div>

              {/* Metric Targets */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <h4 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase font-bold">
                  Scout Filter Thresholds
                </h4>
                <div className="space-y-2.5">
                  {GAME_MATRIX[selectedGame].metrics.map((m) => (
                    <div key={m.label} className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground/80 font-medium">{m.label}</span>
                      <span className="text-gold font-mono font-bold">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES: FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-b border-white/5">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase">
            Recruiting <span className="text-gradient-gold text-glow-amber">Capabilities</span>
          </h2>
          <p className="mt-3 text-muted-foreground/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            A state-of-the-art suite built for esports matchmaking, telemetry verification, and
            digital card showcasing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Trophy,
              title: "Verified Rank Badges",
              desc: "Verifiable rank telemetry pulled straight from game APIs. Show off actual achievements with pride.",
              accent: "border-amber-500/20",
            },
            {
              icon: Video,
              title: "Interactive Clip Reels",
              desc: "Upload and pin game clips natively inside your card. Let top organizations witness your reflexes directly.",
              accent: "border-rose-500/20",
            },
            {
              icon: Users,
              title: "Scout Filter Console",
              desc: "Tier-1 organizations can search, locate, and filter candidates by exact position, KD, ACS, and region.",
              accent: "border-cyan-500/20",
            },
            {
              icon: Shield,
              title: "Elite Scrim Matrix",
              desc: "Compete in registered high-tier scrim lobbies with real-time stats population and placing tracking.",
              accent: "border-emerald-500/20",
            },
            {
              icon: Gamepad2,
              title: "Multi-Title Portfolio",
              desc: "Showcase verified competitive stats in multiple arenas—BGMI, Valorant, CS2, Free Fire—under a single handle.",
              accent: "border-pink-500/20",
            },
            {
              icon: Zap,
              title: "Autonomous Leaderboards",
              desc: "Ascend global leaderboard indexes calculated dynamically based on verified match telemetry and scrim performance.",
              accent: "border-violet-500/20",
            },
          ].map(({ icon: Icon, title, desc, accent }) => (
            <div
              key={title}
              className={`bg-card/30 backdrop-blur-sm border ${accent} rounded-2xl p-6 hover-lift hover:bg-card/65 transition-all shadow-elevated duration-300 relative overflow-hidden group`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/10 text-gold flex items-center justify-center mb-5 group-hover:border-gold/40 group-hover:text-primary-foreground group-hover:bg-gradient-gold shadow-md transition-all duration-300">
                <Icon size={20} />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground uppercase tracking-tight">
                {title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed font-sans">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PLAYERS: THE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-b border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase">
              Elite <span className="text-gradient-gold text-glow-amber">Drafts</span>
            </h2>
            <p className="text-muted-foreground/80 text-sm md:text-base max-w-md">
              Top performing competitive agents actively looking for trial scrims and scouting
              opportunities.
            </p>
          </div>
          <Link
            to="/explore"
            className="text-sm font-bold text-gold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all font-display uppercase tracking-widest"
          >
            Scan full database <ArrowRight size={15} />
          </Link>
        </div>

        {/* Players Grid list */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p: any) => (
            <ProfileCard key={p.id} player={p} />
          ))}
        </div>
      </section>

      {/* CAPSULE MESH CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="relative bg-card/35 backdrop-blur-lg border border-white/5 rounded-3xl p-10 md:p-14 text-center shadow-elevated overflow-hidden hologram-glow">
          {/* Subtle gold spotlight in CTA */}
          <div className="absolute -inset-x-20 bottom-0 top-1/2 bg-gradient-to-t from-gold/10 via-transparent to-transparent blur-3xl pointer-events-none" />

          <Crown size={40} className="mx-auto text-gold animate-bounce" />
          <h2 className="mt-6 text-3xl md:text-5xl font-display font-black tracking-tight uppercase">
            Ready to{" "}
            <span className="text-gradient-gold text-glow-amber">Secure The Contract?</span>
          </h2>
          <p className="mt-3 text-muted-foreground/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Create your unified digital player portfolio, link your gaming accounts, and instantly
            become visible to over 300+ esports organizations.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-gold text-primary-foreground font-bold shadow-gold hover:shadow-[0_0_25px_oklch(0.85_0.16_90_/_0.55)] hover:-translate-y-0.5 transition-all duration-300 font-display uppercase text-xs tracking-wider"
            >
              Launch Scouting Card <ArrowRight size={16} />
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 font-display uppercase text-xs tracking-wider"
            >
              Scan Global Roster
            </Link>
          </div>
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
    avatar:
      p.user?.avatar || p.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${p.username}`,
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
