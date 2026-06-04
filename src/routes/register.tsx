import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState, useEffect, type FormEvent } from "react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { GameId, UserRole } from "@/types";
import { games } from "@/lib/mock-data";
import {
  BriefcaseBusiness,
  Check,
  Gamepad2,
  Loader2,
  Trophy,
  Sparkles,
  Star,
  ChevronRight,
  ShieldCheck,
  Chrome,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Sign up - ConqLink" }] }),
  component: Register,
});

const roles = ["IGL", "Assaulter", "Support", "Scout", "Sniper", "Fragger", "All-rounder"];
const ranks = [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Crown",
  "Ace",
  "Ace Master",
  "Conqueror",
];
const orgTypes = [
  "Esports Team",
  "Gaming Company",
  "Content Studio",
  "Tournament Organizer",
  "Sponsor",
];

const GAME_CONFIG: Record<
  string,
  {
    name: string;
    ranks: string[];
    roles: string[];
    hasUID?: boolean;
    uidLabel?: string;
  }
> = {
  bgmi: {
    name: "BGMI",
    ranks: [
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Diamond",
      "Crown",
      "Ace",
      "Ace Master",
      "Conqueror",
    ],
    roles: ["IGL", "Assaulter", "Support", "Scout", "Sniper", "Fragger", "All-rounder"],
    hasUID: true,
    uidLabel: "BGMI UID (Optional)",
  },
  valorant: {
    name: "Valorant",
    ranks: [
      "Iron",
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Diamond",
      "Ascendant",
      "Immortal",
      "Radiant",
    ],
    roles: ["Duelist", "Initiator", "Controller", "Sentinel"],
  },
  cs2: {
    name: "CS2",
    ranks: [
      "Silver",
      "Gold Nova",
      "Master Guardian",
      "Legendary Eagle",
      "Supreme Master",
      "Global Elite",
    ],
    roles: ["Entry Fragger", "AWPer", "Lurker", "Support", "In-Game Leader"],
  },
  "free-fire": {
    name: "Free Fire",
    ranks: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Heroic", "Grandmaster"],
    roles: ["Rusher", "Sniper", "Support", "Flanker", "IGL"],
  },
  "apex-legends": {
    name: "Apex Legends",
    ranks: ["Rookie", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Apex Predator"],
    roles: ["Offensive", "Defensive", "Support", "Recon"],
  },
  "pubg-ns": {
    name: "PUBG New State",
    ranks: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Contender", "Master", "Conqueror"],
    roles: ["IGL", "Assaulter", "Support", "Scout", "Sniper"],
  },
};

function Register() {
  const { register, completeProfile, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("player");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "India",
    dateOfBirth: "",
    bgmiUID: "",
    preferredGames: [] as GameId[],
    inGameRole: "Fragger",
    rank: "Ace",
    preferredMode: "Squad",
    playStyle: "Balanced",
    languages: "English, Hindi",
    bio: "",
    openToRecruit: true,
    openToTeam: true,
    organizationName: "",
    orgType: "Esports Team",
    website: "",
    foundedYear: "2024",
    recruitmentRegions: "India, South Asia",
  });

  const [gameData, setGameData] = useState<
    Record<string, { rank: string; role: string; bgmiUID?: string }>
  >({
    bgmi: { rank: "Ace", role: "Fragger", bgmiUID: "" },
    valorant: { rank: "Gold", role: "Controller" },
    cs2: { rank: "Master Guardian", role: "AWPer" },
    "free-fire": { rank: "Diamond", role: "Rusher" },
    "apex-legends": { rank: "Platinum", role: "Support" },
    "pubg-ns": { rank: "Master", role: "Assaulter" },
  });

  const usernameCheck = useMutation({ mutationFn: authApi.checkUsername });
  const totalSteps = 3;

  const usernameState = useMemo(() => {
    if (!form.username || form.username.length < 3) return "";
    if (usernameCheck.isPending) return "Checking...";
    if (usernameCheck.data?.available) return "Username available";
    if (usernameCheck.data && !usernameCheck.data.available) return "Username taken";
    return "";
  }, [form.username, usernameCheck.data, usernameCheck.isPending]);

  // Listen for Google Auth Popup Response
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "GOOGLE_AUTH_SUCCESS") {
        setError("");
        try {
          const { email, fullName, avatar } = event.data;
          await googleLogin(email, undefined, fullName, avatar);
          navigate({ to: "/dashboard" });
        } catch (err: any) {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Google authentication failed. Please try again.";
          setError(msg);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [googleLogin, navigate]);

  const handleGoogleSignIn = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      "/google-auth-mock",
      "GoogleAuthMockWindow",
      `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes`,
    );
  };

  const update = (key: keyof typeof form, value: any) =>
    setForm((current) => ({ ...current, [key]: value }));

  const toggleGame = (game: GameId) => {
    update(
      "preferredGames",
      form.preferredGames.includes(game)
        ? form.preferredGames.filter((item) => item !== game)
        : [...form.preferredGames, game],
    );
  };

  const validateStep = async (currentStep: number): Promise<boolean> => {
    setError("");
    if (currentStep === 1) {
      if (!form.username || !form.email || !form.password) {
        setError("Username, email, and password are required.");
        return false;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return false;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return false;
      }
      try {
        const checked = await usernameCheck.mutateAsync(form.username);
        if (!checked.available) {
          setError("That username is already taken.");
          return false;
        }
      } catch (err) {
        console.error("Username availability check failed:", err);
      }
    }
    if (currentStep === 2) {
      if (role === "player" && form.preferredGames.length === 0) {
        setError("Please select at least one game before continuing.");
        return false;
      }
    }
    return true;
  };

  const next = async () => {
    const isValid = await validateStep(step);
    if (!isValid) return;
    setStep((current) => Math.min(totalSteps, current + 1));
  };

  const handleStepClick = async (targetStep: number) => {
    if (targetStep === step) return;
    if (targetStep > step) {
      // Do not allow skipping forward by clicking the sidebar stepper directly.
      // Users must strictly use the "Continue" button or hit Enter to move forward.
      return;
    }
    setError("");
    setStep(targetStep);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      // Intercept implicit submissions (like hitting Enter) on steps 1 and 2
      next();
      return;
    }
    setError("");
    try {
      await register(form.username, form.email, form.password, role, {
        fullName: role === "player" ? form.fullName : form.organizationName,
        country: form.country,
        dateOfBirth: form.dateOfBirth,
      });

      // Clean UID so empty inputs do not crash MongoDB sparse unique indices
      const cleanBGMIUID =
        form.preferredGames.includes("bgmi") && gameData.bgmi?.bgmiUID?.trim() !== ""
          ? gameData.bgmi.bgmiUID!.trim()
          : undefined;

      await completeProfile(
        role === "player"
          ? {
              fullName: form.fullName,
              displayName: form.fullName || form.username,
              country: form.country,
              dateOfBirth: form.dateOfBirth || undefined,
              bgmiUID: cleanBGMIUID,
              preferredGames: form.preferredGames,
              gamePreferences: form.preferredGames.map((game) => ({
                game,
                rank: gameData[game]?.rank || "Bronze",
                kd: 0,
                winRate: 0,
                avgDamage: 0,
                totalMatches: 0,
              })),
              role:
                form.preferredGames.length > 0
                  ? gameData[form.preferredGames[0]]?.role || "Fragger"
                  : "Fragger",
              roles: form.preferredGames.map((g) => gameData[g]?.role).filter(Boolean),
              preferredMode: form.preferredMode,
              playStyle: form.playStyle,
              languages: form.languages
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              bio: form.bio,
              openToRecruit: form.openToRecruit,
              openToTeam: form.openToTeam,
            }
          : {
              name: form.organizationName || form.username,
              organizationName: form.organizationName,
              country: form.country,
              orgType: form.orgType,
              website: form.website || undefined,
              foundedYear: form.foundedYear ? Number(form.foundedYear) : undefined,
              activeGames: form.preferredGames,
              openRoles:
                form.preferredGames.length > 0
                  ? [gameData[form.preferredGames[0]]?.role || "Fragger"]
                  : ["Fragger"],
              recruitmentRegions: form.recruitmentRegions
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              recruitmentCriteria: {
                minRank:
                  form.preferredGames.length > 0
                    ? gameData[form.preferredGames[0]]?.rank || "Bronze"
                    : "Bronze",
                roles:
                  form.preferredGames.length > 0
                    ? [gameData[form.preferredGames[0]]?.role || "Fragger"]
                    : ["Fragger"],
                minKD: 0,
              },
            },
      );
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Could not create account. Check the form and try again.";
      setError(msg);
    }
  };

  // Dynamic feature highlights for sidebar
  const roleFeatures =
    role === "player"
      ? [
          {
            title: "Multi-Game Portfolios",
            desc: "Display ranks, KD, and stats across BGMI, Valorant, and CS2 in one place.",
          },
          {
            title: "Verifiable Digital Badges",
            desc: "Earn official, verifiable badges directly from custom scrims.",
          },
          {
            title: "Scouting Discovery",
            desc: "Get found by recruiters based on your roles (IGL, Sniper, Fragger).",
          },
          {
            title: "Community Highlights",
            desc: "Join clubs, upload clutch clip video links, and run polls.",
          },
        ]
      : [
          {
            title: "Talent Scouting Console",
            desc: "Search, filter, and shortlist active players by specific roles, KDs, and regions.",
          },
          {
            title: "Automated Scrim hosting",
            desc: "Schedule competitive custom blocks, automate registrations, and manage results.",
          },
          {
            title: "Roster assemblies",
            desc: "Form roster setups, request specific tier ranges, and manage contracts.",
          },
          {
            title: "Verified Brand Pages",
            desc: "Gain sponsor credibility and audience growth with official corporate badges.",
          },
        ];

  return (
    <main className="min-h-screen auth-page-bg px-4 py-8 flex flex-col items-center justify-center relative overflow-y-auto">
      {/* Background radial overlays for extra contrast */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60 pointer-events-none" />

      <div className="mx-auto w-full max-w-6xl relative z-10 animate-fade-in">
        <Link to="/" className="mx-auto flex w-fit items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-gold shadow-gold">
            <Trophy size={20} className="text-primary-foreground" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            Conq<span className="text-gradient-gold">Link</span>
          </span>
        </Link>

        <div className="mt-8 overflow-hidden rounded-2xl glass-auth-card shadow-2xl h-auto lg:h-[680px]">
          <div className="grid lg:grid-cols-[380px_1fr] h-full">
            {/* Sidebar with dynamic values */}
            <aside className="p-6 bg-black/15 lg:border-r border-b lg:border-b-0 border-white/5 space-y-6 flex flex-col justify-between h-full overflow-y-auto custom-scrollbar">
              <div>
                <h1 className="font-display text-2xl font-bold text-white tracking-tight">
                  Create your profile
                </h1>
                <p className="mt-2 text-xs leading-5 text-zinc-400">
                  Set up the account, competitive identity, and recruitment signals in one pass.
                </p>

                {/* Role Switcher */}
                <div className="mt-6 grid gap-3">
                  <RoleCard
                    active={role === "player"}
                    icon={Gamepad2}
                    title="Player"
                    onClick={() => {
                      setRole("player");
                      setStep(1);
                    }}
                  />
                  <RoleCard
                    active={role === "organization"}
                    icon={BriefcaseBusiness}
                    title="Organization"
                    onClick={() => {
                      setRole("organization");
                      setStep(1);
                    }}
                  />
                </div>

                {/* Steps with buttons */}
                <div className="mt-6 grid gap-2">
                  {[
                    "Account",
                    role === "player" ? "Gaming identity" : "Organization details",
                    role === "player" ? "Profile setup" : "Recruitment",
                  ].map((label, index) => {
                    const targetStep = index + 1;
                    return (
                      <button
                        type="button"
                        key={label}
                        onClick={() => handleStepClick(targetStep)}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-md border px-3.5 py-2.5 text-xs font-semibold text-left transition-all duration-300",
                          step === targetStep
                            ? "border-primary/50 bg-primary/15 text-primary ring-1 ring-primary/20 shadow-sm"
                            : step > targetStep
                              ? "border-primary/20 bg-primary/[0.03] text-primary/80"
                              : "border-white/5 text-zinc-400 hover:bg-white/[0.02]",
                        )}
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px]">
                          {step > targetStep ? <Check size={11} /> : targetStep}
                        </span>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Feature List */}
              <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles size={12} />
                  <span className="font-display text-[10px] font-bold uppercase tracking-wider font-mono">
                    Features included
                  </span>
                </div>
                <div className="space-y-3.5">
                  {roleFeatures.map((f, i) => (
                    <div key={i} className="flex gap-2.5 items-start text-left">
                      <ShieldCheck size={14} className="text-primary mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">{f.title}</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Registration Form */}
            <form
              onSubmit={submit}
              className="p-6 sm:p-8 flex flex-col justify-between h-auto lg:h-full bg-black/25 overflow-hidden"
            >
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6 shrink-0">
                  <h2 className="text-base font-display font-bold text-white tracking-tight">
                    Step {step}:{" "}
                    {step === 1
                      ? "Account details"
                      : step === 2
                        ? role === "player"
                          ? "Gaming identity"
                          : "Organization details"
                        : role === "player"
                          ? "Profile setup"
                          : "Recruitment setup"}
                  </h2>
                  <span className="text-[10px] text-zinc-400 font-mono">Step {step} of 3</span>
                </div>
                <div className="flex-1 lg:overflow-y-auto pr-0 lg:pr-2 space-y-5 custom-scrollbar lg:max-h-[440px]">
                  {step === 1 && (
                    <div className="space-y-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          label={role === "player" ? "Full name" : "Organization name"}
                          value={role === "player" ? form.fullName : form.organizationName}
                          onChange={(v) =>
                            update(role === "player" ? "fullName" : "organizationName", v)
                          }
                          placeholder="e.g. Alex Mercer"
                          autoComplete="off"
                        />
                        <Input
                          label="Username"
                          value={form.username}
                          onChange={(v) => {
                            update("username", v);
                            if (v.length >= 3) usernameCheck.mutate(v);
                          }}
                          hint={usernameState}
                          placeholder="e.g. shadowhunter"
                          required
                          autoComplete="off"
                        />
                        <Input
                          label="Email"
                          type="email"
                          value={form.email}
                          onChange={(v) => update("email", v)}
                          required
                          placeholder="e.g. player1@example.com"
                          autoComplete="off"
                        />
                        <Input
                          label="Country"
                          value={form.country}
                          onChange={(v) => update("country", v)}
                          placeholder="e.g. India"
                          autoComplete="off"
                        />
                        <Input
                          label="Password"
                          type="password"
                          value={form.password}
                          onChange={(v) => update("password", v)}
                          required
                          placeholder="••••••••"
                          autoComplete="new-password"
                        />
                        <Input
                          label="Confirm password"
                          type="password"
                          value={form.confirmPassword}
                          onChange={(v) => update("confirmPassword", v)}
                          required
                          placeholder="••••••••"
                          autoComplete="new-password"
                        />
                        {role === "player" && (
                          <Input
                            label="Date of birth"
                            type="date"
                            value={form.dateOfBirth}
                            onChange={(v) => update("dateOfBirth", v)}
                            autoComplete="off"
                          />
                        )}
                      </div>

                      {/* Google signup inside register step 1 */}
                      <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-white/5"></div>
                        <span className="flex-shrink mx-4 text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
                          Or Sign Up With
                        </span>
                        <div className="flex-grow border-t border-white/5"></div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="inline-flex w-full items-center justify-center gap-2.5 rounded-md border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-primary/50 px-4 py-3 font-semibold text-white text-xs cursor-pointer transition-all duration-300"
                      >
                        <Chrome size={16} className="text-[#4285F4]" />
                        Continue with Google
                      </button>
                    </div>
                  )}

                  {step === 2 && role === "player" && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* 1. Games Selection Shuffled to the Top */}
                      <div className="md:col-span-2 border-b border-white/5 pb-5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                          Games Played *
                        </span>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {games.map((game) => (
                            <button
                              type="button"
                              key={game.id}
                              onClick={() => toggleGame(game.id)}
                              className={cn(
                                "rounded-md border px-4 py-2 text-xs font-semibold cursor-pointer transition-all duration-300",
                                form.preferredGames.includes(game.id)
                                  ? "glass-auth-item-active text-primary-foreground border-primary shadow-sm"
                                  : "border-white/5 bg-white/[0.01] text-zinc-400 hover:border-primary/50 hover:bg-white/[0.03]",
                              )}
                            >
                              {game.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. Empty State Instructions */}
                      {form.preferredGames.length === 0 ? (
                        <div className="md:col-span-2 py-10 text-center glass-auth-item rounded-xl border border-white/5 p-6 animate-fade-in">
                          <Gamepad2 className="mx-auto text-primary animate-pulse mb-3" size={32} />
                          <h3 className="font-display text-sm font-bold text-white">
                            No games selected
                          </h3>
                          <p className="mt-1.5 text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                            Please select one or more games above to configure your customized
                            ranks, roles, and competitive profile statistics.
                          </p>
                        </div>
                      ) : (
                        /* 3. Dynamic Ranks and Roles Sub-forms per Game */
                        form.preferredGames.map((gameId) => (
                          <div
                            key={gameId}
                            className="md:col-span-2 glass-auth-item rounded-xl border border-white/5 p-5 space-y-4 animate-fade-in relative overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-gold" />

                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                              <h3 className="font-display text-xs font-black text-white flex items-center gap-2 tracking-wider">
                                <Trophy size={14} className="text-primary" />
                                {GAME_CONFIG[gameId]?.name} Profile Details
                              </h3>
                              <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-400 bg-white/[0.03] px-2 py-0.5 rounded">
                                Configure
                              </span>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <Select
                                label="In-Game Role *"
                                value={gameData[gameId]?.role || ""}
                                options={GAME_CONFIG[gameId]?.roles || []}
                                onChange={(v) => {
                                  setGameData((prev) => ({
                                    ...prev,
                                    [gameId]: { ...prev[gameId], role: v },
                                  }));
                                }}
                              />
                              <Select
                                label="Current Rank *"
                                value={gameData[gameId]?.rank || ""}
                                options={GAME_CONFIG[gameId]?.ranks || []}
                                onChange={(v) => {
                                  setGameData((prev) => ({
                                    ...prev,
                                    [gameId]: { ...prev[gameId], rank: v },
                                  }));
                                }}
                              />
                              {GAME_CONFIG[gameId]?.hasUID && (
                                <div className="md:col-span-2">
                                  <Input
                                    label={GAME_CONFIG[gameId]?.uidLabel || "BGMI UID"}
                                    value={gameData[gameId]?.bgmiUID || ""}
                                    onChange={(v) => {
                                      setGameData((prev) => ({
                                        ...prev,
                                        [gameId]: { ...prev[gameId], bgmiUID: v },
                                      }));
                                    }}
                                    placeholder="e.g. 5500112233"
                                    autoComplete="off"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}

                      {/* Global Preferences (Only shown when games are active) */}
                      {form.preferredGames.length > 0 && (
                        <div className="md:col-span-2 grid gap-4 md:grid-cols-2 pt-4 border-t border-white/5">
                          <Select
                            label="Preferred Mode"
                            value={form.preferredMode}
                            options={["Squad", "Duo", "Solo"]}
                            onChange={(v) => update("preferredMode", v)}
                          />
                          <Select
                            label="Play style"
                            value={form.playStyle}
                            options={["Aggressive", "Passive", "Balanced"]}
                            onChange={(v) => update("playStyle", v)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {step === 2 && role === "organization" && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Select
                        label="Organization type"
                        value={form.orgType}
                        options={orgTypes}
                        onChange={(v) => update("orgType", v)}
                      />
                      <Select
                        label="Priority role"
                        value={form.inGameRole}
                        options={roles}
                        onChange={(v) => update("inGameRole", v)}
                      />
                      <Select
                        label="Minimum rank criteria"
                        value={form.rank}
                        options={ranks}
                        onChange={(v) => update("rank", v)}
                      />
                      <Select
                        label="Preferred Mode"
                        value={form.preferredMode}
                        options={["Solo", "Duo", "Squad"]}
                        onChange={(v) => update("preferredMode", v)}
                      />
                      <Select
                        label="Play style"
                        value={form.playStyle}
                        options={["Aggressive", "Passive", "Balanced"]}
                        onChange={(v) => update("playStyle", v)}
                      />
                      <Input
                        label="Website"
                        value={form.website}
                        onChange={(v) => update("website", v)}
                        placeholder="e.g. esportscompany.com"
                        autoComplete="off"
                      />
                      <div className="md:col-span-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                          Games Managed
                        </span>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {games.map((game) => (
                            <button
                              type="button"
                              key={game.id}
                              onClick={() => toggleGame(game.id)}
                              className={cn(
                                "rounded-md border px-3 py-2 text-xs font-semibold cursor-pointer transition-all duration-300",
                                form.preferredGames.includes(game.id)
                                  ? "glass-auth-item-active text-primary-foreground border-primary shadow-sm"
                                  : "border-white/5 bg-white/[0.01] text-zinc-400 hover:border-primary/50 hover:bg-white/[0.03]",
                              )}
                            >
                              {game.shortName}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="grid gap-4">
                      {role === "player" ? (
                        <>
                          <Textarea
                            label="Bio description"
                            value={form.bio}
                            onChange={(v) => update("bio", v)}
                            maxLength={300}
                            placeholder="Tell orgs what makes you a champion..."
                          />
                          <Input
                            label="Languages spoken (comma separated)"
                            value={form.languages}
                            onChange={(v) => update("languages", v)}
                            placeholder="e.g. English, Hindi"
                          />
                          <Toggle
                            label="Open to recruitment requests"
                            checked={form.openToRecruit}
                            onChange={(v) => update("openToRecruit", v)}
                          />
                          <Toggle
                            label="Open to team offers"
                            checked={form.openToTeam}
                            onChange={(v) => update("openToTeam", v)}
                          />
                        </>
                      ) : (
                        <>
                          <Input
                            label="Founded year"
                            value={form.foundedYear}
                            onChange={(v) => update("foundedYear", v)}
                            placeholder="e.g. 2024"
                          />
                          <Input
                            label="Recruitment regions (comma separated)"
                            value={form.recruitmentRegions}
                            onChange={(v) => update("recruitmentRegions", v)}
                            placeholder="e.g. India, South Asia"
                          />
                          <Textarea
                            label="Organization description"
                            value={form.bio}
                            onChange={(v) => update("bio", v)}
                            maxLength={500}
                            placeholder="Outline your org vision, achievements, and partners..."
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>{" "}
                {/* Closes scrollable content container */}
              </div>{" "}
              {/* Closes flex-col wrapper */}
              {/* Navigation Action Footer */}
              <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                {error && (
                  <p className="text-xs text-red-400 font-semibold text-left flex-1">{error}</p>
                )}

                <div className="flex gap-3 ml-auto w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    disabled={step === 1}
                    onClick={() => setStep((current) => Math.max(1, current - 1))}
                    className="rounded-md border border-white/10 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Back
                  </button>
                  {step < totalSteps ? (
                    <button
                      key="btn-continue"
                      type="button"
                      onClick={next}
                      className="rounded-md bg-gradient-gold px-5 py-2.5 text-xs font-bold text-[#141416] shadow-gold uppercase tracking-wider font-display"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      key="btn-submit"
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-md bg-gradient-gold px-5 py-2.5 text-xs font-bold text-[#141416] shadow-gold uppercase tracking-wider font-display"
                    >
                      Create account
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

function RoleCard({
  active,
  icon: Icon,
  title,
  onClick,
}: {
  active: boolean;
  icon: typeof Gamepad2;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3.5 rounded-lg border p-4 text-left transition-all duration-300 cursor-pointer",
        active
          ? "glass-auth-item-active text-primary-foreground shadow-sm"
          : "border-white/5 bg-white/[0.01] text-zinc-400 hover:border-primary/40 hover:bg-white/[0.04]",
      )}
    >
      <Icon size={18} className="text-primary shrink-0" />
      <span className="font-display text-sm font-bold">{title}</span>
    </button>
  );
}

function Input({
  label,
  hint,
  onChange,
  required,
  type = "text",
  ...rest
}: { label: string; hint?: string; onChange: (value: string) => void; required?: boolean } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <label className="block text-left">
      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <div className="relative mt-1.5">
        <input
          {...rest}
          type={inputType}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "glass-auth-input w-full rounded-md px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary",
            isPassword && "pr-10",
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {hint && <span className="mt-1.5 block text-xs text-primary font-semibold">{hint}</span>}
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="glass-auth-input mt-1.5 w-full rounded-md px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-zinc-950 text-white">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Textarea({
  label,
  value,
  maxLength,
  onChange,
  ...rest
}: { label: string; value: string; maxLength?: number; onChange: (value: string) => void } & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange"
>) {
  return (
    <label className="block">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
          {label}
        </span>
        {maxLength && (
          <span className="text-[9px] text-zinc-500 font-mono">
            {value.length} / {maxLength}
          </span>
        )}
      </div>
      <textarea
        value={value}
        maxLength={maxLength}
        {...rest}
        onChange={(e) => onChange(e.target.value)}
        className="glass-auth-input mt-1.5 min-h-28 w-full rounded-md px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary resize-none"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-md border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] p-3 text-xs font-semibold text-zinc-300 transition-colors">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-primary cursor-pointer"
      />
    </label>
  );
}
