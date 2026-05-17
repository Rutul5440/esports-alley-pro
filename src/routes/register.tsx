import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Trophy, Loader2 } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Sign up — ConqLink" }] }),
  component: Register,
});

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate({ to: "/dashboard" });
    } catch {
      setError("Could not create account");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-background bg-gradient-hero">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="w-10 h-10 rounded-md bg-gradient-gold flex items-center justify-center shadow-gold">
            <Trophy size={20} className="text-primary-foreground" />
          </span>
          <span className="font-display font-bold text-xl">Conq<span className="text-gradient-gold">Link</span></span>
        </Link>

        <div className="bg-gradient-surface border border-border rounded-2xl p-8 shadow-elevated">
          <h1 className="text-2xl font-display font-bold">Create your profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Get scouted. Build your esports career.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Input label="In-game name" value={form.username} onChange={(v) => setForm({ ...form, username: v })} required />
            <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            <Input label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} required minLength={6} />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-gradient-gold text-primary-foreground font-semibold shadow-gold disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Create account
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Already have one?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Input({ label, onChange, ...rest }: { label: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        {...rest}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full px-3 py-2.5 rounded-md bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
      />
    </label>
  );
}
