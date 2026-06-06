import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  BadgeCheck,
  Loader2,
  Sparkles,
  Trophy,
  ShieldCheck,
  Target,
  Users,
  Landmark,
  Chrome,
  Eye,
  EyeOff,
} from "lucide-react";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in - Grid Lock" }] }),
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
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Google login failed. Please try again.";
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
      `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes`,
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
    <main className="min-h-screen auth-page-bg flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-y-auto">
      {/* Background radial overlays for extra contrast */}
      <div className="absolute inset-0 bg-black/35 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/50 pointer-events-none" />

      <div className="w-full max-w-6xl glass-auth-card rounded-2xl overflow-hidden grid lg:grid-cols-[1.1fr_0.9fr] relative z-10 animate-fade-in shadow-2xl">
        {/* Left Side: Premium Marketing Panel */}
        <section className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 relative overflow-hidden bg-black/15 border-b lg:border-b-0 lg:border-r border-white/5">
          <div className="absolute inset-0 bg-gradient-hero pointer-events-none opacity-40" />

          <Link to="/" className="inline-flex w-fit items-center gap-3 relative z-10">
            <img
              src="/grid-lock-logo-crop.JPG"
              alt="Grid Lock Logo"
              className="h-12 w-12 rounded-lg object-cover border border-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            />
            <span className="font-display text-2xl font-black uppercase tracking-[0.25em] pl-1.5 text-white transition-all duration-300">
              GRID <span className="text-gradient-gold">LOCK</span>
            </span>
          </Link>

          <div className="max-w-2xl py-8 sm:py-10 relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles size={12} className="animate-pulse" /> The Esports Professional Pipeline
            </span>

            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl font-display text-white">
              Build proof.
              <br />
              Get scouted.
              <br />
              Drop in.
            </h1>

            <p className="mt-4 text-xs leading-5 text-zinc-300 md:text-sm md:leading-6">
              Grid Lock is the premium professional career platform for gamers. We connect
              competitive players, game creators, tournament organizers, and top-tier esports clans
              to bridge the gap from highlight clips to professional contracts.
            </p>

            {/* Premium Feature Grid */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
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
                <div
                  key={title}
                  className="rounded-xl border border-white/5 bg-white/[0.01] p-4 hover:border-primary/45 hover:bg-white/[0.04] transition-all duration-300 group glass-auth-item"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon size={16} />
                  </div>
                  <h3 className="mt-3 font-display text-xs font-bold text-white">{title}</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-zinc-500 relative z-10 mt-6 font-mono">
            Grid Lock Platform © 2026. Made for elite gamers moving from clips to corporate
            contracts.
          </p>
        </section>

        {/* Right Side: Welcome Login Form */}
        <section className="flex items-center justify-center bg-black/25 px-6 py-10 sm:px-10 lg:py-16">
          <div className="w-full max-w-md space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                  Welcome Back
                </h2>
                <p className="mt-1 text-xs text-zinc-400">Select role and sign in to Grid Lock.</p>
              </div>
              <BadgeCheck className="text-primary mt-1" size={24} />
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/5 bg-black/25 p-1">
                {(["player", "organization"] as UserRole[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRole(item)}
                    className={cn(
                      "rounded-md py-2 text-xs font-bold capitalize transition-all cursor-pointer",
                      role === item
                        ? "glass-auth-item-active text-primary-foreground shadow-md font-semibold"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.02]",
                    )}
                  >
                    {item === "player" ? "Player Account" : "Organization"}
                  </button>
                ))}
              </div>

              <Field
                label="Email address"
                type="email"
                value={email}
                onChange={setEmail}
                required
                placeholder="e.g. alex.mercer@example.com"
                autoComplete="off"
              />
              <Field
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />

              {error && <p className="text-xs text-red-400 font-semibold text-left">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-md bg-gradient-gold px-4 py-3 font-bold text-[#141416] shadow-gold disabled:opacity-60 transition-all duration-300 cursor-pointer text-xs uppercase tracking-wider font-display"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Log in
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
                  Or Connect With
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
            </form>

            <p className="mt-6 text-center text-xs text-zinc-400">
              New to Grid Lock?{" "}
              <Link
                to="/register"
                className="font-bold text-primary hover:underline hover:text-primary/80 transition-colors"
              >
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
  required,
  type = "text",
  ...rest
}: { label: string; onChange: (v: string) => void; required?: boolean } & Omit<
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
    </label>
  );
}
