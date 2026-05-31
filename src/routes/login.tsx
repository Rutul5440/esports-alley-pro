import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BadgeCheck, Loader2, Sparkles, Trophy, ShieldCheck, Target, Users, Landmark, Chrome } from "lucide-react";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in - ConqLink" }] }),
  component: Login,
});

function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("player");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Listen for Google Auth Popup Response
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "GOOGLE_AUTH_SUCCESS") {
        setError("");
        setLoading(true);
        try {
          const { email, fullName, avatar } = event.data;
          await googleLogin(email, undefined, fullName, avatar);
          navigate({ to: "/dashboard" });
        } catch (err: any) {
          const msg = err?.response?.data?.message || err?.message || "Google login failed. Please try again.";
          setError(msg);
        } finally {
          setLoading(false);
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
      `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes`
    );
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Invalid credentials. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        
        {/* Left Side: Premium Marketing Panel */}
        <section className="flex flex-col justify-between px-6 py-10 sm:px-10 lg:px-16 relative overflow-hidden bg-card/10">
          <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
          
          <Link to="/" className="inline-flex w-fit items-center gap-2 relative z-10">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-gold shadow-gold">
              <Trophy size={20} className="text-primary-foreground" />
            </span>
            <span className="font-display text-xl font-bold">
              Conq<span className="text-gradient-gold">Link</span>
            </span>
          </Link>

          <div className="max-w-2xl py-12 relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles size={14} className="animate-pulse" /> The Esports Professional Pipeline
            </span>
            
            <h1 className="mt-6 text-4xl font-black leading-tight tracking-normal md:text-5xl lg:text-6xl font-display">
              Build proof.<br/>Get scouted.<br/>Drop in.
            </h1>
            
            <p className="mt-5 text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
              ConqLink is the premium professional career platform for gamers. We connect competitive players, 
              game creators, tournament organizers, and top-tier esports clans to bridge the gap from highlight clips to professional contracts.
            </p>

            {/* Premium Feature Grid */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Target,
                  title: "Multi-Game Stats",
                  desc: "One profile to showcase your verified rank tiers, average KD ratios, and match stats across BGMI, CS2, and Valorant.",
                },
                {
                  icon: Landmark,
                  title: "Clan & Org Recruiting",
                  desc: "Tier-1 scouts use our advanced database console to filter and invite players directly by exact in-game roles and KD stats.",
                },
                {
                  icon: ShieldCheck,
                  title: "Automated Scrims",
                  desc: "Host or join registered scrim blocks with verified results submission, real-time analytics, and automated leaderboards.",
                },
                {
                  icon: Users,
                  title: "Gaming Communities",
                  desc: "Establish verified clubs, share strategical posts, upload video highlights, and build active regional follower bases.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-xl border border-border bg-gradient-surface p-5 hover:border-primary/45 transition-colors group">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-3.5 font-display text-sm font-bold text-foreground">{title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground relative z-10 mt-6">
            ConqLink Platform © 2026. Made for elite gamers moving from clips to corporate contracts.
          </p>
        </section>

        {/* Right Side: Welcome Login Form */}
        <section className="flex items-center justify-center border-t border-border bg-gradient-surface px-6 py-12 lg:border-l lg:border-t-0">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background/80 p-6 shadow-elevated sm:p-8 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold">Welcome Back</h2>
                <p className="mt-1.5 text-xs text-muted-foreground">Select role and sign in to ConqLink.</p>
              </div>
              <BadgeCheck className="text-primary mt-1" size={24} />
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-card p-1">
                {(["player", "organization"] as UserRole[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRole(item)}
                    className={cn(
                      "rounded-md py-2.5 text-xs font-bold capitalize transition-colors cursor-pointer",
                      role === item 
                        ? "bg-primary text-primary-foreground shadow-sm font-semibold" 
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item === "player" ? "Player Account" : "Organization"}
                  </button>
                ))}
              </div>
              
              <Field label="Email address" type="email" value={email} onChange={setEmail} required placeholder="e.g. rutul@example.com" />
              <Field label="Password" type="password" value={password} onChange={setPassword} required placeholder="••••••••" />

              {error && <p className="text-xs text-red-500 font-semibold text-left">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-md bg-gradient-gold px-4 py-3 font-bold text-[#141416] shadow-gold disabled:opacity-60 transition-opacity cursor-pointer text-sm"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Log in
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink mx-4 text-[10px] text-zinc-500 uppercase tracking-widest">Or Connect With</span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-md border border-border bg-card hover:bg-white/[0.02] hover:border-primary/50 px-4 py-3 font-semibold text-foreground text-sm cursor-pointer"
              >
                <Chrome size={18} className="text-[#4285F4]" />
                Continue with Google
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              New to ConqLink?{" "}
              <Link to="/register" className="font-bold text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  onChange,
  ...rest
}: { label: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  return (
    <label className="block text-left">
      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</span>
      <input
        {...rest}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </label>
  );
}
